'use strict';

var app = angular.module('com.module.protocols');

app.config(function($stateProvider) {
  $stateProvider.state('app.protocols', {
    abstract: true,
    url: '/protocols',
    templateUrl: 'modules/protocols/views/main.html',
    controller: 'ProtocolsCtrl',
    controllerAs: 'ctrl'
  }).state('app.protocols.list', {
    url: '',
    templateUrl: 'modules/protocols/views/list.html',
    resolve: {
      protocols: ['ProtocolsService', function(ProtocolsService) {
        return ProtocolsService.getProtocols();
      }]
    },
    controller: function($scope, protocols) {
      $scope.protocols = protocols;
    }
  }).state('app.protocols.add', {
    url: '/add',
    templateUrl: 'modules/protocols/views/form.html',
    controller: 'ProtocolsCtrl'
  }).state('app.protocols.edit', {
    url: '/:id/edit',
    templateUrl: 'modules/protocols/views/form.html',
    controller: 'ProtocolsCtrl'
  }).state('app.protocols.view', {
    url: '/:id',
    templateUrl: 'modules/protocols/views/view.html',
    resolve: {
      protocol: ['$stateParams', 'ProtocolsService', function($stateParams,
        ProtocolsService) {
        return ProtocolsService.getProtocol($stateParams.id);
      }]
    },
    controller: function($scope, protocol) {
      $scope.protocol = protocol;
    }
  });
});
