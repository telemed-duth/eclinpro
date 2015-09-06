'use strict';
angular.module('com.module.healthcenters')
  .run(function($rootScope, Healthcenter, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Health Centers'), 'app.healthcenters.list',
      'fa fa-hospital-o');

    Healthcenter.find(function(healthcenters) {
      $rootScope.addDashboardBox(gettextCatalog.getString('Healthcenters'),
        'bg-red', 'fa fa-hospital-o', healthcenters.length, 'app.healthcenters.list','healthcenters');
    });

  });
