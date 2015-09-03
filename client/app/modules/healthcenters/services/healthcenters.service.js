'use strict';
var app = angular.module('com.module.healthcenters');

app.service('HealthcentersService', ['CoreService', 'gettextCatalog', 'Healthcenter', function(
  CoreService, gettextCatalog, Healthcenter) {

  this.getHealthcenters = function() {
    return Healthcenter.find({
      filter: {
        order: 'created DESC'
      }
    }).$promise;
  };

  this.getHealthcenter = function(id) {
    return Healthcenter.findById({
      id: id
    }).$promise;
  };

  this.deleteHealthcenter = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        Healthcenter.deleteById(id, function() {
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
