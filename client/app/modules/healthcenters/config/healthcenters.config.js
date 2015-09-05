'use strict';
angular.module('com.module.healthcenters')
  .run(function($rootScope, Healthcenter, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Healthcenters'), 'app.healthcenters.list',
      'fa-edit');

    Healthcenter.find(function(healthcenters) {
      $rootScope.addDashboardBox(gettextCatalog.getString('Healthcenters'),
        'bg-red', 'ion-document-text', healthcenters.length, 'app.healthcenters.list');
    });

  });