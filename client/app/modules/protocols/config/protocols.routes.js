'use strict';

var app = angular.module('com.module.protocols');

app.config(function($stateProvider) {
  $stateProvider.state('app.protocols', {
    abstract: true,
    url: '/protocols',
    templateUrl: 'modules/protocols/views/main.html',
    controller: 'ProtocolsCtrl',
  }).state('app.protocols.list', {
    url: '',
    params: {
        filtered: 'all',
    },
    templateUrl: 'modules/protocols/views/list.html',
    resolve: {
      protocols: ['ProtocolsService', function(ProtocolsService) {
        return ProtocolsService.getProtocols();
      }]
    },
    controller: function($scope, protocols,$stateParams,LoopBackAuth) {
      $scope.filtered=$stateParams.filtered;
      $scope.$parent.filtered=$stateParams.filtered;
      if($scope.filtered==='own') {
        $scope.protocols=protocols.filter(function(pr){
          return pr.ownerId===LoopBackAuth.currentUserId;
        });
      } else if($scope.filtered==='used') {
        $scope.protocols=protocols.filter(function(pr){
          if(pr.usedBy instanceof Array){
            for (var i = pr.usedBy.length; i--; ) {
              if(pr.usedBy[i].id===LoopBackAuth.currentUserId) return true;
            }
          } else return false;
        });
      } else {
        $scope.protocols = protocols;
      }
    }
  }).state('app.protocols.add', {
    url: '/add',
    templateUrl: 'modules/protocols/views/form.html',
    controller: 'ProtocolsCtrl'
  }).state('app.protocols.edit', {
    url: '/:id/edit',
    templateUrl: 'modules/protocols/views/form.html',
    controller: 'ProtocolsCtrl',
    data: {
      permissions: {
        only: ['admin','protocolowner'],
        redirectTo: 'app.protocols.list'
      }
    }
  }).state('app.protocols.deviate', {
    url: '/:parentId/deviate',
    templateUrl: 'modules/protocols/views/form.html',
    controller: 'ProtocolsCtrl'
  }).state('app.protocols.view', {
    url: '/:id',
    templateUrl: 'modules/protocols/views/view.html',
    controller: 'ProtocolsCtrl'
  });
});
