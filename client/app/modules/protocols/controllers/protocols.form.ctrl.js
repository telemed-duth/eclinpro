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
  
  //Bioportal search with my API key!!
  //http://data.bioontology.org/search?q=melanoma&include=cui,prefLabel&ontologies=NCIT&suggest=true&display_context=false&display_links=false&apikey=a15281a9-d87d-4c0f-b7aa-31debe0f6449
  
  
var _protocolModel={
  "title": "",
  "active": false,
  "modified": "",
  "created": "",
  "goal_type": "",
  "goal_disease_umls": "",
  "goal_outcomes": [
    "any"
  ],
  "evidence_url": "",
  "evidence_author": "",
  "evidence_date": "",
  
  "data_url": "",
  "data_author": "",
  "data_institute": "",
  
  "release_version": "",
  "release_date": "",
  
  "resources_infastructure": "",
  "resources_human": "",
  
  "cohort_demographics_gender": "",
  "cohort_demographics_occupation": "",
  "cohort_demographics_insurance": "",
  "cohort_demographics_agegroup": "",
  "cohort_demographics_nationality": "",
  "cohort_exposure": [
    "any"
  ],
  "cohort_comorbidities": [
    "any"
  ],
  "cohort_riskfactors": [
    "any"
  ],
  "cohort_symptoms": "",
  "cohort_contraindications": [
    "any"
  ],
  "cohort_medicalhistory": [
    "any"
  ]
};


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
  "type": "object",
  "required": [
    "name",
    "shoesizeLeft"
  ],
  "properties": {
    "name": {
      "title": "Name",
      "description": "Gimme yea name lad",
      "type": "string",
      "pattern": "^[^/]*$",
      "minLength": 2
    },
    "invitation": {
      "type": "string",
      "format": "html",
      "title": "Invitation Design",
      "description": "Design the invitation in full technicolor HTML"
    },
    "favorite": {
      "title": "Favorite",
      "type": "string",
      "enum": [
        "undefined",
        "null",
        "NaN"
      ]
    },
    "healthcenterId": {
      "title": gettextCatalog.getString('Healthcenter'),
      "type": 'string',
      "format": 'uiselect',
      "items": healthcenters.map(function(healthcenter) {
        return {
          value: healthcenter.id,
          label: healthcenter.name
        };
      }),
      placeholder: 'Select healthcenter'
    },
      "dynamicmultiselect": {
        title: 'Dyanmic Multi Select',
        type: 'array',
        format: 'uiselect',
        description: 'Multi single items arre allowed'
      },
      "equipment": {
        title: 'Equipment',
        type: 'array',
        format: 'uiselect',
        description: 'Multi single items arre allowed'
      },
      "asyncselect": {
        title: 'Load Json Async Single Select',
        type: 'string',
        format: 'uiselect',
        description: 'Only single item is allowed'
      },
    "shoesizeLeft": {
      "title": "Shoe size (left)",
      "default": 42,
      "type": "number"
    },
    "shoesizeRight": {
      "title": "Shoe size (right)",
      "default": 42,
      "type": "number"
    },
    "attributes": {
      "type": "object",
      "title": "Attributes",
      "required": [
        "eyecolor"
      ],
      "properties": {
        "eyecolor": {
          "type": "string",
          "format": "color",
          "title": "Eye color",
          "default": "pink"
        },
        "haircolor": {
          "type": "string",
          "title": "Hair color"
        },
        "shoulders": {
          "type": "object",
          "title": "Shoulders",
          "properties": {
            "left": {
              "type": "string",
              "title": "Left"
            },
            "right": {
              "type": "string",
              "title": "Right"
            }
          }
        }
      }
    },
    "things": {
      "type": "array",
      "title": "I like...",
      "items": {
        "type": "string",
        "enum": [
          "clowns",
          "compiling",
          "sleeping"
        ]
      }
    },
    "dislike": {
      "type": "array",
      "title": "I dislike...",
      "items": {
        "type": "string",
        "title": "I hate"
      }
    },
    "soul": {
      "title": "Terms Of Service",
      "description": "I agree to sell my undying <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>soul</a>",
      "type": "boolean",
      "default": true
    },
    "soulserial": {
      "title": "Soul Serial No",
      "type": "string"
    },
    "date": {
      "title": "Date of party",
      "type": "string",
      "format": "date"
    },
    "radio": {
      "title": "Radio type",
      "type": "string",
      "enum": [
        "Transistor",
        "Tube"
      ]
    },
    "radio2": {
      "title": "My Second Radio",
      "type": "string",
      "enum": [
        "Transistor",
        "Tube"
      ]
    },
    "radiobuttons": {
      "type": "string",
      "enum": [
        "Select me!",
        "No me!"
      ]
    }
  }
};
  this.form=[
  {
    "type": "fieldset",
    "title": "Stuff",
    "items": [
      {
        "type": "tabs",
        "tabs": [
          {
            "title": "Simple stuff",
            "items": [
              {
                "key": "name",
                "placeholder": "Check the console",
                "onChange": "log(modelValue)",
                "feedback": "{'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-star': !hasSuccess() }"
              },
              {
                "key": "favorite",
                "feedback": false
              }
            ]
          },
          {
            "title": "More stuff",
            "items": [
              "attributes.eyecolor",
              "attributes.haircolor",
              {
                "key": "attributes.shoulders.left",
                "title": "Left shoulder",
                "description": "This value is copied to attributes.shoulders.right in the model",
                "copyValueTo": [
                  "attributes.shoulders.right"
                ]
              },
              {
                "key": "shoesizeLeft",
                "feedback": false,
                "copyValueTo": [
                  "shoesizeRight"
                ]
              },
              {
                "key": "shoesizeRight"
              },
              {
                "key": "invitation",
                "tinymceOptions": {
                  "toolbar": [
                    "undo redo| styleselect | bold italic | link image",
                    "alignleft aligncenter alignright"
                  ]
                }
              },
              "things",
              "dislike"
            ]
          }
        ]
      }
    ]
  },
  
 "healthcenterId",
 {
   key: 'dynamicmultiselect',
   options: {
     refreshDelay: 100,
     callback: this.bioportalAutocomplete,
     ontologies:"SNOMEDCT,ICD10,SYMP"
   }
  },
 {
   key: 'asyncselect',
   options: {
     refreshDelay: 100,
     callback: this.bioportalAutocomplete,
     ontologies:"ICD10,SNOMEDCT"
   }
 }, 
 {
   key: 'equipment',
   options: {
     refreshDelay: 100,
     callback: this.bioportalAutocomplete,
     ontologies:"SNOMEDCT"
   }
 },
  "soul",
  {
    "type": "conditional",
    "condition": "modelData.soul",
    "items": [
      {
        "key": "soulserial",
        "placeholder": "ex. 666"
      }
    ]
  },
  {
    "key": "date",
    "minDate": "2014-06-20"
  },
  {
    "type": "actions",
    "items": [
      {
        "type": "submit",
        "style": "btn-info",
        "title": "Do It!"
      },
      {
        "type": "button",
        "style": "btn-danger",
        "title": "Noooooooooooo",
        "onClick": "sayNo()"
      }
    ]
  }
];

  

  // this.schema = {
  //   type: 'object',
  //   title: 'Protocol',
  //   properties: {
  //     name: {
  //       title: gettextCatalog.getString('Name'),
  //       type: 'string'
  //     },
  //     healthcenterId: {
  //       title: gettextCatalog.getString('Healthcenter'),
  //       type: 'number',
  //       format: 'uiselect',
  //       items: healthcenters.map(function(healthcenter) {
  //         return {
  //           value: healthcenter.id,
  //           label: healthcenter.name
  //         };
  //       }),
  //       placeholder: 'Select healthcenter'
  //     },
  //     description: {
  //       title: gettextCatalog.getString('Description'),
  //       type: 'string'
  //     },
  //     price: {
  //       title: gettextCatalog.getString('Price'),
  //       type: 'string'
  //     }
  //   },
  //   required: ['name', 'healthcenterId']
  // };

  // this.form = [
  //   'name',
  //   'healthcenterId',
  //   'description',
  //   'price',
  //   {
  //     type: 'submit',
  //     title: 'OK'
  //   }
  // ];
  
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
