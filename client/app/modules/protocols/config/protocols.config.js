'use strict';
angular.module('com.module.protocols')
  .run(function($rootScope, Protocol, gettextCatalog,ProtocolUsage,LoopBackAuth) {
    $rootScope.addMenu(gettextCatalog.getString('Protocols'), 'app.protocols.list',
      'fa-edit');
    var userId=LoopBackAuth.currentUserId;
    console.log(userId);
    Protocol.find(function(protocols) {
      $rootScope.addDashboardBox('All Protocols','bg-yellow', 'ion-document-text', protocols.length, 'app.protocols.list');
      $rootScope.addDashboardBox('Protocols I own','bg-green', 'ion-document-text', countOwn(protocols), 'app.protocols.list({filtered:"own"})');
    });
    
    function countOwn(protocols){
      var count=0;
      protocols.forEach(function(obj) {
        if (obj.ownerId===userId) count++;
      });
      return count;
    };
    
    ProtocolUsage.count({
      where:{
          "userId":userId
        }
    },function(num){
      console.log(num);
        $rootScope.addDashboardBox('Protocols I use','bg-blue', 'ion-document-text', num.count, 'app.protocols.list({filtered:\'used\'})');
    });

  });
