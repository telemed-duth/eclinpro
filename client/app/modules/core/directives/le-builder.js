'use strict';

/**
 * @ngdoc directive
 * @name com.module.core.directive:home
 * @description
 * # home
 */
angular.module('com.module.core')
.directive('leBuilder', ['$compile','Bioportal', function ($compile,Bioportal) {
    return {
        restrict: 'E',
        scope: {
            group: '='
        },
        templateUrl: '/queryBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function (scope, element, attrs) {
                scope.operators = [
                    { name: 'AND' },
                    { name: 'OR' }
                ];

                scope.field = {};

                scope.conditions = [
                    { name: '=' },
                    { name: '≠' ,value:'!=' },
                    { name: '~' ,value:'&asymp;'},
                    { name: '<',value:'<' },
                    { name: '≤',value:'<=' },
                    { name: '>',value:'>' },
                    { name: '≥',value:'>=' }
                ];

                scope.autocompleteResults=[];
                scope.autocomplete = function(search,field) {
                  if(search.length>2){
                scope.loading = true;
                  Bioportal.autocomplete(search,field.templateOptions.bioportal)
                  .then(function(res){
                    scope.loading = false;
                    var list=res.data.collection;
                    if(list.length<1) {
                      list.push({
                        cui:[Math.random()*1000,0],
                        prefLabel:search
                      });
                    }    
                    scope.autocompleteResults=list.map(function(obj){
                
                        var id=obj['cui'][0]; 
                        var link=(obj['id']||obj['@id']); 
                        return { 
                          "label": obj.prefLabel, 
                          "id": id,
                          "link":link
                        };
                    });
                  },function(err){console.log(err);});
                  }
                };
                
                scope.addCondition = function () {
                    scope.group.rules.push({
                        condition: '=',
                        field: {
                            selected:{label:''}
                        },
                        data: ''
                    });
                };

                scope.removeCondition = function (index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    scope.group.rules.push({
                        group: {
                            operator: 'AND',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);