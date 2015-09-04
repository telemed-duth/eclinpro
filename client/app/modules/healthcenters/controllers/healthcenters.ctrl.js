'use strict';
angular.module('com.module.healthcenters')
  .controller('HealthcentersCtrl', function($scope, $state, $stateParams, CoreService,
    FormHelper, gettextCatalog, Healthcenter, HealthcentersService,Meta, $rootScope,Bioportal) {
      
var test_setting_val=$rootScope.getSetting("com.module.healthcenters.release_active");
console.log(test_setting_val);
$scope.user=$rootScope.currentUser;
$scope.isadmin=$rootScope.isadmin;

$scope.autocompleteResults=[];

var BioportalSplitter=".";
var CategorySplitter="_";

//autocomplete fetch from bioportal
$scope.bioportalAutocomplete = function(schema, options, search) {
  Bioportal.autocomplete(schema, options, search)
  .then(function(res){
    $scope.autocompleteResults=res.data.collection.map(function(obj){
      if(obj){
        var id=!!obj['cui']?obj['cui'][0]:(obj['id']||obj['@id']); 
        return { "label": obj.prefLabel, "value": id+BioportalSplitter+obj.prefLabel  };
      }
    });
  },function(err){console.log(err);});
  return $scope.autocompleteResults;  
};


  function capFirst(str) { return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); }
  var propname=function(str){
    return capFirst(str.split(CategorySplitter)[1]||" ");
  };  
  var catname=function(str){
    return capFirst(str.split(CategorySplitter)[0]||" ");
  };
  
//retrieve healthcenter model
  var curModel={};
  $scope.healthcenter={}
  $scope.requiredProps=[];
  $scope.schemaProps={};
  $scope.formProps=[];
  
  $scope.uiselectArray=["resources_pharmaceutical","goal_disease","resources_infastructure","resources_human","cohort_exposure","cohort_comorbidities","cohort_riskfactors","cohort_contraindications","cohort_medicalhistory","cohort_symptoms"];
  Meta.getModelProperties(function(obj) {
    
    curModel=obj.Healthcenter;
    var propCategories=[];
    
        for(var key in curModel){
          
          if( key.indexOf(CategorySplitter)>0 ){ //&& key.indexOf("Id")===-1 && key!=='id' && curModel.hasOwnProperty(key)){
            
            
            //schema builder
            var keyObj={};
            angular.copy(curModel[key],keyObj);
            
            keyObj.title=gettextCatalog.getString(propname(key));
            if(keyObj.required){$scope.requiredProps.push(key);}
            keyObj.type=(curModel[key].stringType==="objectid")?"string":curModel[key].stringType;
            if($scope.uiselectArray.indexOf(key)>=0){
              keyObj.format="uiselect";
              keyObj.items=[];
                if(typeof $scope.healthcenter[key]==="string"){
                  keyObj.items=[{
                      "label":$scope.healthcenter[key].split(BioportalSplitter)[1],
                      "value":$scope.healthcenter[key]
                    }];
                } else if($scope.healthcenter[key] instanceof Array){
                  //map the string into object for the autocomplete
                  keyObj.items=$scope.healthcenter[key].map(function(str){
                    return {
                      "label":str.split(BioportalSplitter)[1],
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
            var category=catname(key);
            var item={};
            propCategories[category]=propCategories[category] || {
              "title":category,
              "items":[]
            }
            
            if(keyObj.format) {
              item={
                "key":key,
                "placeholder":"Add "+propname(key),
                "feedback":true,
                "options": {
                  "refreshDelay": 50,
                  "callback": $scope.bioportalAutocomplete
                }
              };
            } else {
              item={
                "key":key,
                "placeholder":"Add "+propname(key),
                "feedback":true,
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
        
        
    $scope.formProps.push(
      {  
      "type":"fieldset",
      "title":"Health center",
      "items":[{
        "type": "tabs",
        "tabs": Object.keys(propCategories).map(function (key) {return propCategories[key]})
      }]
    },
    {  
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
      title: 'Health center',
      properties: $scope.schemaProps,
      required: $scope.requiredProps
    };
  
    $scope.form = $scope.formProps;


    $scope.delete = function(id) {
      HealthcentersService.deleteHealthcenter(id, function() {
        $state.reload();
      });
    };

    var healthcenterId = $stateParams.id;

    if (healthcenterId) {
      $scope.healthcenter = Healthcenter.findById({
        id: healthcenterId
      }, function() {}, function(err) {
        console.log(err);
      });
    } else {
      $scope.healthcenter = {};
    }


    
    $scope.onSubmit = function() {
      if($scope.healthcenter.id){
        Healthcenter.upsert($scope.healthcenter, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Health center saved'),
            gettextCatalog.getString('Your healthcenter is safe with us!'));
          $state.go('app.healthcenters.list');
        }, function(err) {
          console.log(err);
        });
      } else {
        Healthcenter.create($scope.healthcenter, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Health center created'),
            gettextCatalog.getString('Your healthcenter is safe with us!'));
          $state.go('app.healthcenters.list');
        }, function(err) {
          console.log(err);
        });
      }

    };

  });
