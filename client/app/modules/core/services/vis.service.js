'use strict';
var app = angular.module('com.module.core');

app.service('Vis', function($q, $http, ENV,Protocol,ProtocolUsage,ProtocolApproval,User,Healthcenter) {
function objExist(obj, list,prop) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i][prop] === obj[prop]) {
          // console.log(obj[prop],' match with ',list[i][prop]);
          return true;
        }
    }
    return false;
}
var matchArray=function(a,b,prop){
  //returns true if all elements of array a exist on array b
  //if prop assume is object array and match on property 
  var l=a.length;
  if(l<1) return true;
  for( var i = 0; i < l; i++ ) {
    if(prop) {
      if(b instanceof Array &&!objExist(a[i],b,prop)) {
        // console.log('obj not exist');
        return false;
      }
    } else {
      if(b.indexOf(a[i]) === -1) return false;
      // console.log(a[i],' exists');
    }
  }
  // console.log(a,' match with ',b);
  return true;
};
var matchProtocol=function(pr,hc,propArray){
  if(!propArray) propArray=["resources_human","resources_infastructure","resources_pharmaceutical"];
  for( var i = 0, l = propArray.length ; i < l; i++ ) {
    var prop=propArray[i];
    //debug
    // console.log('Protocol: ',pr.general_name,pr[prop],
    // 'with Hospital: ',hc.general_name,hc[prop],
    // 'on '+prop, matchArray(pr[prop],hc[prop],'id'));
    
    if(!matchArray(pr[prop]||[],hc[prop]||[],'id')) {
      return false;
    }
  }
  // console.log(pr.general_name,'match with ',hc.general_name);
  return true;
};

var getData=function(results){
  
  var visnodes=[];
  var visedges=[];
  var healthcenters=results[0];
  var protocols=results[1];
  var users=results[2];
  var protocolusage=results[3];
  var protocolapproval=results[4];
  var runFirstTime=true;
  
  for (var i = 0; i < protocols.length; i++) {
    var node=node=protocols[i];
    visnodes.push({id: node.id, "label": node.general_name, "group": 1,"color":"#F39C12"});
    if(node.parentId) visedges.push({"from": node.parentId, "to": node.id, label: node.divergion_type, font: {align: 'middle'}});
      
      
    healthcenters.forEach(function(hc){
      if(runFirstTime) visnodes.push({id: hc.id, "label": hc.general_name, "group": 3,"color":"#F56954"});
      if(matchProtocol(node,hc)){
        visedges.push({"from": hc.id, "to": node.id, label: "can endorse", font: {align: 'middle'},dashes:true});
      }
    });
    runFirstTime=false;
  }
  
  
  users.forEach(function(node){
    visnodes.push({id: node.id, "label": node.firstName, "group": 2,"color":"#3C8DBC"});
  });
  
  protocolusage.forEach(function(node){
    visedges.push({"from": node.userId, "to": node.protocolId, label: 'uses', font: {align: 'middle'}});
  });  
  
  protocolapproval.forEach(function(node){
    visedges.push({"from": node.healthcenterId, "to": node.protocolId, label: 'endorses', font: {align: 'middle'}});
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
