'use strict';
angular.module('com.module.healthcenters')
  .controller('HealthcentersCtrl', function($scope, $state, $stateParams, CoreService,
    FormHelper, gettextCatalog, Healthcenter, HealthcentersService, $rootScope,Bioportal,ProtocolApproval,LoopBackAuth) {


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
    
    
  
    


function loadForm(){

$scope.tabs = 
[{
    title: 'General',
    active: true,
    form: {
        options: {},
        model: $scope.protocol,
        fields: [{
            key: 'general_name',
            type: 'input',
            templateOptions: {
                label: 'Protocol name',
                placeholder: 'Protocol name..',
                required: true
            }
        }, {
            key: 'general_desc',
            type: 'input',
            templateOptions: {
                label: 'Protocol description',
                placeholder: 'Protocol description..',
                required: false
            }
        }, {
            "key": "general_type",
            "type": "select",
            "defaultValue": "protocol",
            "templateOptions": {
                "label": "Document Type",
                "options": [{
                    "name": "Protocol",
                    "value": "protocol"
                }, {
                    "name": "Guideline",
                    "value": "guideline"
                }, {
                    "name": "Pathway",
                    "value": "pathway"
                }]
            }
        }, {
            key: 'general_active',
            type: 'checkbox',
            templateOptions: {
                label: 'Protocol active?'
            }
        }]
    }
}, {
    title: 'Technical',
    active: false,
    form: {
        options: {},
        model: $scope.protocol,
        fields: [{
            type: 'repeatSection',
            key: 'technical_sources',
            templateOptions: {
                btnText: 'Add new source',
                fields: [{
                        className: '',
                        fieldGroup: [{
                            "className": "col-xs-4",
                            "key": "technical_type",
                            "type": "select",
                            "defaultValue": "url",
                            "templateOptions": {
                                "label": "Type",
                                "options": [{
                                    "name": "PDF",
                                    "value": "pdf"
                                }, {
                                    "name": "GLIF/xml",
                                    "value": "glif_xml"
                                }, {
                                    "name": "Document",
                                    "value": "doc"
                                }, {
                                    "name": "Image",
                                    "value": "img"
                                }, {
                                    "name": "Url",
                                    "value": "url"
                                }]
                            }
                        }, {
                            "className": "col-xs-4",
                            key: 'technical_institute',
                            type: 'input',
                            templateOptions: {
                                label: 'Institute',
                                placeholder: 'Institute',
                                required: false
                            }
                        }, {
                            "className": "col-xs-4",
                            "key": "technical_license_type",
                            "type": "select",
                            "defaultValue": "http://purl.org/meducator/licenses#Attribution-Share-Alike",
                            "templateOptions": {
                                "label": "License",
                                "options": [{
                                    "name": "Attribution",
                                    "value": "http://purl.org/meducator/licenses#Attribution"
                                },{
                                    "name": "Attribution Share Alike",
                                    "value": "http://purl.org/meducator/licenses#Attribution-Share-Alike"
                                },{
                                    "name": "Attribution No Derivatives",
                                    "value": "http://purl.org/meducator/licenses#Attribution-No-Derivatives"
                                },{
                                    "name": "Attribution Non Commercial",
                                    "value": "http://purl.org/meducator/licenses#Attribution-Non-Commercial"
                                },{
                                    "name": "Attribution Non Commercial Share Alike",
                                    "value": "http://purl.org/meducator/licenses#Attribution-Non-Commercial-Share-Alike"
                                },{
                                    "name": "Attribution Non Commercial No Derivatives",
                                    "value": "http://purl.org/meducator/licenses#Attribution-Non-Commercial-No-Derivatives"
                                }
                                ]
                            }
                        }
                        ]
                    }, 
                    {
                        className: '',
                        fieldGroup: [
                          {
                      "className": "col-xs-12",
                        key: 'technical_file',
                        type: 'fileUpload',
                        templateOptions: {
                            label: 'File upload'
                        },
                        hideExpression: 'model.technical_type==="url"'
                    }, {
                     "className": "col-xs-12",
                        key: 'technical_url',
                        type: 'input',
                        templateOptions: {
                            label: 'URL source',
                            placeholder: 'e.g www.google.com or http://www.google.com'
                        },
                        hideExpression: 'model.technical_type!=="url"'
                    }
                    ]
                  }

                ]
            }
        }]
    }
}, {
    title: 'Evidence',
    active: false,
    evidence: true
}, {
    title: 'Intention',
    active: false,
    form: {
        options: {},
        model: $scope.protocol,
        fields: [{
            "key": "intention_type",
            "type": "select",
            "defaultValue": 'diagnostic',
            "templateOptions": {
                "label": "Intention type",
                "options": [{
                    "name": "Diagnostic",
                    "value": "diagnostic"
                }, {
                    "name": "Therapeutic",
                    "value": "therapeutic"
                }, {
                    "name": "Management",
                    "value": "management"
                }, {
                    "name": "Preventative",
                    "value": "preventative"
                }]
            }
        }, {
            key: 'intention_disease',
            type: 'async-ui-select',
            templateOptions: {
                label: 'Intention disease',
                placeholder: 'Intention disease..',
                bioportal: {
                    ontologies: 'ICD10',
                    semantic_types: 'T047'
                },
                onselect: function(item) {
                    $scope.protocol.intention_disease = item;
                },
                valueProp: 'id',
                labelProp: 'label',
                options: [],
                refresh: $scope.bioportalAutocomplete,
                refreshDelay: 0
            }
        }]
    }
}, {
    title: 'Outcomes',
    active: false,
    outcome: true
}, {
    title: 'Initial Conditions',
    form: {
        options: {},
        model: $scope.protocol,
        fields: [{
            key: 'initial_expression',
            type: 'input',
            templateOptions: {
                label: 'Initial Conditions',
                placeholder: 'Initial Conditions..'
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
        model: $scope.protocol,
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
}, {
    title: 'Divergion',
    active: false,
    hide: true,
    form: {
        options: {},
        model: $scope.protocol,
        fields: [

            {
                "key": "divergion_type",
                "type": "select",
                "templateOptions": {
                    "label": "Type",
                    "options": [{
                        "name": "Deviation",
                        "value": "deviation"
                    }, {
                        "name": "Variation",
                        "value": "variation"
                    }, {
                        "name": "Update",
                        "value": "update"
                    }, {
                        "name": "Regulatory compliance",
                        "value": "regulatory"
                    }, {
                        "name": "Uniformity",
                        "value": "uniformity"
                    }, {
                        "name": "Other",
                        "value": "other"
                    }]
                }
            }, {
                key: 'divergion_other',
                type: 'input',
                templateOptions: {
                    label: 'Diverging reason',
                    placeholder: 'Reason'
                }
            },
        ]
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
  