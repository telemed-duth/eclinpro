'use strict';
var app = angular.module('com.module.core');

app.service('Exporter', function(x2js,ENV,$window) {

  this.toXML = function(json,filename) {

    var xmlString=x2js.json2xml_str(JSON.parse(json));
    console.log(xmlString);
    
    $window.open("data:text/xml;charset=utf-8,<care-plan>" + xmlString+"</care-plan>");
  };

});
