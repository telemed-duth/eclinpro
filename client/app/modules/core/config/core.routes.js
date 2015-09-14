'use strict';
angular.module('com.module.core')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('router', {
        url: '/router',
        template: '<div class="lockscreen" style="height: 100%"></div>',
        controller: 'RouteCtrl'
      })
      .state('error', {
        url: '/error',
        template: '<div class="text-center alert alert-danger" style="margin: 100px">An error occurred.</div>'
      })
      .state('front', {
        abstract: true,
        url: '/show',
        templateUrl: '',
        controller: ''
      })
      .state('front.list', {
          url: '/protocols',
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
      })
      .state('app', {
        abstract: true,
        url: '',
        templateUrl: 'modules/core/views/app.html',
        controller: 'MainCtrl'
      })
      .state('app.home', {
        url: '/app',
        templateUrl: 'modules/core/views/home.html',
        controller: 'HomeCtrl',
        resolve: {
          visdata: function ($stateParams, Vis) {
            return Vis.data();
          }
        }
      });
    $urlRouterProvider
    .otherwise( function($injector) {
      var $state = $injector.get("$state");
      $state.go('app.home');
    });
  });
