'use strict';
angular.module('com.module.protocols')
  .run(function($rootScope, Protocol, Healthcenter, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Protocols'),
      'app.protocols.list', 'fa-file');

    Protocol.find(function(data) {
      $rootScope.addDashboardBox(gettextCatalog.getString('Protocols'),
        'bg-yellow', 'ion-ios7-cart-outline', data.length,
        'app.protocols.list');
    });

    Healthcenter.find(function(data) {
      $rootScope.addDashboardBox(gettextCatalog.getString('Healthcenters'),
        'bg-aqua', 'ion-ios7-pricetag-outline', data.length,
        'app.protocols.list');
    });

  });
