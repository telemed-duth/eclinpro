'use strict';
angular.module('com.module.users')
  .controller('ProfileCtrl', function($scope, CoreService, User, gettextCatalog,$rootScope) {

    $scope.user = $rootScope.currentUser;

    $scope.specialties=["Accident and emergency medicine","Allergology","Anaesthetics","Biological hematology","Cardiology","Child psychiatry","Clinical biology","Clinical chemistry","Clinical neurophysiology","Clinical radiology","Dental, oral and maxillo-facial surgery","Dermato-venerology","Dermatology","Endocrinology","Gastro-enterologic surgery","Gastroenterology","General hematology","General Practice","General surgery","Geriatrics","Immunology","Infectious diseases","Internal medicine","Laboratory medicine","Maxillo-facial surgery","Microbiology","Nephrology","Neuro-psychiatry","Neurology","Neurosurgery","Nuclear medicine","Obstetrics and gynecology","Occupational medicine","Ophthalmology","Orthopaedics","Otorhinolaryngology","Paediatric surgery","Paediatrics","Pathology","Pharmacology","Physical medicine and rehabilitation","Plastic surgery","Podiatric Medicine","Podiatric Surgery","Psychiatry","Public health and Preventive Medicine","Radiology","Radiotherapy","Respiratory medicine","Rheumatology","Stomatology","Thoracic surgery","Tropical medicine","Urology","Vascular surgery","Venereology"];
    $scope.specialtiesObj=$scope.specialties.map(function(str) {return {"label":str,"value":str.replace(" ","_")}});
    console.log($scope.specialtiesObj);
    $scope.formFields = [{
      key: 'username',
      type: 'text',
      label: gettextCatalog.getString('Username'),
      required: true
    }, {
      key: 'email',
      type: 'email',
      label: gettextCatalog.getString('E-mail'),
      required: true
    }, {
      key: 'firstName',
      type: 'text',
      label: gettextCatalog.getString('First name'),
      required: true
    }, {
      key: 'lastName',
      type: 'text',
      label: gettextCatalog.getString('Last name'),
      required: true
    }, {
      key: 'specialty',
      type: 'select',    
      "templateOptions": {
      "label": "Medical Specialty",
      "options":$scope.specialtiesObj
      }
      
    }
];
console.log($scope.formFields);
    $scope.formOptions = {
      uniqueFormId: true,
      hideSubmit: false,
      submitCopy: gettextCatalog.getString('Save')
    };

    $scope.onSubmit = function() {
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
