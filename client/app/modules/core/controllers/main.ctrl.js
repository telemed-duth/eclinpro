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
    
    
    
    $scope.currentUser = $rootScope.currentUser;
    $scope.isadmin = $rootScope.isadmin;
    
    
    User.getCurrent(function(result) {
      
      User.roles({"id":result.id},function(roles){
      result.roles=roles;
      $scope.currentUser = result;
      $rootScope.currentUser = result;
      if(roles[0]) {
          if(roles[0].name==='admin'){
            console.log('Admin asserted!');
            $rootScope.isadmin=true;
            $scope.isadmin=true;
          }
      }
      
          
      //handle permissions on menu
      $scope.menuoptions = $rootScope.menu.filter(function(obj){
        if(obj.sref==='app.users.list'||obj.sref==='app.settings.list'){
          return $scope.isadmin;
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
