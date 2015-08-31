'use strict';
/*global angular */
var app = angular.module('com.module.protocols');

function ProtocolsFormCtrl($scope,$http,$state, CoreService, Protocol, gettextCatalog, healthcenters, protocol,Meta,Bioportal) {

  var self = this;
  
  //retrieve protocol model
  var protocolModel={};
  Meta.getModelProperties(function(obj) {
    protocolModel=obj.Protocol;
    console.log(protocolModel);
    
  });


$scope.autocompleteResults=[];

//autocomplete fetch from bioportal
this.bioportalAutocomplete = function(schema, options, search) {
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

  this.protocol = protocol;
  
  
  this.schema={
   "type":"object",
   "required":[
      "release_active",
      "goal_type",
      "demographics_gender"
   ],
   "properties":{
      "goal_type":{
         "title":"Type",
         "type":"string",
         "enum":[
            "prevention",
            "diagnosis",
            "management",
            "therapeutic"
         ]
      },
      "goal_disease":{
         "title":"Disease",
         "type":"string",
         "format":"uiselect"
      },
      "goal_outcomes":{
         "title":"Outcomes",
         "type":"array",
         "items":{
            "title":"Outcome",
            "type":"string"
         }
      },
      "release_url":{
         "title":"release_url",
         "type":"string"
      },
      "release_author":{
         "title":"release_author",
         "type":"string"
      },
      "release_institute":{
         "title":"release_institute",
         "type":"string"
      },
      "release_title":{
         "title":"release_title",
         "type":"string"
      },
      "release_version":{
         "title":"release_version",
         "type":"string"
      },
      "release_date":{
         "title":"release_date",
         "type":"date"
      },
      "release_active":{
         "title":"release_active",
         "type":"boolean",
         "default":true
      },
      "evidence":{
         "type":"array",
         "title":"evidence",
         "items":{
            "evidence_url":{
               "title":"Url",
               "type":"string"
            },
            "evidence_author":{
               "title":"evidence_author",
               "type":"string"
            },
            "evidence_date":{
               "title":"evidence_date",
               "type":"date"
            }
         }
      },
      "resources_infastructure":{
         "title":"resources_infastructure",
         "type":"array",
         "format":"uiselect"
      },
      "resources_human":{
         "title":"resources_human",
         "type":"array",
         "format":"uiselect"
      },
      "demographics_gender":{
         "title":"demographics_gender",
         "type":"string",
         "enum":[
            "male",
            "female",
            "both"
         ]
      },
      "demographics_occupation":{
         "title":"demographics_occupation",
         "type":"string"
      },
      "demographics_insurance":{
         "title":"demographics_insurance",
         "type":"string"
      },
      "demographics_agegroup":{
         "title":"demographics_agegroup",
         "type":"string"
      },
      "demographics_nationality":{
         "title":"demographics_nationality",
         "type":"string"
      },
      "cohort_exposure":{
         "title":"cohort_exposure",
         "type":"array",
         "format":"uiselect"
      },
      "cohort_comorbidities":{
         "title":"cohort_comorbidities",
         "type":"array",
         "format":"uiselect"
      },
      "cohort_riskfactors":{
         "title":"cohort_riskfactors",
         "type":"array",
         "format":"uiselect"
      },
      "cohort_contraindications":{
         "title":"cohort_contraindications",
         "type":"array",
         "format":"uiselect"
      },
      "cohort_medicalhistory":{
         "title":"cohort_medicalhistory",
         "type":"array",
         "format":"uiselect"
      },
      "cohort_symptoms":{
         "title":"cohort_demographics_occupation",
         "type":"array",
         "format":"uiselect"
      }
   }
};
  this.form=[
  {
    "type": "fieldset",
    "title": "Clinical Protocol",
    "items": [
      {
        "type": "tabs",
        "tabs": [
          {
            "title": "Release",
            "items": [
              {
                "key": "release_title",
                "feedback": false
              },
              {
                "key": "release_active",
                "feedback": false
              },
              {
                "key": "release_version",
                "feedback": false
              },
              {
                "key": "release_url",
                "feedback": false
              },
              {
                "key": "release_author",
                "feedback": false
              },
              {
                "key": "release_institute",
                "feedback": false
              },

            ]
          },
          {
            "title": "Goal",
            "items": [
              {
                "key": "goal_type",
                "feedback": false
              },
              {
                "key": "goal_disease",
                "options": {
                  "refreshDelay": 100,
                  "callback": this.bioportalAutocomplete,
                  "ontologies":"ICD10,SNOMEDCT"
                }
              },
              {
                "key": "goal_outcomes",
                "feedback": false
              }
            ]
          },
          {
            "title": "Resources",
            "items": [
              {
                "key": "resources_human",
                "options": {
                  "refreshDelay": 100,
                  "callback": this.bioportalAutocomplete,
                  "ontologies":"SNOMEDCT"
                }
              },
              {
                "key": "resources_infastructure",
                "options": {
                  "refreshDelay": 100,
                  "callback": this.bioportalAutocomplete,
                  "ontologies":"SNOMEDCT"
                }
              }
            ]
          },
          {
            "title": "Demographics",
            "items": [
              {
                "key": "demographics_gender",
                "feedback": false
              },
              {
                "key": "demographics_occupation",
                "feedback": false
              },
              {
                "key": "demographics_insurance",
                "feedback": false
              },
              {
                "key": "demographics_agegroup",
                "feedback": false
              },
              {
                "key": "demographics_nationality",
                "feedback": false
              }
            ]
          },
          {
            "title": "Initial Conditions",
            "items": [
              {
                "key": "cohort_exposure",
                "options": {
                  "refreshDelay": 100,
                  "callback": this.bioportalAutocomplete,
                  "ontologies":"ICD10,SNOMEDCT"
                }
              },
              {
                "key": "cohort_comorbidities",
                "options": {
                  "refreshDelay": 100,
                  "callback": this.bioportalAutocomplete,
                  "ontologies":"ICD10,SNOMEDCT"
                }
              },
              {
                "key": "cohort_riskfactors",
                "options": {
                  "refreshDelay": 100,
                  "callback": this.bioportalAutocomplete,
                  "ontologies":"ICD10,SNOMEDCT"
                }
              },
              {
                "key": "cohort_symptoms",
                "options": {
                  "refreshDelay": 100,
                  "callback": this.bioportalAutocomplete,
                  "ontologies":"ICD10,SNOMEDCT"
                }
              },
              {
                "key": "cohort_contraindications",
                "options": {
                  "refreshDelay": 100,
                  "callback": this.bioportalAutocomplete,
                  "ontologies":"ICD10,SNOMEDCT"
                }
              },
              {
                "key": "cohort_medicalhistory",
                "options": {
                  "refreshDelay": 100,
                  "callback": this.bioportalAutocomplete,
                  "ontologies":"ICD10,SNOMEDCT"
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "type": "actions",
    "items": [
      {
        "type": "submit",
        "style": "btn-info",
        "title": "Submit"
      },
      {
        "type": "button",
        "style": "btn-danger",
        "title": "Cancel",
        "onClick": "sayNo()"
      }
    ]
  }
];
  
  $scope.schema=this.schema;

  this.onSubmit = function() {

    Protocol.upsert(self.protocol, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Protocol saved'), gettextCatalog.getString(
        'Your protocol is safe with us!'));
      $state.go('^.list');
    }, function(err) {
      console.log(err);
    });
  };
}

app.controller('ProtocolsFormCtrl', ProtocolsFormCtrl);
