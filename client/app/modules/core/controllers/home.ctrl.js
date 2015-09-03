'use strict';
/**
 * @ngdoc function
 * @name com.module.core.controller:HomeCtrl
 * @description Dashboard
 * @requires $scope
 * @requires $rootScope
 **/
angular.module('com.module.core')
  .controller('HomeCtrl', function($scope, $rootScope,Vis,$timeout) {

    $scope.count = {};

    $scope.boxes = $rootScope.dashboardBox;
    
    // $scope.user=$rootScope.currentUser;
    // $scope.isadmin=$rootScope.isadmin;

    
    
    // Visualizations
    $scope.draw=function() {
            // create some nodes
            var nodes=Vis.nodes();
            var edges=Vis.edges();
            console.log('draw invoked!');
            // create a network
            var container = document.getElementById('mynetwork');
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {
                nodes: {
                    shape: 'dot',
                    size: 16
                },
                physics: {
                    forceAtlas2Based: {
                        gravitationalConstant: -26,
                        centralGravity: 0.005,
                        springLength: 230,
                        springConstant: 0.18
                    },
                    maxVelocity: 146,
                    solver: 'forceAtlas2Based',
                    timestep: 0.35,
                    stabilization: {iterations: 150}
                }
            };
            var network = new vis.Network(container, data, options);

    }; 
    $scope.start=function(){
      $timeout($scope.draw,10);
    };
      
});
