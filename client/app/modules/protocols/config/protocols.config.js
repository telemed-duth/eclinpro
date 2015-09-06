'use strict';
angular.module('com.module.protocols')
  .run(function($rootScope, Protocol, gettextCatalog,ProtocolUsage,LoopBackAuth) {
    $rootScope.addMenu(gettextCatalog.getString('Protocols'), 'app.protocols.list',
      'ion ion-document-text');
    var userId=LoopBackAuth.currentUserId;

    Protocol.find(function(protocols) {
      $rootScope.addDashboardBox('All Protocols','bg-yellow', 'ion ion-document-text', protocols.length, 'app.protocols.list','allprotocols');
      $rootScope.addDashboardBox('Protocols I own','bg-green', 'ion ion-document-text', $rootScope.countOwn(protocols,userId), 'app.protocols.list({filtered:"own"})','ownprotocols');
    });

    ProtocolUsage.count({
      where:{
          "userId":userId
        }
    },function(num){
      console.log(num);
        $rootScope.addDashboardBox('Protocols I use','bg-blue', 'ion ion-document-text', num.count, 'app.protocols.list({filtered:\'used\'})','usedprotocols');
    });

  });
