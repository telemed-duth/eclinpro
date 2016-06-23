'use strict';
angular.module('com.module.healthcenters')
  .run(function($rootScope, Healthcenter, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Issuing Bodies'), 'app.healthcenters.list',
      'fa fa-hospital-o');

    Healthcenter.find(function(healthcenters) {
      $rootScope.addDashboardBox(gettextCatalog.getString('Issuing Bodies'),
        'bg-red', 'fa fa-hospital-o', healthcenters.length, 'app.healthcenters.list','healthcenters');
    });

  });
