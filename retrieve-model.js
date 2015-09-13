
/* 
  function buildModel() {
    
   Meta.getModelProperties(function(obj) {
    
    var curModel=obj.Protocol;
    var propCategories=[];
    
        for(var key in curModel){
          
          if( key.indexOf(CategorySplitter)>0 ){ //&& key.indexOf("Id")===-1 && key!=='id' && curModel.hasOwnProperty(key)){
            
            
            //schema builder
            var keyObj={};
            angular.copy(curModel[key],keyObj);
            // if(keyObj.enum) {
            //   keyObj.enum=keyObj.enum.map(function(item){
            //   return item.toString();
            //   });
            // }
            keyObj.title=gettextCatalog.getString(propname(key));
            if(keyObj.required){$scope.requiredProps.push(key);}
            keyObj.type=(curModel[key].stringType==="objectid")?"string":curModel[key].stringType;
            
          if($scope.uiselectArray.indexOf(key)>=0){
              keyObj.format="uiselect";
              keyObj.items=[];
                if(typeof $scope.protocol[key]==="string"){
                  keyObj.items=[{
                      "label":$scope.protocol[key].split(BioportalSplitter)[1],
                      "value":$scope.protocol[key]
                    }];
                } else if($scope.protocol[key] instanceof Array){
                  //map the string into object for the autocomplete
                  keyObj.items=$scope.protocol[key].map(function(str){
                    return {
                      "label":str.split(BioportalSplitter)[1],
                      "value":str
                    };
                  });
                }
              
            } 
            else if (keyObj.type==="array"){
              keyObj.items={
                  "title":keyObj.title,
                  "type":"string"
              };
            } 
            else {
              // console.log('Other types: '+key);
              // console.log(keyObj);
            }
            
            delete keyObj['required'];
            delete keyObj['stringType'];
            
            //form builder
            var category=catname(key);
            var item={};
            propCategories[category]=propCategories[category] || {
              "title":category,
              "items":[]
            }
            
            if(keyObj.format) {
              item={
                "key":key,
                "feedback":false,
                "placeholder":"Add "+propname(key),
                "options": {
                  "refreshDelay": 50,
                  "callback": $scope.bioportalAutocomplete
                }
              };
            } else if(keyObj.enum) {
              //console.log(JSON.stringify(keyObj));
              item=key;
            }
            else {
              item={
                "key":key,
                "placeholder":"Add "+propname(key),
                "feedback":true,
              };
            }
            
            //do foreign key stuff
            // var foreignModel=key.toString().split('Id')[0];
            // console.log(foreignModel);
            // keyObj.format="uiselect";
            // keyObj.items=categories.map(function(category) {
            //   return {
            //     value: category.id,
            //     label: category.name
            //   };
            // });
            
            if(key==='release_deviation' && $stateParams.parentId ) {
              propCategories[category].items.push(item);
            } else if(key!=='release_deviation'){
              propCategories[category].items.push(item);
            }
            $scope.schemaProps[key]=keyObj;
          }
        }
        
        $scope.formProps.push({  
          "type":"fieldset",
          "title":"Clinical Protocol",
          "items":[{
            "type": "tabs",
            "tabs": Object.keys(propCategories).map(function (key) {return propCategories[key]})
          }]
        });      
            
            
        $scope.formProps.push({  
          "type":"actions",
          "items":[  
             {  
                "type":"submit",
                "style":"btn-info",
                "title":"Submit"
             },
             {  
                "type":"button",
                "style":"btn-danger",
                "title":"Cancel",
                "onClick":"sayNo()"
             }
          ]
       });
       
      
            //protocol view/edit
            
            
          //create view tabs from formProps
          // console.log($scope.schemaProps);
          // console.log($scope.formProps);
          $scope.tabs=$scope.formProps[0].items[0].tabs;
          
          $scope.modelLoaded=true;
            
      });
      
      }

  
  

    $scope.schema = {
      type: 'object',
      title: 'Product',
      properties: $scope.schemaProps,
      required: $scope.requiredProps
    };
  
    $scope.form = $scope.formProps;
    
    */