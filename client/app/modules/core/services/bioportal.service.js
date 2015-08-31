'use strict';
var app = angular.module('com.module.core');

app.service('Bioportal', function($q, $http, ENV) {

  var apikey=ENV.BIOPORTAL_API_KEY || 'a15281a9-d87d-4c0f-b7aa-31debe0f6449';
  var apiurl = ENV.BIOPORTAL_API_URL ||'http://data.bioontology.org/search';

  //autocomplete fetch from bioportal
  this.autocomplete = function(schema, options, search) {
    return $q(function(res, err) {
      if(search.length>(options.minlength||2)) {
        
        $http.get(
          
        apiurl
        
        +'?include=cui,prefLabel'
        +'&suggest=true'
        +'&display_context=false'
        +'&display_links=false'
        
        +'&pagesize='+(!!options.pagesize?options.pagesize:'20')
        +(options.cui?'&cui='+options.cui:'')
        +(options.subtree?'&ontology='+options.subtree:'')
        +(options.ontologies?'&ontologies='+options.ontologies:'&ontologies=ICD10,SNOMEDCT')
        +'&q='+search
        +'&apikey='+apikey
        
        ).then(res,err);
     } else return false;
    });
  };


});