'use strict';
var app = angular.module('com.module.users');

app.controller('UsersCtrl', function($rootScope,$scope, $stateParams, $state, CoreService,Role ,RoleMapping,
  User, gettextCatalog) {
  $scope.user=$rootScope.currentUser;
  $scope.isadmin=$rootScope.isadmin;
  $scope.roles=[];
  Role.find(function(roles){
    roles.forEach(function(role){
      $scope.roles[role.name]=role.id;
    });
  });
  
  $scope.delete = function(id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        User.deleteById(id, function() {
            CoreService.toastSuccess(gettextCatalog.getString(
              'User deleted'), gettextCatalog.getString(
              'Your user is deleted!'));
            $state.go('app.users.list');
          },
          function(err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting user'), gettextCatalog.getString(
              'Your user is not deleted:' + err));
          });
      },
      function() {
        return false;
      });
  };

  $scope.loading = true;
  $scope.users = User.find({
    filter: {
      include: ['roles']
    }
  }, function() {
    $scope.loading = false;
  });

$scope.changeRole=function(){
  if($scope.isAdmin){
    RoleMapping.upsert({
  "principalType": "USER",
  "principalId": $scope.user.id,
  "roleId": $scope.roles["admin"]
  },function(res){
      console.log(res);
    });
  } else {
    RoleMapping.findOne(
      {"principalType": "USER",
      "principalId": $scope.user.id,
      "roleId": $scope.roles["admin"]},function(res){
      RoleMapping.destroyById({id:res.id},function(res){
        console.log(res);
      });
    });
  }
    $scope.user.roles=$scope.isAdmin?['admin']:['user'];
    console.log($scope.user.roles);
    console.log($scope.roles);
    console.log("Admin role id: "+$scope.roles["admin"]);
}
  $scope.onSubmit = function() {
    User.upsert($scope.user, function() {
      CoreService.toastSuccess(gettextCatalog.getString('User saved'),
        gettextCatalog.getString('This user is save!'));
      $state.go('^.list');
    }, function(err) {
      CoreService.toastError(gettextCatalog.getString(
        'Error saving user: ', +err));
    });
  };

  $scope.formFields = [{
    key: 'username',
    type: 'text',
    label: gettextCatalog.getString('Username'),
    required: true
  }, {
    key: 'email',
    type: 'email',
    label: gettextCatalog.getString('E-mail'),
    required: true
  }, {
    key: 'firstName',
    type: 'text',
    label: gettextCatalog.getString('First name'),
    required: true
  }, {
    key: 'lastName',
    type: 'text',
    label: gettextCatalog.getString('Last name'),
    required: true
  }];

  $scope.formOptions = {
    uniqueFormId: true,
    hideSubmit: false,
    submitCopy: gettextCatalog.getString('Save')
  };

});
