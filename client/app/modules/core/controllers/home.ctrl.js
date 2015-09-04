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

    $scope.count = {};

    $scope.boxes = $rootScope.dashboardBox;
    
// Network graph related

    
     $scope.draw=function(){
        
    // var nodes=new VisDataSet();
    // var edges=new VisDataSet();
    
    // nodes.add(Vis.nodes());
    // edges.add(Vis.edges());
    
        $scope.graphloaded=true;
        $scope.visdata=visdata;
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
                color:{opacity:0.3}
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
    };
        
    $scope.start=function(){
      $timeout($scope.draw(),100);
    };
      
});
