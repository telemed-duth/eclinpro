'use strict';
/**
 * @ngdoc overview
 * @name loopbackApp
 * @description
 * # loopbackApp
 *
 * Main module of the application.
 */
var app = angular.module('loopbackApp', [
    'angular-loading-bar',
    'angular.filter',
    'angularFileUpload',
    'oitozero.ngSweetAlert',
    'config',
    'cb.x2js',
    'formly',
    'formlyBootstrap',
    'lbServices',
    'monospaced.elastic',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngVis',
    'ui.bootstrap',
    'ui.gravatar',
    'ui.router',
    'toasty',
    'autofields',
    'gettext',
    'angular-underscore/filters',
    'schemaForm',
    'ui.select',
    "angular-advanced-searchbox",
    'com.module.core',
    'com.module.files',
    'com.module.protocols',
    'com.module.healthcenters',
    'com.module.settings',
    'com.module.users',
    'permission'
  ]);
  
  app.run(function (formlyConfig) {
  /*
   ngModelAttrs stuff
   */
  var ngModelAttrs = {};

  function camelize (string) {
    string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    // Ensure 1st char is always lowercase
    return string.replace(/^([A-Z])/, function (match, chr) {
      return chr ? chr.toLowerCase() : '';
    });
  }

  /*
   timepicker
   */
  ngModelAttrs = {};

  // attributes
  angular.forEach([
    'meridians',
    'readonly-input',
    'mousewheel',
    'arrowkeys'
  ], function (attr) {
    ngModelAttrs[camelize(attr)] = {attribute: attr};
  });

  // bindings
  angular.forEach([
    'hour-step',
    'minute-step',
    'show-meridian'
  ], function (binding) {
    ngModelAttrs[camelize(binding)] = {bound: binding};
  });

  formlyConfig.setType({
    name: 'timepicker',
    template: '<timepicker ng-model="model[options.key]"></timepicker>',
    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    defaultOptions: {
      ngModelAttrs: ngModelAttrs,
      templateOptions: {
        timepickerOptions: {}
      }
    }
  });

  formlyConfig.setType({
    name: 'datepicker',
    template: '<datepicker ng-model="model[options.key]" ></datepicker>',
    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    defaultOptions: {
      ngModelAttrs: ngModelAttrs,
      templateOptions: {
        datepickerOptions: {}
      }
    }
  });
});

