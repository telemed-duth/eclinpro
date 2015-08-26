'use strict';
angular.module('com.module.protocols')
  .controller('ProtocolsCtrl', function ($scope, $state, $stateParams,
                                        CoreService, gettextCatalog, Protocol, Healthcenter) {

    var protocolId = $stateParams.id;
    var healthcenterId = $stateParams.healthcenterId;

    if (protocolId) {
      $scope.protocol = Protocol.findById({
        id: protocolId
      }, function (protocol) {
        protocol.healthcenter = Protocol.healthcenter({
          id: protocol.id
        });
      }, function (err) {
        console.log(err);
      });
    } else {
      $scope.protocol = {};
    }

    if (healthcenterId) {
      $scope.protocol.healthcenterId = healthcenterId;
    }

    function loadItems() {
      $scope.healthcenters = [];
      Healthcenter.find(function (healthcenters) {
        angular.forEach(healthcenters, function (healthcenter) {
          healthcenter.protocols = Healthcenter.protocols({
            id: healthcenter.id
          });
          this.push(healthcenter);
        }, $scope.healthcenters);
      });
    }

    loadItems();

    $scope.delete = function (id) {
      CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function () {
          Protocol.deleteById(id, function () {
            CoreService.toastSuccess(gettextCatalog.getString(
              'Protocol deleted'), gettextCatalog.getString(
              'Your protocol is deleted!'));
            loadItems();
            $state.go('app.protocols.list');
          }, function (err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting protocol'), gettextCatalog.getString(
                'Your protocol is not deleted: ') + err);
          });
        },
        function () {
          return false;
        });
    };

    $scope.deletehealthcenter = function (id) {
      Healthcenter.deleteById(id, function () {
        CoreService.toastSuccess(gettextCatalog.getString(
          'Healthcenter deleted'), gettextCatalog.getString(
          'Your healthcenter is deleted!'));
        loadItems();
      }, function (err) {
        CoreService.toastError(gettextCatalog.getString(
          'Error deleting healthcenter'), gettextCatalog.getString(
            'Your healthcenter is not deleted: ') + err);
      });
    };
  });
