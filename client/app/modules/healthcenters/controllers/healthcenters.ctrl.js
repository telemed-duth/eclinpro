'use strict';
angular.module('com.module.healthcenters')
  .controller('HealthcentersCtrl', function($scope, $state, $stateParams, CoreService,
    FormHelper, gettextCatalog, Healthcenter, HealthcentersService,$timeout, $rootScope,Bioportal,ProtocolApproval,LoopBackAuth) {


$scope.user=LoopBackAuth.currentUserData;
$scope.isadmin=$rootScope.isadmin;
$scope.autocompleteResults=[];
$scope.protocolApproval={};

  
var healthcenterId=$stateParams.id||'';
if ( healthcenterId.length===24 ) {

// console.log("there is a healthcenter id");
Healthcenter.findById({
  id: healthcenterId
}, function(healthcenter) {
  // console.log(healthcenter);
  $scope.healthcenter = healthcenter;
  loadForm();
  // $scope.fetchApproval();
  // $scope.fetchHealthcenters();
  
}, function(err) {
  $state.go('app.healthcenters.list');
  console.log(err);
});


} else {

$scope.healthcenter = {};
loadForm();
}


//autocomplete fetch from bioportal
$scope.bioportalAutocomplete = function(search,field) {
  if(search.length>2){
  Bioportal.autocomplete(search,field.templateOptions.bioportal)
  .then(function(res){
    var list=res.data.collection;
    if(list.length<1) {
      list.push({
        cui:[-1,0],
        prefLabel:'No Results'
      });
    }    
    $scope.autocompleteResults=field.templateOptions.options=list.map(function(obj){

        var id=obj['cui'][0]; 
        var link=(obj['id']||obj['@id']); 
        return { 
          "label": obj.prefLabel, 
          "id": id,
          "link":link
        };
    });
  },function(err){console.log(err);});
  }
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


    
/*LOGIC FUNCTIONS */    

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
      // var query={
      //       filter: {
      //         where:  {
      //           "protocolId": protocolId,
      //           "healthcenterId": $scope.healthcenter.id
      //         }
      //       }
      //     };
          
      // ProtocolApproval.find(query,function(usages) {
         
      //   // $scope.fetchUsers();
      //   if(usages.length>0) {
      //       $scope.protocolApproval=usages[0];
      //   } else {
      //     $scope.protocolApproval={
      //       "protocolId":protocolId,
      //       "healthcenterId":$scope.healthcenter.id
      //     };
      //   }
      //   },function(err){  
      //   console.log(err);
      //   });
      
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
      // Healthcenter.find(function(prs){
      //   $rootScope.updateDashboardBox(prs.length,'allhealthcenters');
      //   $rootScope.updateDashboardBox($rootScope.countOwn(prs,$scope.user.id),'ownhealthcenters');
      // });
      // ProtocolApproval.count({
      //   where:{
      //       "protocolId":protocolId
      //     }
      // },function(num){
      //   $rootScope.updateDashboardBox(num.count,'usedhealthcenters');
      // });
    };
    
    //init
    
    
  
    


function loadForm(){

$scope.tabs = 
[{
    title: 'General',
    active: true,
    form: {
        options: {},
        model: $scope.healthcenter,
        fields: [{
            key: 'general_name',
            type: 'input',
            templateOptions: {
                label: 'Health center name',
                placeholder: 'Health center name..',
                required: true
            }
        }, {
            key: 'general_desc',
            type: 'textarea',
            templateOptions: {
                label: 'Health center description',
                placeholder: 'Health center description..',
                required: false
            }
        }, {
            key: 'general_location',
            type: 'input',
            templateOptions: {
                label: 'Location',
                placeholder: 'e.g address,city,country, postal code..',
                required: false
            }
        }, {
            "key": "general_type",
            "type": "select",
            "defaultValue": "hospital",
            "templateOptions": {
                "label": "Organization Type",
                "options": [{
                    "name": "Hospital",
                    "value": "hospital"
                }, {
                    "name": "Institution",
                    "value": "institution"
                }, {
                    "name": "Authoritative institution",
                    "value": "authoritative_institution"
                }]
            }
        }]
    }
}, {
    title: 'Resources',
    onselect: function() {
        $timeout(function() {
            $scope.$broadcast('ResourcesTabSelected');
        }, 100)
    },
    form: {
        options: {},
        model: $scope.healthcenter,
        active: false,
        fields: [{
            key: 'resources_human',
            type: 'async-ui-select-multiple',
            templateOptions: {
                label: 'Required Staff',
                placeholder: 'e.g Cardiologist..',
                bioportal: {
                    semantic_types: 'T090,T097'
                },
                labelProp: 'label',
                options: [],
                refresh: $scope.bioportalAutocomplete,
                refreshDelay: 0
            }
        }, {
            key: 'resources_infastructure',
            type: 'async-ui-select-multiple',
            templateOptions: {
                label: 'Special equipment required',
                placeholder: 'e.g magnetic tomography scanner..',
                bioportal: {
                    semantic_types: 'T074,T073'
                },
                labelProp: 'label',
                options: [],
                refresh: $scope.bioportalAutocomplete,
                refreshDelay: 0
            }
        }, {
            key: 'resources_pharmaceutical',
            type: 'async-ui-select-multiple',
            templateOptions: {
                label: 'Special drug requirements',
                placeholder: 'e.g Erythromycin..',
                bioportal: {
                    semantic_types: 'T200'
                },
                labelProp: 'label',
                options: [],
                refresh: $scope.bioportalAutocomplete,
                refreshDelay: 0
            }
        }]
    }

}];


};






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
  