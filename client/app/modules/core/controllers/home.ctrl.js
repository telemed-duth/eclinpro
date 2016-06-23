'use strict';
/**
 * @ngdoc function
 * @name com.module.core.controller:HomeCtrl
 * @description Dashboard
 * @requires $scope
 * @requires $rootScope
 **/
angular.module('com.module.core')
  .controller('HomeCtrl', function($scope, $rootScope,Vis,$timeout,visdata) {
    
    // visdata = visdata||{nodes:[],edges:[]};
    $scope.count = {};
    $scope.visdata=visdata;
    $scope.boxes = $rootScope.dashboardBox;
    $scope.visnetwork={};
    $scope.loading=true;

    $scope.visevents = {
        'onload': function(network){
            // console.log(network);
            console.log('graphloaded!');
        }
    };
    
    $scope.graphbutton = {
        'protocols': true,
        'doctors': true,
        'healthcenters': true
    };
    
    $scope.$watchCollection('graphbutton', function () {
         $scope.createGraph();
    });
    
    var mapgroup=function(group){
        switch (group) {
            case 1:
                // protocols
                return 'protocols'
                break;
            
            case 2:
                // doctors
                return 'doctors'
                break;
            
            case 3:
                // healthcenters
                return 'healthcenters'
                break;
        }
    };
    
    $scope.createGraph=function(){
        $scope.loading=true;
        var onArr=[];
        var exclude=[];
        var data={'nodes':[],'edges':[]};
        angular.forEach($scope.graphbutton, function (value, key) {
            if (value) { onArr.push(key); }
        });
        data.nodes=visdata.nodes.filter(function(node){
            if(onArr.indexOf(mapgroup(node.group))>-1){
                return true;
            } else {
                exclude.push(node.id);
                return false;
            }
        });
        data.edges=visdata.edges.filter(function(edge){
           if(exclude.indexOf(edge.from)>-1||exclude.indexOf(edge.to)>-1){
               return false;
           } else return true;
        });
        
        draw(data);
    }
    
    $scope.createDemoGraph=function(demonodes,demoedges){
        $scope.loading=true;
        var onArr=[];
        var exclude=[];
        console.log(demonodes,demoedges);
        var data={'nodes':angular.fromJson(demonodes).data,'edges':angular.fromJson(demoedges).data};
        
        draw(data);
    }
    
// Network graph related

     var draw=function(data){
        $scope.visdata=data;
        $scope.visoptions={
            autoResize: false,
            height: '600',
            width: '100%',
            nodes: {
                shape: 'dot',
                size: 16
            },
            edges:{
                arrows:'to',
                color:{opacity:0.4}
            },
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -30,
                    centralGravity: 0.005,
                    springLength: 200,
                    springConstant: 0.5
                },
                maxVelocity: 146,
                solver: 'forceAtlas2Based',
                timestep: 0.35,
                stabilization: {iterations: 100}
            }
        };
        
    };
      
    var demonodes={
        data:[
        {id: 1, 'label': 'kati', 'group': 1,'color':'#F56954'},
        {id: 2, 'label': 'kati allo', 'group': 2,'color':'#F39C12'},
        {id: 3, 'label': 'kati diaforetiko', 'group': 3,'color':'#3C8DBC'}
        ]
    }
    $scope.demonodes=angular.toJson(demonodes,true);
    console.log(demonodes);
    var demoedges={data:[ 
        {'from': 1, 'to': 2, label: 'can endorse', font: {align: 'middle'},dashes:true} 
        ]};
    console.log(demoedges);

    $scope.demoedges=angular.toJson(demoedges,true);
});
