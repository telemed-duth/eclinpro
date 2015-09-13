'use strict';
angular.module('com.module.protocols')
  .controller('ProtocolsCtrl', function($http,$scope, $state, $stateParams, CoreService,
    FormHelper, gettextCatalog, Protocol, ProtocolsService, $rootScope,Bioportal,$timeout,ProtocolUsage,LoopBackAuth) {


$scope.user=LoopBackAuth.currentUserData;
$scope.isadmin=$rootScope.isadmin;
$scope.autocompleteResults=[];
$scope.protocolUsage={};
$scope.evidence={};

var BioportalSplitter=".";
var CategorySplitter="_";
var SpaceSplitter="0";
$scope.uiselectArray=["resources_pharmaceutical","goal_disease","resources_infastructure","resources_human","cohort_exposure","cohort_comorbidities","cohort_riskfactors","cohort_contraindications","cohort_medicalhistory","cohort_symptoms"];
  
  
//retrieve protocol model
$scope.requiredProps=[];
$scope.schemaProps={};
$scope.formProps=[];


  /*USEFUL HELPERS*/
$scope.capFirst=function(str) { return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); }
var propname=function(str){
  return $scope.capFirst(str.split(CategorySplitter)[1]||" ");
};  
var catname=function(str){
  return $scope.capFirst(str.split(CategorySplitter)[0]||" ");
};
$scope.cName=catname;
$scope.pName=propname;
$scope.arrayNames=function(arr){
  console.log(arr);
  if(arr instanceof Array) return arr.map(function(val){
    return bName(val);
  }).join(", ");
  else return bName(arr);
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

//autocomplete for pubmed
$scope.searchPubmed = function(search) {
  var newsearch=search;
  if($scope.evidence.exactPubMedSearch) newsearch='"'+search+'"';
  if(search.length>4||$scope.evidence.exactPubMedSearch){
    $scope.loadingSelect = true;
    return $http.jsonp(
      'http://www.ebi.ac.uk/europepmc/webservices/rest/search/query='+newsearch
      +'&resulttype=lite&format=json&callback=JSON_CALLBACK'
    ).then(function(response) {
      var list=response.data.resultList.result;
      if(list.length<1) {
        list.push({
          title:'No Results'
        });
      }
      $scope.pubmedResults = list;
      });
  }
};

/*OUTCOMES*/
$scope.outcome={};
$scope.outcome.types=["primary","secondary","other"];
$scope.addOutcome=function(item,model){
  if(!$scope.protocol.outcomes) $scope.protocol.outcomes=[];
  var itemExist=false;
  for (var i=0,l=$scope.protocol.outcomes.length;i<l;i++){
    if(item.id===$scope.protocol.outcomes[i].id) {
      itemExist=true;
      break;
    }
  }
  if(!itemExist){
    item.type=""+$scope.outcome.selectedType;
    $scope.protocol.outcomes.push(item);
  }
};
$scope.removeOutcome=function(index){
  $scope.protocol.outcomes.splice(index,1);
};

/*Evidence*/
$scope.addPubmedArticle=function(item,model){
  $scope.pubmedResults=[];
  if(!$scope.protocol.evidences) $scope.protocol.evidences=[];
  var itemExist=false;
  for (var i=0,l=$scope.protocol.evidences.length;i<l;i++){
    if(item.pmid===$scope.protocol.evidences[i].pmid) {
      itemExist=true;
      break;
    }
  }
  if(!itemExist){
    $scope.protocol.evidences.push({
      "title":item.title,
      "pmid":item.pmid,
      "authorString":item.authorString,
      "pubYear":item.pubYear
    });
  }
};
$scope.removePubmedArticle=function(index){
  $scope.protocol.evidences.splice(index,1);
};


/*CHECK FOR PROTOCOL ID or EDIT/VIEW/LIST*/

var protocolId=$stateParams.id||$stateParams.parentId||'';
if ( protocolId.length===24 ) {
  
  // console.log("there is a protocol id");
  Protocol.findById({
    id: protocolId
  }, function(protocol) {
    // console.log(protocol);
    $scope.protocol = protocol;
    $scope.fetchUsage();
    $scope.fetchHealthcenters();
    
  }, function(err) {
    $state.go('app.protocols.list');
    console.log(err);
  });
  
} else {
  $scope.protocol = {};
}


/*logic functions*/

$scope.toggleProtocolUsage=function(){
  console.log($scope.protocolUsage);
  if(!$scope.protocolUsage.id){
      ProtocolUsage.create($scope.protocolUsage, function(res) {
      $scope.protocolUsage=res;
      updateDashboard();
      $scope.fetchUsage();
      CoreService.toastSuccess(gettextCatalog.getString('Protocol usage'),
          gettextCatalog.getString('You are now using this protocol.'));
          
      });
    } else {
      ProtocolUsage.deleteById({"id":$scope.protocolUsage.id}, function(res) {
      updateDashboard();
      $scope.fetchUsage();
      CoreService.toastWarning(gettextCatalog.getString('Protocol usage stopped'),
          gettextCatalog.getString('You have stopped using this protocol.'));
      });   

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
            "userId": $scope.user.id,
            "protocolId": $scope.protocol.id
          }
        }
      };
      
   ProtocolUsage.find(query,function(usages) {
     
    $scope.fetchUsers();
     if(usages.length>0) {
        $scope.protocolUsage=usages[0];
     } else {
       $scope.protocolUsage={
        "userId":$scope.user.id,
        "protocolId":$scope.protocol.id
      };
     }
    },function(err){  
     console.log(err);
    });
  
};


$scope.fetchUsers=function(){
   Protocol.usedBy({id:$scope.protocol.id},function(users) {
       if(users.length>0) $scope.pusers=users;
       else $scope.pusers=[{
        "firstName":"Nobody"
      }];
    },function(err){  
      console.log(err);
    });
};

$scope.fetchHealthcenters=function(){
   Protocol.healthcenters({id:$scope.protocol.id},function(centers) {
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
  Protocol.find(function(prs){
    $rootScope.updateDashboardBox(prs.length,'allprotocols');
    $rootScope.updateDashboardBox($rootScope.countOwn(prs,$scope.user.id),'ownprotocols');
  });
  ProtocolUsage.count({
    where:{
        "userId":$scope.user.id
      }
  },function(num){
    $rootScope.updateDashboardBox(num.count,'usedprotocols');
  });
};





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


    



});
//end of controller  
     
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
  