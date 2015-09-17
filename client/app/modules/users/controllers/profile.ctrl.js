'use strict';
angular.module('com.module.users')
  .controller('ProfileCtrl', function($scope, CoreService, User, gettextCatalog,$rootScope,Bioportal) {

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
    fields: [{
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
      key: 'firstName',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('First name'),
        placeholder: 'First name..',
        required: true
      }
    },{
      key: 'lastName',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Last name'),
        placeholder: 'Last name..',
        required: true
      }
    },{
      key: 'specialty',
      type: 'async-ui-select',
      templateOptions: {
          label: 'Medical Specialty',
          placeholder: 'e.g Cardiologist..',
          bioportal: {
              semantic_types: 'T090,T097'
          },
          labelProp: 'label',
          options: [],
          refresh: $scope.bioportalAutocomplete,
          refreshDelay: 0,
          required: true
      }
  }
]
}

    $scope.onSubmit = function() {
      console.log($scope.user);
      User.upsert($scope.user, function() {
        CoreService.toastSuccess(gettextCatalog.getString(
          'Profile saved'), gettextCatalog.getString(
          'Enjoy the new you!'));
      }, function(err) {
        CoreService.toastError(gettextCatalog.getString(
          'Error saving profile'), gettextCatalog.getString(
          'Your profile is not saved: ') + err);
      });
    };

  });
