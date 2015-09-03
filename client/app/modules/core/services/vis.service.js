'use strict';
var app = angular.module('com.module.core');

app.service('Vis', function($q, $http, ENV) {

  this.nodes=function(){
    return [
            {id: 0, "label": "Myriel", "group": 1},
            {id: 1, "label": "Napoleon", "group": 1},
            {id: 2, "label": "Mlle.Baptistine", "group": 1},
            {id: 3, "label": "Mme.Magloire", "group": 1},
            {id: 4, "label": "CountessdeLo", "group": 1},
            {id: 5, "label": "Geborand", "group": 1},
            {id: 6, "label": "Champtercier", "group": 1},
            {id: 7, "label": "Cravatte", "group": 1},
            {id: 8, "label": "Count", "group": 1},
            {id: 9, "label": "OldMan", "group": 1},
            {id: 10, "label": "Labarre", "group": 2},
            {id: 11, "label": "Valjean", "group": 2},
            {id: 12, "label": "Marguerite", "group": 3},
            {id: 13, "label": "Mme.deR", "group": 2},
            {id: 14, "label": "Isabeau", "group": 2},
            {id: 15, "label": "Gervais", "group": 2},
            {id: 16, "label": "Tholomyes", "group": 3},
            {id: 17, "label": "Listolier", "group": 3},
            {id: 18, "label": "Fameuil", "group": 3},
            {id: 19, "label": "Blacheville", "group": 3},
            {id: 20, "label": "Favourite", "group": 3},
            {id: 21, "label": "Dahlia", "group": 3},
            {id: 22, "label": "Zephine", "group": 3},
            {id: 23, "label": "Fantine", "group": 3},
            {id: 24, "label": "Mme.Thenardier", "group": 1},
            {id: 25, "label": "Thenardier", "group": 1},
            {id: 26, "label": "Cosette", "group": 2},
            {id: 27, "label": "Javert", "group": 1},
            {id: 28, "label": "Fauchelevent", "group": 1},
            {id: 29, "label": "Bamatabois", "group": 2},
            {id: 30, "label": "Perpetue", "group": 3},
            {id: 31, "label": "Simplice", "group": 2},
            {id: 32, "label": "Scaufflaire", "group": 2},
            {id: 33, "label": "Woman1", "group": 2},
            {id: 34, "label": "Judge", "group": 2},
            {id: 35, "label": "Champmathieu", "group": 2},
            {id: 36, "label": "Brevet", "group": 2},
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
                {"from": 1, "to": 0},
                {"from": 2, "to": 0},
                {"from": 3, "to": 0},
                {"from": 3, "to": 2},
                {"from": 4, "to": 0},
                {"from": 5, "to": 0},
                {"from": 6, "to": 0},
                {"from": 7, "to": 0},
                {"from": 8, "to": 0},
                {"from": 9, "to": 0},
                {"from": 11, "to": 10},
                {"from": 11, "to": 3},
                {"from": 11, "to": 2},
                {"from": 11, "to": 0},
                {"from": 12, "to": 11},
                {"from": 13, "to": 11},
                {"from": 14, "to": 11},
                {"from": 15, "to": 11},
                {"from": 17, "to": 16},
                {"from": 18, "to": 16},
                {"from": 18, "to": 17},
                {"from": 19, "to": 16},
                {"from": 19, "to": 17},
                {"from": 19, "to": 18},
                {"from": 20, "to": 16},
                {"from": 20, "to": 17},
                {"from": 20, "to": 18},
                {"from": 20, "to": 19},
                {"from": 21, "to": 16},
                {"from": 21, "to": 17},
                {"from": 21, "to": 18},
                {"from": 21, "to": 19},
                {"from": 21, "to": 20},
                {"from": 22, "to": 16},
                {"from": 22, "to": 17},
                {"from": 22, "to": 18},
                {"from": 22, "to": 19},
                {"from": 22, "to": 20},
                {"from": 22, "to": 21},
                {"from": 23, "to": 16},
                {"from": 23, "to": 17},
                {"from": 23, "to": 18},
                {"from": 23, "to": 19},
                {"from": 23, "to": 20},
                {"from": 23, "to": 21},
                {"from": 23, "to": 22},
                {"from": 23, "to": 12},
                {"from": 23, "to": 11},
                {"from": 24, "to": 23},
                {"from": 24, "to": 11},
                {"from": 25, "to": 24},
                {"from": 25, "to": 23},
                {"from": 25, "to": 11},
                {"from": 26, "to": 24},
                {"from": 26, "to": 11},
                {"from": 26, "to": 16},
                {"from": 26, "to": 25},
                {"from": 27, "to": 11},
                {"from": 27, "to": 23},
                {"from": 27, "to": 25},
                {"from": 27, "to": 24},
                {"from": 27, "to": 26},
                {"from": 28, "to": 11},
                {"from": 28, "to": 27},
                {"from": 29, "to": 23},
                {"from": 29, "to": 27},
                {"from": 29, "to": 11},
                {"from": 30, "to": 23},
                {"from": 31, "to": 30},
                {"from": 31, "to": 11},
                {"from": 31, "to": 23},
                {"from": 31, "to": 27},
                {"from": 32, "to": 11},
                {"from": 33, "to": 11},
                {"from": 33, "to": 27},
                {"from": 34, "to": 11},
                {"from": 34, "to": 29},
                {"from": 35, "to": 11},
                {"from": 35, "to": 34},
                {"from": 35, "to": 29},
                {"from": 36, "to": 34},
                {"from": 36, "to": 35},
                {"from": 36, "to": 11},
                {"from": 36, "to": 29},
                {"from": 37, "to": 34},
                {"from": 37, "to": 35},
                {"from": 37, "to": 36},
                {"from": 37, "to": 11},
                {"from": 37, "to": 29},
                {"from": 38, "to": 34},
                {"from": 38, "to": 35},
                {"from": 38, "to": 36},
                {"from": 38, "to": 37},
                {"from": 38, "to": 11},
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
                {"from": 48, "to": 11},
                {"from": 49, "to": 26},
                {"from": 49, "to": 11},
                {"from": 50, "to": 49},
                {"from": 50, "to": 24},
                {"from": 51, "to": 49},
                {"from": 51, "to": 26},
                {"from": 51, "to": 11},
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
                {"from": 55, "to": 11},
                {"from": 55, "to": 16},
                {"from": 55, "to": 25},
                {"from": 55, "to": 41},
                {"from": 55, "to": 48},
                {"from": 56, "to": 49},
                {"from": 56, "to": 55},
                {"from": 57, "to": 55},
                {"from": 57, "to": 41},
                {"from": 57, "to": 48},
                {"from": 58, "to": 55},
                {"from": 58, "to": 48},
                {"from": 58, "to": 27},
                {"from": 58, "to": 57},
                {"from": 58, "to": 11},
                {"from": 59, "to": 58},
                {"from": 59, "to": 55},
                {"from": 59, "to": 48},
                {"from": 59, "to": 57},
                {"from": 60, "to": 48},
                {"from": 60, "to": 58},
                {"from": 60, "to": 59},
                {"from": 61, "to": 48},
                {"from": 61, "to": 58},
                {"from": 61, "to": 60},
                {"from": 61, "to": 59},
                {"from": 61, "to": 57},
                {"from": 61, "to": 55},
                {"from": 62, "to": 55},
                {"from": 62, "to": 58},
                {"from": 62, "to": 59},
                {"from": 62, "to": 48},
                {"from": 62, "to": 57},
                {"from": 62, "to": 41},
                {"from": 62, "to": 61},
                {"from": 62, "to": 60},
                {"from": 63, "to": 59},
                {"from": 63, "to": 48},
                {"from": 63, "to": 62},
                {"from": 63, "to": 57},
                {"from": 63, "to": 58},
                {"from": 63, "to": 61},
                {"from": 63, "to": 60},
                {"from": 63, "to": 55},
                {"from": 64, "to": 55},
                {"from": 64, "to": 62},
                {"from": 64, "to": 48},
                {"from": 64, "to": 63},
                {"from": 64, "to": 58},
                {"from": 64, "to": 61},
                {"from": 64, "to": 60},
                {"from": 64, "to": 59},
                {"from": 64, "to": 57},
                {"from": 64, "to": 11},
                {"from": 65, "to": 63},
                {"from": 65, "to": 64},
                {"from": 65, "to": 48},
                {"from": 65, "to": 62},
                {"from": 65, "to": 58},
                {"from": 65, "to": 61},
                {"from": 65, "to": 60},
                {"from": 65, "to": 59},
                {"from": 65, "to": 57},
                {"from": 65, "to": 55},
                {"from": 66, "to": 64},
                {"from": 66, "to": 58},
                {"from": 66, "to": 59},
                {"from": 66, "to": 62},
                {"from": 66, "to": 65},
                {"from": 66, "to": 48},
                {"from": 66, "to": 63},
                {"from": 66, "to": 61},
                {"from": 66, "to": 60},
                {"from": 67, "to": 57},
                {"from": 68, "to": 25},
                {"from": 68, "to": 11},
                {"from": 68, "to": 24},
                {"from": 68, "to": 27},
                {"from": 68, "to": 48},
                {"from": 68, "to": 41},
                {"from": 69, "to": 25},
                {"from": 69, "to": 68},
                {"from": 69, "to": 11},
                {"from": 69, "to": 24},
                {"from": 69, "to": 27},
                {"from": 69, "to": 48},
                {"from": 69, "to": 41},
                {"from": 70, "to": 25},
                {"from": 70, "to": 69},
                {"from": 70, "to": 68},
                {"from": 70, "to": 11},
                {"from": 70, "to": 24},
                {"from": 70, "to": 27},
                {"from": 70, "to": 41},
                {"from": 70, "to": 58},
                {"from": 71, "to": 27},
                {"from": 71, "to": 69},
                {"from": 71, "to": 68},
                {"from": 71, "to": 70},
                {"from": 71, "to": 11},
                {"from": 71, "to": 48},
                {"from": 71, "to": 41},
                {"from": 71, "to": 25},
                {"from": 72, "to": 26},
                {"from": 72, "to": 27},
                {"from": 72, "to": 11},
                {"from": 73, "to": 48},
                {"from": 74, "to": 48},
                {"from": 74, "to": 73},
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