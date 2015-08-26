'use strict';
angular.module('com.module.protocols')
  .controller('HealthcentersCtrl', function($scope, $state, $stateParams,
    CoreService, gettextCatalog, Healthcenter) {
    var healthcenterId = $stateParams.healthcenterId;
    if (healthcenterId) {
      $scope.healthcenter = Healthcenter.findById({
        id: healthcenterId
      }, function(healthcenter) {
        $scope.protocols = Healthcenter.protocols({
          id: healthcenter.id
        });
      }, function(err) {
        console.log(err);
      });
    } else {
      $scope.healthcenter = {};
    }

    $scope.formFields = [{
      key: 'name',
      type: 'text',
      label: gettextCatalog.getString('Name'),
      required: true
    }];

    $scope.formOptions = {
      uniqueFormId: true,
      hideSubmit: false,
      submitCopy: gettextCatalog.getString('Save')
    };

    $scope.onSubmit = function() {
      Healthcenter.upsert($scope.healthcenter, function() {
        CoreService.toastSuccess(gettextCatalog.getString(
          'Healthcenter saved'), gettextCatalog.getString(
          'Your healthcenter is safe with us!'));
        $state.go('^.list');
      }, function(err) {
        console.log(err);
      });
    };

  });
