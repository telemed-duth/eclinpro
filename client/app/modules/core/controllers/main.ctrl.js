'use strict';
/**
 * @ngdoc function
 * @name com.module.core.controller:MainCtrl
 * @description Login Controller
 * @requires $scope
 * @requires $state
 * @requires $location
 * @requires CoreService
 * @requires User
 * @requires gettextCatalog
 **/
angular.module('com.module.core')
  .controller('MainCtrl', function($scope, $rootScope, $state,$stateParams, $location,
    CoreService, User, gettextCatalog) {
    
    $scope.currentUser = {};
    User.getCurrent(function(result) {
      User.roles({"id":result.id},function(roles){
      result.roles=roles;
      // roles.map(function(role){
      //   return role.name;
      // });
      $scope.currentUser = result;
      $rootScope.currentUser = result;
          
        //handle permissions on menu
        $scope.menuoptions = $rootScope.menu.filter(function(obj){
          if(obj.sref==='app.users.list'||obj.sref==='app.settings.list'||obj.sref==='app.sandbox.index'){
            if(roles[0]) {
              return roles[0].name=='admin';
            } else return false;
          }
          return true;
        });
        
    });
    }, function(err) {
      console.log(err);
    });

    $scope.logout = function() {
      User.logout(function() {
        $state.go('login');
        CoreService.toastSuccess(gettextCatalog.getString('Logged out'),
          gettextCatalog.getString('You are logged out!'));
      });
    };

  });
