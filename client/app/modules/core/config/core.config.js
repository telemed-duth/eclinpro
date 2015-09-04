'use strict';
var app = angular.module('com.module.core');
app.run(function($rootScope, Setting, gettextCatalog,Permission,User,ProtocolsService,HealthcentersService,$q) {


   
    //angular-permission
     Permission.defineRole('admin', function (stateParams) {
          var deferred = $q.defer();
          
          User.getCurrent(function (user) {
            
            User.roles({"id":user.id}).$promise.then(function(roles){
              
              if(roles[0]) {
                  if(roles[0].name==='admin'){
                    console.log('Admin asserted!');
                    $rootScope.isadmin=true;
                    deferred.resolve();
                  } else deferred.reject();
              } else deferred.reject();
            }, function () {
              // Error with request
              deferred.reject();
            });
            
          }, function () {
            // Error with request
            deferred.reject();
          });
          return deferred.promise;
      });
      
      
      Permission.defineRole('protocolowner', function (stateParams) {
          var deferred = $q.defer();
          User.getCurrent(function (user) {
            
            ProtocolsService.getProtocol(stateParams.id).then(function(protocol){
              if(protocol.ownerId==user.id) deferred.resolve();
              else deferred.reject();
            }, function () {
            // Error with request
              deferred.reject();
            });
            
          }, function () {
            // Error with request
            deferred.reject();
          });
          return deferred.promise;
      });      
      
      Permission.defineRole('healthcenterowner', function (stateParams) {
          var deferred = $q.defer();
          User.getCurrent(function (user) {
            
            HealthcentersService.getHealthcenter(stateParams.id).then(function(protocol){
              if(protocol.ownerId==user.id) deferred.resolve();
              else deferred.reject();
            }, function () {
            // Error with request
              deferred.reject();
            });
            
          }, function () {
            // Error with request
            deferred.reject();
          });
          return deferred.promise;
      });


  // Left Sidemenu
  $rootScope.menu = [];

  // Add Sidebar Menu //filterout non-admin menus
  $rootScope.addMenu = function(name, uisref, icon) {
      $rootScope.menu.push({
        name: name,
        sref: uisref,
        icon: icon
      });
  };

  // Add Menu Dashboard
  $rootScope.addMenu(gettextCatalog.getString('Dashboard'), 'app.home',
    'fa-dashboard');

  // Dashboard
  $rootScope.dashboardBox = [];

  // Add Dashboard Box
  $rootScope.addDashboardBox = function(name, color, icon, quantity, href) {
    $rootScope.dashboardBox.push({
      name: name,
      color: color,
      icon: icon,
      quantity: quantity,
      href: href
    });
  };

  // Get Settings for Database
  $rootScope.setSetting = function(key, value) {

    Setting.find({
      filter: {
        where: {
          key: key
        }
      }
    }, function(data) {

      if (data.length) {
        data[0].value = value;
        data[0].$save();
      } else {
        Setting.create({
          key: key,
          value: value
        }, function(data) {
          console.log(data);
        });
      }
      $rootScope.loadSettings();
    });
  };

  // Load Settings blank
  $rootScope.settings = {};

  // Get Settings for Loopback Service
  $rootScope.loadSettings = function() {
    Setting.find(function(settings) {
      $rootScope.settings.data = settings;
    });
  };

});

app.config(function(formlyConfigProvider) {
  var templates = 'modules/core/views/elements/fields/';
  var formly = templates + 'formly-field-';
  var fields = [
    'checkbox',
    'email',
    'hidden',
    'number',
    'password',
    'radio',
    'select',
    'text',
    'textarea'
  ];

  angular.forEach(fields, function(val) {
    formlyConfigProvider.setTemplateUrl(val, formly + val + '.html');
  });

  formlyConfigProvider.setTemplateUrl('date', templates + 'date.html');
  formlyConfigProvider.setTemplateUrl('time', templates + 'time.html');

});

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}]);
