'use strict';
angular.module('com.module.protocols')
  .controller('ProtocolsCtrl', function($scope, $state, $stateParams, CoreService,
    FormHelper, gettextCatalog, Protocol, ProtocolsService,Meta, $rootScope,Bioportal) {
      
var test_setting_val=$rootScope.getSetting("com.module.protocols.release_active");
console.log(test_setting_val);

$scope.autocompleteResults=[];

$scope.BioportalSplitter=".";
$scope.CategorySplitter="_";

//autocomplete fetch from bioportal
$scope.bioportalAutocomplete = function(schema, options, search) {
  Bioportal.autocomplete(schema, options, search)
  .then(function(res){
    $scope.autocompleteResults=res.data.collection.map(function(obj){
      if(obj){
        var id=!!obj['cui']?obj['cui'][0]:(obj['id']||obj['@id']); 
        return { "label": obj.prefLabel, "value": id+$scope.BioportalSplitter+obj.prefLabel  };
      }
    });
  },function(err){console.log(err);});
  return $scope.autocompleteResults;  
};

  
//retrieve protocol model
  var curModel={};
  $scope.protocol={}
  $scope.requiredProps=[];
  $scope.schemaProps={};
  $scope.formProps=[];
  
  $scope.uiselectArray=["goal_disease","resources_infastructure","resources_human","cohort_exposure","cohort_comorbidities","cohort_riskfactors","cohort_contraindications","cohort_medicalhistory","cohort_symptoms"];
  Meta.getModelProperties(function(obj) {
    
    curModel=obj.Protocol;
    var propCategories=[];
    
        for(var key in curModel){
          
          if( key.indexOf($scope.CategorySplitter)>0 ){ //&& key.indexOf("Id")===-1 && key!=='id' && curModel.hasOwnProperty(key)){
            
            
            //schema builder
            var keyObj={};
            angular.copy(curModel[key],keyObj);
            
            keyObj.title=gettextCatalog.getString(key);
            if(keyObj.required){$scope.requiredProps.push(key);}
            keyObj.type=(curModel[key].stringType==="objectid")?"string":curModel[key].stringType;
            if($scope.uiselectArray.indexOf(key)>=0){
              keyObj.format="uiselect";
              keyObj.items=[];
                if(typeof $scope.protocol[key]==="string"){
                  keyObj.items=[{
                      "label":$scope.protocol[key].split($scope.BioportalSplitter)[1],
                      "value":$scope.protocol[key]
                    }];
                } else if($scope.protocol[key] instanceof Array){
                  //map the string into object for the autocomplete
                  keyObj.items=$scope.protocol[key].map(function(str){
                    return {
                      "label":str.split($scope.BioportalSplitter)[1],
                      "value":str
                    };
                  });
                }
              
            } else if (keyObj.type==="array"){
              keyObj.items={
                  "title":keyObj.title,
                  "type":"string"
              };
            }
            
            delete keyObj['required'];
            delete keyObj['stringType'];
            
            //form builder
            var category=key.split($scope.CategorySplitter)[0];
            var item={};
            propCategories[category]=propCategories[category] || {
              "title":category,
              "items":[]
            }
            
            if(keyObj.format) {
              item={
                "key":key,
                "feedback":false,
                "options": {
                  "refreshDelay": 100,
                  "callback": $scope.bioportalAutocomplete
                }
              };
            } else {
              item={
                "key":key,
                "feedback":false,
              };
            }
            
            //do foreign key stuff
            // var foreignModel=key.toString().split('Id')[0];
            // console.log(foreignModel);
            // keyObj.format="uiselect";
            // keyObj.items=categories.map(function(category) {
            //   return {
            //     value: category.id,
            //     label: category.name
            //   };
            // });
            
            propCategories[category].items.push(item);
            $scope.schemaProps[key]=keyObj;
          }
        }
        
    $scope.formProps.push({  
      "type":"fieldset",
      "title":"Clinical Protocol",
      "items":[{
        "type": "tabs",
        "tabs": Object.keys(propCategories).map(function (key) {return propCategories[key]})
      }]
    });      
        
        
    $scope.formProps.push({  
      "type":"actions",
      "items":[  
         {  
            "type":"submit",
            "style":"btn-info",
            "title":"Submit"
         },
         {  
            "type":"button",
            "style":"btn-danger",
            "title":"Cancel",
            "onClick":"sayNo()"
         }
      ]
   });
   
    
    // console.log(JSON.stringify($scope.schema));
    // console.log(JSON.stringify($scope.form));
    console.log($scope.schema);
    console.log($scope.form);
  });
  
  
  

    $scope.schema = {
      type: 'object',
      title: 'Product',
      properties: $scope.schemaProps,
      required: $scope.requiredProps
    };
  
    $scope.form = $scope.formProps;


    $scope.delete = function(id) {
      ProtocolsService.deleteProtocol(id, function() {
        $state.reload();
      });
    };

    var protocolId = $stateParams.id;

    if (protocolId) {
      $scope.protocol = Protocol.findById({
        id: protocolId
      }, function() {}, function(err) {
        console.log(err);
      });
    } else {
      $scope.protocol = {};
    }


    $scope.onSubmit = function() {
      Protocol.upsert($scope.protocol, function() {
        CoreService.toastSuccess(gettextCatalog.getString('Protocol saved'),
          gettextCatalog.getString('Your protocol is safe with us!'));
        $state.go('^.list');
      }, function(err) {
        console.log(err);
      });
    };

  });
