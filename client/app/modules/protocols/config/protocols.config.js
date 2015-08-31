'use strict';
angular.module('com.module.protocols')
  .run(function($rootScope, Protocol, gettextCatalog) {
    $rootScope.addMenu(gettextCatalog.getString('Protocols'), 'app.protocols.list',
      'fa-edit');

    Protocol.find(function(protocols) {
      $rootScope.addDashboardBox(gettextCatalog.getString('Protocols'),
        'bg-red', 'ion-document-text', protocols.length, 'app.protocols.list');
    });

  });
