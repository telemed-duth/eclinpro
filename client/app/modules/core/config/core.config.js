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
  $rootScope.addDashboardBox = function(name, color, icon, quantity, href, id) {
    $rootScope.dashboardBox.push({
      name: name,
      color: color,
      icon: icon,
      quantity: quantity,
      href: href,
      id: id
    });
  };
  
  // update Dashboard Box
  $rootScope.updateDashboardBox = function(quantity,id) {
   for (var i = 0; i < $rootScope.dashboardBox.length; i++) {
     if($rootScope.dashboardBox[i].id===id){
       $rootScope.dashboardBox[i].quantity=quantity;
     }
   }
  };
  
      
  $rootScope.countOwn=function(protocols,userId){
    var count=0;
    protocols.forEach(function(obj) {
      if (obj.ownerId===userId) count++;
    });
    return count;
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

/*Loading Bar*/
app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}]);


/*Form templates config*/
app.run(function(formlyConfig,CoreService,$http) {
  // NOTE: This next line is highly recommended. Otherwise Chrome's autocomplete will appear over your options!
  formlyConfig.extras.removeChromeAutoComplete = true;
  formlyConfig.setType({
    name: 'async-ui-select',
    extends: 'select',
    templateUrl: 'async-ui-select.html'
  });
  formlyConfig.setType({
    name: 'async-ui-select-multiple',
    extends: 'select',
    templateUrl: 'async-ui-select-multiple.html'
  });
  var unique = 1;
  formlyConfig.setType({
    name: 'repeatSection',
    templateUrl: 'repeatSection.html',
    controller: function($scope) {
      $scope.formOptions = {formState: $scope.formState};
      
      
      $scope.copyFields = function(fields) {
        fields = angular.copy(fields);
        addRandomIds(fields);
        return fields;
      }
      $scope.addNew = function(){
        $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
        var repeatsection = $scope.model[$scope.options.key];
        var lastSection = repeatsection[repeatsection.length - 1];
        var newsection = {};
        // if (lastSection) {
        //   newsection = angular.copy(lastSection);
        // }
        repeatsection.push(newsection);
      }
      
      function addRandomIds(fields) {
        unique++;
        angular.forEach(fields, function(field, index) {
          if (field.fieldGroup) {
            addRandomIds(field.fieldGroup);
            return; // fieldGroups don't need an ID
          }
          
          if (field.templateOptions && field.templateOptions.fields) {
            addRandomIds(field.templateOptions.fields);
          }
          
          field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
        });
      }
      
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
      
      
      //init
      if(!$scope.model[$scope.options.key]){
        $scope.addNew();
      }
      
    }
  });
  formlyConfig.setType({
    name: 'fileUpload',
    templateUrl: 'fileUpload.html',
    controller: function($scope, FileUploader, CoreService) {

  // create a uploader with options
  var uploader = $scope.uploader = new FileUploader({
    scope: $scope, // to automatically update the html. Default: $rootScope
    url: CoreService.env.apiUrl + '/containers/files/upload',
    formData: [{
      key: 'value'
    }]
  });
  
  if($scope.model.technical_file) {
    console.log('loaded initial file');
    uploader.queue.push($scope.model.technical_file);
  }
  // console.log('Add filters and callbacks to the uploader object:', uploader);

  // FILTERS AND CALLBACKS

  //uploader.filters.push({
  //  name: 'customFilter',
  //  fn: function () {
  //    return this.queue.length < 10;
  //  }
  //});

  // CALLBACKS

  //uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
  //  console.info('onWhenAddingFileFailed', item, filter, options);
  //};
  uploader.onAfterAddingFile = function (fileItem) {
    if(!fileItem.isReady && !fileItem.isUploading && !fileItem.isSuccess) fileItem.upload();
  };
  //uploader.onAfterAddingAll = function (addedFileItems) {
  //  console.info('onAfterAddingAll', addedFileItems);
  //};
  //uploader.onBeforeUploadItem = function (item) {
  //  console.info('onBeforeUploadItem', item);
  //};
  //uploader.onProgressItem = function (fileItem, progress) {
  //  console.info('onProgressItem', fileItem, progress);
  //};
  //uploader.onProgressAll = function (progress) {
  //  console.info('onProgressAll', progress);
  //};
  //uploader.onSuccessItem = function (fileItem, response, status, headers) {
  //  console.info('onSuccessItem', fileItem, response, status, headers);
  //};
  //uploader.onErrorItem = function (fileItem, response, status, headers) {
  //  console.info('onErrorItem', fileItem, response, status, headers);
  //};
  //uploader.onCancelItem = function (fileItem, response, status, headers) {
  //  console.info('onCancelItem', fileItem, response, status, headers);
  //};
  uploader.onCompleteItem = function (fileItem, response, status, headers) {
    $scope.model.technical_file={
      file:fileItem.file,
      isCancel: false,
      isError: false,
      isReady: false,
      isSuccess: true,
      isUploaded: true,
      isUploading: false,
      progress: 100,
      removeAfterUpload: false,
      url: "/api//containers/files/upload"
    };
    
    $scope.model.technical_url=CoreService.env.apiUrl+"/containers/files/download/"+fileItem.file.name;
    console.info('onAfterAddingFile', fileItem);
    console.log('Current queue',uploader.queue);
  };
  
  $scope.delete = function(item) {
  CoreService.confirm('Are you sure?','Deleting this cannot be undone',
    function() {
      $http.delete(CoreService.env.apiUrl +
        '/containers/files/files/' + encodeURIComponent(item.file.name)).success(
        function(data, status, headers) {
          console.log(data);
          console.log(status);
          console.log(headers);
          
          $scope.model.technical_file={};
          item.remove();
          CoreService.toastSuccess('File deleted', 'Your file is deleted!');
        });
    },
    function() {
      return false;
    });
};
  //uploader.onCompleteAll = function () {
  //  console.info('onCompleteAll');
  //};

  }
  
  });

  
  
});
