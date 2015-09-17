'use strict';
var app = angular.module('com.module.core');

app.service('Bioportal', function($q, $http, ENV) {

  var apikey=ENV.BIOPORTAL_API_KEY || 'a15281a9-d87d-4c0f-b7aa-31debe0f6449';
  var apiurl = ENV.BIOPORTAL_API_URL ||'http://data.bioontology.org/search';

  //autocomplete fetch from bioportal
  this.autocomplete = function(search,options) {
    return $q(function(res, err) {
        $http.get(
        apiurl
        +'?include=cui,prefLabel'
        +'&display_context=false'
        
        +'&pagesize='+(!!options.pagesize?options.pagesize:'20')
        +(options.semantic_types?'&semantic_types='+options.semantic_types:'')
        +(options.cui?'&cui='+options.cui:'')
        +(options.subtree?'&ontology='+options.subtree:'')
        +(options.display_links?'&display_links=true':'&display_links=false')
        +(!options.suggest?'&suggest=true':'&suggest=false')
        +(options.ontologies?'&ontologies='+options.ontologies:'&ontologies=ICD10,SNOMEDCT')
        +'&q='+search
        +'&apikey='+apikey
        
        ).then(res,err);
    });
  };
  
  //autocomplete fetch from bioportal
  this.getLabel = function(cui) {
    return $q(function(res, err) {
        $http.get(
          
        apiurl
        
        +'?include=prefLabel'
        +'&suggest=true'
        +'&display_context=false'
        
        +'&pagesize='+(!!options.pagesize?options.pagesize:'20')
        +'&cui='+cui
        +(options.subtree?'&ontology='+options.subtree:'')
        +(options.display_links?'&display_links=true':'&display_links=false')
        +(options.ontologies?'&ontologies='+options.ontologies:'')
        +'&q='+search
        +'&apikey='+apikey
        
        ).then(res,err);
    });
  };

});