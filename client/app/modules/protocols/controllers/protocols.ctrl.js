'use strict';
angular.module('com.module.protocols')
  .controller('ProtocolsCtrl', function ($scope, $state, $stateParams,
                                        CoreService, gettextCatalog, Protocol, Healthcenter) {

    var protocolId = $stateParams.id;
    var HealthcenterId = $stateParams.HealthcenterId;

    if (protocolId) {
      $scope.protocol = Protocol.findById({
        id: protocolId
      }, function (protocol) {
        protocol.Healthcenter = Protocol.Healthcenter({
          id: protocol.id
        });
      }, function (err) {
        console.log(err);
      });
    } else {
      $scope.protocol = {};
    }

    if (HealthcenterId) {
      $scope.protocol.HealthcenterId = HealthcenterId;
    }

    function loadItems() {
      $scope.categories = [];
      Healthcenter.find(function (categories) {
        angular.forEach(categories, function (Healthcenter) {
          Healthcenter.protocols = Healthcenter.protocols({
            id: Healthcenter.id
          });
          this.push(Healthcenter);
        }, $scope.categories);
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

    $scope.deleteHealthcenter = function (id) {
      Healthcenter.deleteById(id, function () {
        CoreService.toastSuccess(gettextCatalog.getString(
          'Healthcenter deleted'), gettextCatalog.getString(
          'Your Healthcenter is deleted!'));
        loadItems();
      }, function (err) {
        CoreService.toastError(gettextCatalog.getString(
          'Error deleting Healthcenter'), gettextCatalog.getString(
            'Your Healthcenter is not deleted: ') + err);
      });
    };
  });
