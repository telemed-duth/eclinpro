'use strict';
var app = angular.module('com.module.core');

app.service('Vis', function($q, $http, ENV,Protocol,ProtocolUsage) {

// this.visdata=function(){
  
// }
// Protocol.find(function(nodes){
//   //fetch nodes and calculate parent relationships
//   ProtocolUsage.find({"active":true},function(edges){
//   //add uses edges
//   });
// });
  this.nodes=function(){
    return [
            {id: 37, "label": "Chenildieu", "group": 2},
            {id: 38, "label": "Cochepaille", "group": 2},
            {id: 39, "label": "Pontmercy", "group": 1},
            {id: 40, "label": "Boulatruelle", "group": 1},
            {id: 41, "label": "Eponine", "group": 1},
            {id: 42, "label": "Anzelma", "group": 1},
            {id: 43, "label": "Woman2", "group": 2},
            {id: 44, "label": "MotherInnocent", "group": 1},
            {id: 45, "label": "Gribier", "group": 1},
            {id: 46, "label": "Jondrette", "group": 2},
            {id: 47, "label": "Mme.Burgon", "group": 2},
            {id: 48, "label": "Gavroche", "group": 3},
            {id: 49, "label": "Gillenormand", "group": 2},
            {id: 50, "label": "Magnon", "group": 2},
            {id: 51, "label": "Mlle.Gillenormand", "group": 2},
            {id: 52, "label": "Mme.Pontmercy", "group": 2},
            {id: 53, "label": "Mlle.Vaubois", "group": 2},
            {id: 54, "label": "Lt.Gillenormand", "group": 2},
            {id: 55, "label": "Marius", "group": 3},
            {id: 56, "label": "BaronessT", "group": 2},
            {id: 57, "label": "Mabeuf", "group": 3},
            {id: 58, "label": "Enjolras", "group": 3},
            {id: 59, "label": "Combeferre", "group": 3},
            {id: 60, "label": "Prouvaire", "group": 3},
            {id: 61, "label": "Feuilly", "group": 3},
            {id: 62, "label": "Courfeyrac", "group": 3},
            {id: 63, "label": "Bahorel", "group": 3},
            {id: 64, "label": "Bossuet", "group": 3},
            {id: 65, "label": "Joly", "group": 3},
            {id: 66, "label": "Grantaire", "group": 3},
            {id: 67, "label": "MotherPlutarch", "group": 1},
            {id: 68, "label": "Gueulemer", "group": 1},
            {id: 69, "label": "Babet", "group": 1},
            {id: 70, "label": "Claquesous", "group": 1},
            {id: 71, "label": "Montparnasse", "group": 1},
            {id: 72, "label": "Toussaint", "group": 2},
            {id: 73, "label": "Child1", "group": 3},
            {id: 74, "label": "Child2", "group": 3},
            {id: 75, "label": "Brujon", "group": 1},
            {id: 76, "label": "Mme.Hucheloup", "group": 3}
        ];

  };
  
  this.edges=function(){
    return [
                {"from": 37, "to": 34},
                {"from": 37, "to": 35},
                {"from": 37, "to": 36},
                {"from": 37, "to": 29},
                {"from": 38, "to": 34},
                {"from": 38, "to": 35},
                {"from": 38, "to": 36},
                {"from": 38, "to": 37},
                {"from": 38, "to": 29},
                {"from": 39, "to": 25},
                {"from": 40, "to": 25},
                {"from": 41, "to": 24},
                {"from": 41, "to": 25},
                {"from": 42, "to": 41},
                {"from": 42, "to": 25},
                {"from": 42, "to": 24},
                {"from": 43, "to": 11},
                {"from": 43, "to": 26},
                {"from": 43, "to": 27},
                {"from": 44, "to": 28},
                {"from": 44, "to": 11},
                {"from": 45, "to": 28},
                {"from": 47, "to": 46},
                {"from": 48, "to": 47},
                {"from": 48, "to": 25},
                {"from": 48, "to": 27},
                {"from": 49, "to": 26},
                {"from": 50, "to": 49},
                {"from": 50, "to": 24},
                {"from": 51, "to": 49},
                {"from": 51, "to": 26},
                {"from": 52, "to": 51},
                {"from": 52, "to": 39},
                {"from": 53, "to": 51},
                {"from": 54, "to": 51},
                {"from": 54, "to": 49},
                {"from": 54, "to": 26},
                {"from": 55, "to": 51},
                {"from": 55, "to": 49},
                {"from": 55, "to": 39},
                {"from": 55, "to": 54},
                {"from": 55, "to": 26},
                {"from": 75, "to": 69},
                {"from": 75, "to": 68},
                {"from": 75, "to": 25},
                {"from": 75, "to": 48},
                {"from": 75, "to": 41},
                {"from": 75, "to": 70},
                {"from": 75, "to": 71},
                {"from": 76, "to": 64},
                {"from": 76, "to": 65},
                {"from": 76, "to": 66},
                {"from": 76, "to": 63},
                {"from": 76, "to": 62},
                {"from": 76, "to": 48},
                {"from": 76, "to": 58}
            ];
  };

});