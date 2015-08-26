'use strict';
angular.module('com.module.protocols')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.protocols', {
        abstract: true,
        url: '/protocols',
        templateUrl: 'modules/protocols/views/main.html'
      })
      .state('app.protocols.list', {
        url: '',
        templateUrl: 'modules/protocols/views/list.html',
        controller: 'ProtocolsCtrl'
      })
      .state('app.protocols.add', {
        url: '/add/:healthcenterId',
        templateUrl: 'modules/protocols/views/form.html',
        controller: 'ProtocolsFormCtrl',
        controllerAs: 'ctrl',
        resolve: {
          healthcenters: function (Healthcenter) {
            return Healthcenter.find().$promise;
          },
          protocol: function ($stateParams) {
            return {
              healthcenterId: $stateParams.healthcenterId
            };
          }
        }
      })
      .state('app.protocols.edit', {
        url: '/:protocolId/edit',
        templateUrl: 'modules/protocols/views/form.html',
        controller: 'ProtocolsFormCtrl',
        controllerAs: 'ctrl',
        resolve: {
          healthcenters: function (Healthcenter) {
            return Healthcenter.find().$promise;
          },
          protocol: function ($stateParams, Protocol) {
            return Protocol.findById({id: $stateParams.protocolId}).$promise;
          }
        }
      })
      .state('app.protocols.addhealthcenter', {
        url: '/addhealthcenter',
        templateUrl: 'modules/protocols/views/healthcenterform.html',
        controller: 'HealthcentersCtrl'
      })
      .state('app.protocols.view', {
        url: '/:protocolId',
        templateUrl: 'modules/protocols/views/view.html',
        resolve: {
          protocol: function ($stateParams, Protocol) {
            return Protocol.findById({id: $stateParams.protocolId}).$promise;
          }
        },
        controller: function (protocol) {
          this.protocol = protocol;
        },
        controllerAs: 'ctrl'
      })
      .state('app.protocols.edithealthcenter', {
        url: '/edithealthcenter/:healthcenterId',
        templateUrl: 'modules/protocols/views/healthcenterform.html',
        controller: 'HealthcentersCtrl'
      });
  });
