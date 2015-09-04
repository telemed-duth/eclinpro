'use strict';
angular.module('com.module.protocols')
  .controller('ProtocolsCtrl', function($scope, $state, $stateParams, CoreService,
    FormHelper, gettextCatalog, Protocol, ProtocolsService,Meta, $rootScope,Bioportal,ProtocolUsage) {


$scope.user=$rootScope.currentUser;
$scope.isadmin=$rootScope.isadmin;
$scope.autocompleteResults=[];
$scope.modelLoaded=false;

var BioportalSplitter=".";
var CategorySplitter="_";
var SpaceSplitter="0";
$scope.uiselectArray=["resources_pharmaceutical","goal_disease","resources_infastructure","resources_human","cohort_exposure","cohort_comorbidities","cohort_riskfactors","cohort_contraindications","cohort_medicalhistory","cohort_symptoms"];
  

  
  $scope.cName=catname;
  $scope.pName=propname;
  
  
//retrieve protocol model
  $scope.requiredProps=[];
  $scope.schemaProps={};
  $scope.formProps=[];
  
  var protocolId = $stateParams.id;
  if (protocolId||$stateParams.parentId ) {
    
    console.log("there is a protocol id");
    Protocol.findById({
      id: protocolId||$stateParams.parentId
    }, function(protocol) {
      console.log(protocol);
      $scope.protocol = protocol;
      $scope.fetchUsage();
      
    }, function(err) {
      console.log(err);
    });

    
  } else {
    $scope.protocol = {};
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
    return capFirst(str.split(CategorySplitter)[1].replace(SpaceSplitter," ")||" ");
  };  
  var catname=function(str){
    return capFirst(str.split(CategorySplitter)[0].replace(SpaceSplitter," ")||" ");
  };


  function buildModel() {
    
    Meta.getModelProperties(function(obj) {
    
    var curModel=obj.Protocol;
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
                if(typeof $scope.protocol[key]==="string"){
                  keyObj.items=[{
                      "label":$scope.protocol[key].split(BioportalSplitter)[1],
                      "value":$scope.protocol[key]
                    }];
                } else if($scope.protocol[key] instanceof Array){
                  //map the string into object for the autocomplete
                  keyObj.items=$scope.protocol[key].map(function(str){
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
                "feedback":false,
                "placeholder":"Add "+propname(key),
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
       
      
            //protocol view/edit
            
            
          //create view tabs from formProps
          console.log($scope.schemaProps);
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
    
    console.log('every time running');
    

    $scope.toggleProtocolUsage = function(id) {
          console.log("fetchUsage----");
          console.log(id);
      if($scope.protocolUsage) {
        if($scope.protocolUsage.id){
          prUsage();
        } else prUsage(true);
      } else console.log("No protocol usage has been defined! look it up!");
  
    };
    
    function prUsage(create){
      
      $scope.protocolUsage.active=!$scope.protocolUsage.active;

      if(create){
          
          if($scope.protocolUsage.active) {
          ProtocolUsage.create($scope.protocolUsage, function(res) {
                      $scope.protocolUsage=res;
  
          CoreService.toastSuccess(gettextCatalog.getString('Protocol usage'),
              gettextCatalog.getString('You are now using this protocol.'));
              
          });
        } else {
          ProtocolUsage.create($scope.protocolUsage, function(res) {
            $scope.protocolUsage=res;
          CoreService.toastSuccess(gettextCatalog.getString('Protocol usage'),
              gettextCatalog.getString('You have stopped using this protocol.'));
          });   
  
        }
      } else {
          if($scope.protocolUsage.active) {
            ProtocolUsage.upsert($scope.protocolUsage, function(res) {
                        $scope.protocolUsage=res;
    
            CoreService.toastSuccess(gettextCatalog.getString('Protocol usage'),
                gettextCatalog.getString('You are now using this protocol.'));
                
            });
          } else {
            ProtocolUsage.upsert($scope.protocolUsage, function(res) {
              $scope.protocolUsage=res;
            CoreService.toastSuccess(gettextCatalog.getString('Protocol usage'),
                gettextCatalog.getString('You have stopped using this protocol.'));
            });   
    
          }
      }
    }

    $scope.delete = function(id) {
      ProtocolsService.deleteProtocol(id, function() {
        updateDashboard();
        $state.go('app.protocols.list', {}, { reload: true });
      });
    };

    
    $scope.fetchUsage=function(){
      var query={
            filter: {
              where:  {
                "userId": $scope.currentUser.id,
                "protocolId": $scope.protocol.id
              }
            }
          };
          
       ProtocolUsage.findOne(query,function(usage) {
          $scope.protocolUsage=usage;
        },function(err){  
          // console.log(err);
          $scope.protocolUsage={
            "userId":$scope.currentUser.id,
            "protocolId":$scope.protocol.id,
            "active":false
          };
          console.log($scope.protocolUsage);
          
        });
      
    };

    $scope.onSubmit = function() {
      if($stateParams.parentId){
          $scope.protocol.id=null;
          delete $scope.protocol['id'];
          $scope.protocol.parentId=$stateParams.parentId;
          Protocol.create($scope.protocol, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Protocol created'),
            gettextCatalog.getString('Your protocol is safe with us!'));
            updateDashboard();

          $state.go('app.protocols.list', {}, { reload: true });
          }, function(err) {
          console.log(err);
          });
      
      } else {
        if($scope.protocol.id){
        Protocol.upsert($scope.protocol, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Protocol saved'),
            gettextCatalog.getString('Your protocol is safe with us!'));
            updateDashboard();

          $state.go('app.protocols.list', {}, { reload: true });
        }, function(err) {
          console.log(err);
        });
        } else {
          Protocol.create($scope.protocol, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Protocol created'),
            gettextCatalog.getString('Your protocol is safe with us!'));
            updateDashboard();
          $state.go('app.protocols.list', {}, { reload: true });
          }, function(err) {
          console.log(err);
          });
        }
      }

    };
    
    function updateDashboard(){
      Protocol.count(function(pr){
        $rootScope.dashboardBox=$rootScope.dashboardBox.map(function(obj){
            if(obj.name==='Protocols') obj.quantity=pr.count;
            return obj;
        });
      });
    };
    
    
    
    //init
    
    
  
    if(!$scope.modelLoaded) buildModel();




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
  