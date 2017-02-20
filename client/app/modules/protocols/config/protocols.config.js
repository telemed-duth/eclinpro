'use strict';
angular.module('com.module.protocols')
  .run(function($rootScope, Protocol, gettextCatalog,ProtocolUsage,LoopBackAuth) {
    $rootScope.addMenu(gettextCatalog.getString('Care Plans'), 'app.protocols.list',
      'ion ion-document-text');
    var userId=LoopBackAuth.currentUserId;

    Protocol.find(function(protocols) {
      $rootScope.addDashboardBox('All Care Plans','bg-yellow', 'ion ion-document-text', protocols.length, 'app.protocols.list','allprotocols');
      $rootScope.addDashboardBox('Care Plans I own','bg-green', 'ion ion-document-text', $rootScope.countOwn(protocols,userId), 'app.protocols.list({filtered:"own"})','ownprotocols');
    });

    ProtocolUsage.count({
      where:{
          "userId":userId
        }
    },function(num){
        $rootScope.addDashboardBox('Care Plans I use','bg-blue', 'ion ion-document-text', num.count, 'app.protocols.list({filtered:\'used\'})','usedprotocols');
    });

  });