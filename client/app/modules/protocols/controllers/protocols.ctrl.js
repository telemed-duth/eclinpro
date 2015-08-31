'use strict';
angular.module('com.module.protocols')
  .controller('ProtocolsCtrl', function($scope, $state, $stateParams, CoreService,
    FormHelper, gettextCatalog, Protocol, ProtocolsService,Meta) {
      



$scope.autocompleteResults=[];

//autocomplete fetch from bioportal
$scope.bioportalAutocomplete = function(schema, options, search) {
  Bioportal.autocomplete(schema, options, search)
  .then(function(res){
    $scope.autocompleteResults=res.data.collection.map(function(obj){
      if(obj){
        var id=!!obj['cui']?obj['cui'][0]:(obj['id']||obj['@id']); 
        return { "label": obj.prefLabel, "value": id  };
      }
    });
  },function(err){console.log(err);});
  return $scope.autocompleteResults;  
};

  
//retrieve protocol model
  var curModel={};
  $scope.requiredProps=[];
  $scope.schemaProps={};
  $scope.formProps=[];
  
  $scope.uiselectArray=["goal_disease","resources_infastructure","resources_human","cohort_exposure","cohort_comorbidities","cohort_riskfactors","cohort_contraindications","cohort_medicalhistory","cohort_symptoms"];
  Meta.getModelProperties(function(obj) {
    
    curModel=obj.Protocol;
    var propCategories=[];
    
        for(var key in curModel){
          
          if( key.indexOf("_")>0 ){ //&& key.indexOf("Id")===-1 && key!=='id' && curModel.hasOwnProperty(key)){
            
            
            //schema builder
            var keyObj={};
            angular.copy(curModel[key],keyObj);
            
            keyObj.title=gettextCatalog.getString(key);
            if(keyObj.required){$scope.requiredProps.push(key);}
            keyObj.type=(curModel[key].stringType==="objectid")?"string":curModel[key].stringType;
            if($scope.uiselectArray.indexOf(key)>0){
              keyObj.format="uiselect";
            } else if (key.type==="array"){
              keyObj.items={
                  "title":keyObj.title,
                  "type":"string"
              }
            }
            
            delete keyObj['required'];
            delete keyObj['stringType'];
            
            //form builder
            var category=key.split("_")[0];
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
        "type": "tabs",
        "tabs": Object.keys(propCategories).map(function (key) {return propCategories[key]})
    });      
        
    console.log($scope.schemaProps);
    console.log($scope.formProps);
        
    $scope.formProps.push({
      type: 'submit',
      title: 'OK'
    });
    
  });
  
  
  

    this.schema = {
      type: 'object',
      title: 'Product',
      properties: $scope.schemaProps,
      required: ['name', 'categoryId']
    };
  
    this.form = $scope.formProps;


    $scope.delete = function(id) {
      ProtocolsService.deleteProtocol(id, function() {
        $state.reload();
      });
    };

    this.formHelper = new FormHelper(Protocol);
    $scope.cancel = function() {
      console.log('Cancel');
      console.log(this.formHelper);
      //this.formHelper.cancel('app.protocols.list');
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

    $scope.formFields = [{
      key: 'title',
      type: 'text',
      label: gettextCatalog.getString('Title'),
      required: true
    }, {
      key: 'content',
      type: 'textarea',
      label: gettextCatalog.getString('Content'),
      required: true
    }, {
      key: 'image',
      type: 'text',
      label: gettextCatalog.getString('image'),
      required: true
    }];

    $scope.formOptions = {
      uniqueFormId: true,
      hideSubmit: false,
      submitCopy: gettextCatalog.getString('Save')
    };

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
