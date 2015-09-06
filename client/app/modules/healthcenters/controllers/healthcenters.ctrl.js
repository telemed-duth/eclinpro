'use strict';
angular.module('com.module.healthcenters')
  .controller('HealthcentersCtrl', function($scope, $state, $stateParams, CoreService,
    FormHelper, gettextCatalog, Healthcenter, HealthcentersService,Meta, $rootScope,Bioportal,ProtocolApproval,LoopBackAuth) {


$scope.user=LoopBackAuth.currentUserData;
$scope.isadmin=$rootScope.isadmin;
$scope.autocompleteResults=[];
$scope.protocolApproval={};

var BioportalSplitter=".";
var CategorySplitter="_";
var SpaceSplitter="0";
$scope.uiselectArray=["resources_pharmaceutical","goal_disease","resources_infastructure","resources_human","cohort_exposure","cohort_comorbidities","cohort_riskfactors","cohort_contraindications","cohort_medicalhistory","cohort_symptoms"];
  
  
//retrieve healthcenter model
  $scope.requiredProps=[];
  $scope.schemaProps={};
  $scope.formProps=[];
  
  var healthcenterId=$stateParams.id||$stateParams.parentId||'';
  if ( healthcenterId.length===24 ) {
    
    // console.log("there is a healthcenter id");
    Healthcenter.findById({
      id: healthcenterId
    }, function(healthcenter) {
      // console.log(healthcenter);
      $scope.healthcenter = healthcenter;
      // $scope.fetchApproval();
      // $scope.fetchHealthcenters();
      
    }, function(err) {
      $state.go('app.healthcenters.list');
      console.log(err);
    });

    
  } else {
    
    $scope.healthcenter = {};
  }
  

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
  $scope.cName=catname;
  $scope.pName=propname;
  

  function buildModel() {
    
    Meta.getModelProperties(function(obj) {
    
    var curModel=obj.Healthcenter;
    var propCategories=[];
    
        for(var key in curModel){
          
          if( key.indexOf(CategorySplitter)>0 ){ //&& key.indexOf("Id")===-1 && key!=='id' && curModel.hasOwnProperty(key)){
            
            
            //schema builder
            var keyObj={};
            angular.copy(curModel[key],keyObj);
            // if(keyObj.enum) {
            //   keyObj.enum=keyObj.enum.map(function(item){
            //   return item.toString();
            //   });
            // }
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
            } else {
              // console.log('Other types: '+key);
              // console.log(keyObj);
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
                "feedback":false,
                "placeholder":"Add "+propname(key),
                "options": {
                  "refreshDelay": 50,
                  "callback": $scope.bioportalAutocomplete
                }
              };
            } else if(keyObj.enum) {
              //console.log(JSON.stringify(keyObj));
              item=key;
            }
            else {
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
            
            if(key==='release_deviation' && $stateParams.parentId ) {
              propCategories[category].items.push(item);
            } else if(key!=='release_deviation'){
              propCategories[category].items.push(item);
            }
            $scope.schemaProps[key]=keyObj;
          }
        }
        
        $scope.formProps.push({  
          "type":"fieldset",
          "title":"Clinical Healthcenter",
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
       
      
            //healthcenter view/edit
            
            
          //create view tabs from formProps
          // console.log($scope.schemaProps);
          // console.log($scope.formProps);
          $scope.tabs=$scope.formProps[0].items[0].tabs;
          
          $scope.modelLoaded=true;
            
      });
      
      }

  
  

    $scope.schema = {
      type: 'object',
      title: 'Product',
      properties: $scope.schemaProps,
      required: $scope.requiredProps
    };
  
    $scope.form = $scope.formProps;
    
    
    $scope.toggleHealthcenterApproval=function(){
      console.log($scope.protocolApproval);
      if(!$scope.protocolApproval.id){
          ProtocolApproval.create($scope.protocolApproval, function(res) {
          $scope.protocolApproval=res;
          updateDashboard();
          $scope.fetchApproval();
          CoreService.toastSuccess(gettextCatalog.getString('Healthcenter usage'),
              gettextCatalog.getString('You are now using this healthcenter.'));
              
          });
        } else {
          ProtocolApproval.deleteById({"id":$scope.protocolApproval.id}, function(res) {
          updateDashboard();
          $scope.fetchApproval();
          CoreService.toastWarning(gettextCatalog.getString('Healthcenter usage stopped'),
              gettextCatalog.getString('You have stopped using this healthcenter.'));
          });   
  
        }
    }

    $scope.delete = function(id) {
      HealthcentersService.deleteHealthcenter(id, function() {
        updateDashboard();
        $state.go('app.healthcenters.list', {}, { reload: true });
      });
    };

    
    $scope.fetchApproval=function(protocolId){
      var query={
            filter: {
              where:  {
                "protocolId": protocolId,
                "healthcenterId": $scope.healthcenter.id
              }
            }
          };
          
       ProtocolApproval.find(query,function(usages) {
         
        // $scope.fetchUsers();
         if(usages.length>0) {
            $scope.protocolApproval=usages[0];
         } else {
           $scope.protocolApproval={
            "protocolId":protocolId,
            "healthcenterId":$scope.healthcenter.id
          };
         }
        },function(err){  
         console.log(err);
        });
      
    };
    
    
    $scope.fetchUsers=function(){
       Healthcenter.usedBy({id:$scope.healthcenter.id},function(users) {
           if(users.length>0) $scope.pusers=users;
           else $scope.pusers=[{
            "firstName":"Nobody"
          }];
        },function(err){  
          console.log(err);
        });
    };
    
    $scope.fetchHealthcenters=function(){
       Healthcenter.healthcenters({id:$scope.healthcenter.id},function(centers) {
        // console.log(centers);
         if(centers.length>0) $scope.pcenters=centers;
         else  $scope.pcenters=[{
            "name":"No Health centers"
          }];
          
        },function(err){  
          console.log(err);
        });
    };
    

    $scope.onSubmit = function() {
      if($stateParams.parentId){
          $scope.healthcenter.id=null;
          delete $scope.healthcenter['id'];
          $scope.healthcenter.parentId=$stateParams.parentId;
          Healthcenter.create($scope.healthcenter, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Healthcenter created'),
            gettextCatalog.getString('Your healthcenter is safe with us!'));
            updateDashboard();

          $state.go('app.healthcenters.list', {}, { reload: true });
          }, function(err) {
          console.log(err);
          });
      
      } else {
        if($scope.healthcenter.id){
        Healthcenter.upsert($scope.healthcenter, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Healthcenter saved'),
            gettextCatalog.getString('Your healthcenter is safe with us!'));
            updateDashboard();

          $state.go('app.healthcenters.list', {}, { reload: true });
        }, function(err) {
          console.log(err);
        });
        } else {
          Healthcenter.create($scope.healthcenter, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Healthcenter created'),
            gettextCatalog.getString('Your healthcenter is safe with us!'));
            updateDashboard();
          $state.go('app.healthcenters.list', {}, { reload: true });
          }, function(err) {
          console.log(err);
          });
        }
      }

    };
    
    function updateDashboard(){
      Healthcenter.find(function(prs){
        $rootScope.updateDashboardBox(prs.length,'allhealthcenters');
        $rootScope.updateDashboardBox($rootScope.countOwn(prs,$scope.user.id),'ownhealthcenters');
      });
      ProtocolApproval.count({
        where:{
            "protocolId":protocolId
          }
      },function(num){
        $rootScope.updateDashboardBox(num.count,'usedhealthcenters');
      });
    };
    
    //init
    
    
  
    buildModel();




  });
  
     
   //SUPER SEARCH FILTERS!!!
   
  // $scope.availableSearchParams=[];
  // var obj={};
  // for (var key in $scope.schemaProps) {
  //   obj=$scope.schemaProps[key];
  //   if(
  //     obj.type==="string" &&
  //     key!=="release_url" &&
  //     key!=="release_version" &&
  //     key!=="release_date" &&
  //     key!=="evidence_url" &&
  //     key!=="evidence_date"
  //   ) {
  //     // console.log(key+" is inserted to filters");
  //     $scope.availableSearchParams.push({"key":key,"name":catname(key)+" "+propname(key), "placeholder": propname(key)+"..."});
  //   }
  //   }

  //   // console.log(JSON.stringify($scope.schema));
  //   // console.log(JSON.stringify($scope.form));
  //   console.log($scope.schema);
  //   console.log($scope.form);
  // });
  