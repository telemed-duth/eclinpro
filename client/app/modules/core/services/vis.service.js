'use strict';
var app = angular.module('com.module.core');

app.service('Vis', function($q, $http, ENV,Protocol,ProtocolUsage,ProtocolApproval,User,Healthcenter) {
  

var getData=function(results){
  
  var visnodes=[];
  var visedges=[];
  var healthcenters=results[0];
  var protocols=results[1];
  var users=results[2];
  var protocolusage=results[3];
  var protocolapproval=results[4];
  var hcHuman=[];
  var hcInfastructure=[];
  var hcPharmaceutical=[];
  
  healthcenters.forEach(function(node){
    visnodes.push({id: node.id, "label": node.main_name, "group": 3});
    
    //infer 
    hcHuman[node.id+'_'+node.main_name]=node.resources_human;
    hcInfastructure[node.id+'_'+node.main_name]=node.resources_infastructure;
    hcPharmaceutical[node.id+'_'+node.main_name]=node.resources_pharmaceutical;
  });
  
  for (var i = 0; i < protocols.length; i++) {
    var node=node=protocols[i];
      visnodes.push({id: node.id, "label": node.release_title, "group": 1});
      if(node.parentId) visedges.push({"from": node.parentId, "to": node.id, label: node.release_deviation, font: {align: 'middle'}});
      var breakCheck1=false;
      
      // for (var hch in hcHuman){
      //   for (var j = 0; j < hcHuman[hch].length; j++) {
      //     if(resources_human.indexOf(hcHuman[hch][j])<0) {
      //       breakCheck1=true;
      //       break;
      //     }
      //   }
      //   if (breakCheck1) {break;}
      // }
      
      // if(!breakCheck1) {
      //   for (var hch in hcInfastructure){
      //     for (var j = 0; j < hcInfastructure[hch].length; j++) {
      //       if(resources_infastructure.indexOf(hcInfastructure[hch][j])<0) {
      //         breakCheck1=true;
      //         break;
      //       }
      //     }
      //     if (breakCheck1) {break;}
      //   }
      // }
      
      // if(!breakCheck1) {
      //   for (var hch in hcPharmaceutical){
      //     for (var j = 0; j < hcPharmaceutical[hch].length; j++) {
      //       if(resources_pharmaceutical.indexOf(hcPharmaceutical[hch][j])<0) {
      //         breakCheck1=true;
      //         break;
      //       }
      //     }
      //     if (breakCheck1) {break;}
      //   }
      // }
      
      // if(!breakCheck1) visedges.push({"from": node.parentId, "to": node.id, label: node.release_deviation, font: {align: 'middle'}});
    
  }
  
  users.forEach(function(node){
    visnodes.push({id: node.id, "label": node.firstName+' '+node.lastName, "group": 2});
  });
  
  protocolusage.forEach(function(node){
    visedges.push({"from": node.userId, "to": node.protocolId, label: 'uses', font: {align: 'middle'}});
  });  
  
  protocolapproval.forEach(function(node){
    visedges.push({"from": node.healthcenterId, "to": node.protocolId, label: 'endorses', font: {align: 'middle'}});
  });  
  
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
    dataCalls.push(ProtocolApproval.find());
    
    
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
