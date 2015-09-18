'use strict';

/**
 * @ngdoc directive
 * @name com.module.core.directive:home
 * @description
 * # home
 */
angular.module('com.module.core')
.directive('leBuilder', ['$compile','Bioportal','$http', function ($compile,Bioportal,$http) {
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
                    // { name: 'AND NOT' },
                    { name: 'OR' }
                    // { name: 'OR NOT' }
                ];

                scope.field = {};

                scope.unit = {};

                scope.conditions = [
                    { name: '=' },
                    { name: '≠' ,value:'!=' },
                    { name: '~' ,value:'&asymp;'},
                    { name: '<',value:'<' },
                    { name: '≤',value:'<=' },
                    { name: '>',value:'>' },
                    { name: '≥',value:'>=' }
                ];

                scope.autocomplete = function(search,field,resultsArr) {
                  if(search.length>1){
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
                    scope[resultsArr]=list.map(function(obj){
                
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
                
                scope.autoUnits=function(check,selectedCondition,resultsArr,rule){
                if(!check) {
                    delete rule.condition;
                    return;
                }
                var options={
                    suggest:'hide',
                    semantic_types:'T081',
                    display_links:'true'
                }
                Bioportal.autocomplete(selectedCondition.label+" unit",options)
                  .then(function(res){
                    var item=res.data.collection[0].links.descendants+'?apikey=a15281a9-d87d-4c0f-b7aa-31debe0f6449';
                        $http.get(item).then(function(res){
                            
                            scope[resultsArr]=res.data.collection.map(function(obj){
                        
                                var link=(obj['id']||obj['@id']); 
                                var id=(obj['cui']?obj['cui'][0]:link.substr(link.lastIndexOf('/'),link.length-1)); 
                                
                                return { 
                                  "label": obj.prefLabel, 
                                  "id": id,
                                  "link":link
                                };
                            });
                        },function(err){console.log(err);});
                    
                  },function(err){console.log(err);});
                    // http://data.bioontology.org/search?q=blood%20pressure%20unit&semantic_types=T081
                    
                }
                
                scope.addCondition = function () {
                    scope.group.rules.push({
                        condition: '=',
                        field: {
                            selected:{label:''}
                        },
                        unit: {
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