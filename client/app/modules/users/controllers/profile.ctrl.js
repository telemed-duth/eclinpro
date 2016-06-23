'use strict';
angular.module('com.module.users')
  .controller('ProfileCtrl', function($scope, CoreService, User, gettextCatalog,$rootScope,Bioportal,$resource,$timeout) {

    $scope.user = $rootScope.currentUser;
    

//autocomplete fetch from bioportal
$scope.bioportalAutocomplete = function(search,field) {
  if(search.length>2){
    $scope.loading = true;
  Bioportal.autocomplete(search,field.templateOptions.bioportal)
  .then(function(res){
    $scope.loading=false;
    var list=res.data.collection;
    if(list.length<1) {
      list.push({
        cui:[Math.random()*1000,0],
        prefLabel:search
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

$scope.form= {
    options: {},
    model: $scope.user,
    fields: [
      {
      key: 'firstName',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Health unit'),
        placeholder: 'PGNA..',
        required: true
      }
    },{
      key: 'username',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Username'),
        placeholder: 'Username..',
        required: true
      }
    }, {
      key: 'email',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Email'),
        placeholder: 'Email..',
        type: 'email',
        required: true
      }
    },{
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
        }
]
};  
    
    var urlBase = "/api";
var UserUpdate = $resource(
    urlBase + '/users/:id',{id:'@id'},
    {"upsert": { url: urlBase + "/users/:id", method: "PUT"}}
 );
    $scope.onSubmit = function() {
      console.log($scope.user);
      $timeout(function(){
        
      UserUpdate.upsert($scope.user, function() {
        CoreService.toastSuccess(gettextCatalog.getString(
          'Profile saved'), gettextCatalog.getString(
          'Enjoy the new you!'));
      }, function(err) {
        CoreService.toastError(gettextCatalog.getString(
          'Error saving profile'), gettextCatalog.getString(
          'Your profile is not saved: ') + err);
      });
        
      },10)
    };

  });
