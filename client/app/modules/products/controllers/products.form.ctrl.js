'use strict';
var app = angular.module('com.module.products');

function ProductsFormCtrl($state,$scope, CoreService, Product, gettextCatalog,
                          categories, product,Meta) {

  var self = this;

  this.product = product;

  
  //retrieve protocol model
  var curModel={};
  $scope.schemaProps={};
  $scope.formProps=[];
  Meta.getModelProperties(function(obj) {
    curModel=obj.Product;
        console.log(curModel);
        for(var key in curModel){
          if(key!=='id'){
            var keyObj={};
            angular.copy(curModel[key],keyObj);
            keyObj.title=gettextCatalog.getString(key);
            keyObj.type=(curModel[key].type==="objectid")?"string":curModel[key].type;
            
            if(key.indexOf("Id")>0){
              
              //do foreign key stuff
              var foreignModel=key.toString().split('Id')[0];
              console.log(foreignModel);
              keyObj.format="uiselect";
              keyObj.items=categories.map(function(category) {
                return {
                  value: category.id,
                  label: category.name
                };
              });
            }
            
            $scope.schemaProps[key]=keyObj;
            $scope.formProps.push(key);
          }
        }
        
    $scope.formProps.push({
      type: 'submit',
      title: 'OK'
    });
    console.log($scope.formProps);
    console.log($scope.schemaProps);
  });

  this.schema = {
    type: 'object',
    title: 'Product',
    properties: $scope.schemaProps,
    required: ['name', 'categoryId']
  };

  this.form = $scope.formProps;

  this.onSubmit = function() {

    Product.upsert(self.product, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Product saved'), gettextCatalog.getString(
        'Your product is safe with us!'));
      $state.go('^.list');
    }, function(err) {
      console.log(err);
    });
  };
}

app.controller('ProductsFormCtrl', ProductsFormCtrl);
