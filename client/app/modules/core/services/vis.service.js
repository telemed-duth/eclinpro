'use strict';
var app = angular.module('com.module.core');

app.service('Vis', function($q, $http, ENV,Protocol,ProtocolUsage,ProtocolApproval,User,Healthcenter,$rootScope) {


var getData=function(results){
  // console.debug()
    
    // return window.demoGraphData
    var visnodes=[];
    var visedges=[];
    var healthcenters=results[0];
    var protocols=results[1].sort(function(p){return p.parentId});
    var users=results[2];
    var protocolusage=results[3];
    
    var getHealthcenter = function (pr) {
      return healthcenters.filter(function(hc){ return pr.issuing_body === hc.general_name})[0];
    }
    var edgeExist = function(e){
      return visedges.filter(function(edge){return e.from===edge.from && e.to===edge.to}).length>0;
    }
    
    
    var nodeExists = function(n){
      return visnodes.filter(function(node){return node.id===n; }).length>0;
    }
    
    
    healthcenters.forEach(function(hc){
      visnodes.push({id: hc.id, "label": hc.general_name, "group": 3,"color":"#3C8DBC"});
    });
    
    
    users.forEach(function(node){
      visnodes.push({id: node.id, "label": node.firstName, "group": 2,"color":"#F56954"});
    });
    
      console.debug("Protocols:"+protocols.length);
    for (var i = 0; i < protocols.length; i++) {
      var node=protocols[i];
      visnodes.push({id: node.id, "label": node.general_name, "group": 1,"color":"#F39C12"});
      
      if(node.parentId) visedges.push({"from": node.parentId, "to": node.id, label: node.deviation, font: {align: 'middle'}});
      
      if(node.issuing_body.length>0){
        visedges.push({"from": getHealthcenter(node).id, "to": node.id, label: "issues", font: {align: 'middle'}});
      }
        
    }
    
    
    protocolusage.forEach(function(node){
      var edge = {"from": node.userId, "to": node.protocolId, label: 'uses', font: {align: 'middle'}}
      if(!edgeExist(edge) && nodeExists(edge.from) && nodeExists(edge.to)) visedges.push(edge);
    });  
    
    console.log(visnodes,visedges);
    return {
      "nodes":visnodes,
      "edges":visedges
    };
};  
  

return {
  data: function() {
    var deferred = $q.defer();
    var dataCalls = [];
    dataCalls.push(Healthcenter.find().$promise);
    dataCalls.push(Protocol.find().$promise);
    dataCalls.push(User.find().$promise);
    dataCalls.push(ProtocolUsage.find().$promise);
    dataCalls.push(User.getCurrent().$promise);
    
    
    $q.all(dataCalls).then(function(results) {
      deferred.resolve(getData(results));
    },function(errors) {
      deferred.reject(errors);
    },function(updates) {
      deferred.update(updates);
    });
    return deferred.promise;
  }
};


});
