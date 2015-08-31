'use strict';
var app = angular.module('com.module.protocols');

app.service('ProtocolsService', ['CoreService', 'gettextCatalog', 'Protocol', function(
  CoreService, gettextCatalog, Protocol) {

  this.getProtocols = function() {
    return Protocol.find({
      filter: {
        order: 'created DESC'
      }
    }).$promise;
  };

  this.getProtocol = function(id) {
    return Protocol.findById({
      id: id
    }).$promise;
  };

  this.deleteProtocol = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        Protocol.deleteById(id, function() {
          CoreService.toastSuccess(gettextCatalog.getString(
            'Item deleted'), gettextCatalog.getString(
            'Your item has been deleted!'));
          cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString('Oops'),
            gettextCatalog.getString('Error deleting item: ') +
            err);
          cb();
        });
      },
      function() {
        return false;
      });
  };

}]);
