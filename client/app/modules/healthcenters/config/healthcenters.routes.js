'use strict';

var app = angular.module('com.module.healthcenters');

app.config(function($stateProvider) {
  $stateProvider.state('app.healthcenters', {
    abstract: true,
    url: '/healthcenters',
    templateUrl: 'modules/healthcenters/views/main.html',
    controller: 'HealthcentersCtrl',
    controllerAs: 'ctrl'
  }).state('app.healthcenters.list', {
    url: '',
    templateUrl: 'modules/healthcenters/views/list.html',
    resolve: {
      healthcenters: ['HealthcentersService', function(HealthcentersService) {
        return HealthcentersService.getHealthcenters();
      }]
    },
    controller: function($scope, healthcenters) {
      $scope.healthcenters = healthcenters;
    }
  }).state('app.healthcenters.add', {
    url: '/add',
    templateUrl: 'modules/healthcenters/views/form.html',
    controller: 'HealthcentersCtrl'
  }).state('app.healthcenters.edit', {
    url: '/:id/edit',
    templateUrl: 'modules/healthcenters/views/form.html',
    controller: 'HealthcentersCtrl',
    data: {
      permissions: {
        only: ['admin','healthcenterowner'],
        redirectTo: 'app.healthcenters.list'
      }
    }
  }).state('app.healthcenters.view', {
    url: '/:id',
    templateUrl: 'modules/healthcenters/views/view.html',
    resolve: {
      healthcenter: ['$stateParams', 'HealthcentersService', function($stateParams,
        HealthcentersService) {
        return HealthcentersService.getHealthcenter($stateParams.id);
      }]
    },
    controller: function($scope, healthcenter) {
      $scope.healthcenter = healthcenter;
    }
  });
});
