'use strict';
var app = angular.module('com.module.protocols');

function ProtocolsFormCtrl($state, CoreService, Protocol, gettextCatalog,
                          healthcenters, protocol,Meta) {

  var self = this;
  
  //retrieve protocol model
  this.protocolModel={};
  Meta.getModelProperties(function(obj) {
    this.protocolModel=obj.Protocol;
  });
  
  //
  this.protocol = protocol;

  this.schema = {
    type: 'object',
    title: 'Protocol',
    properties: {
      name: {
        title: gettextCatalog.getString('Name'),
        type: 'string'
      },
      healthcenterId: {
        title: gettextCatalog.getString('Healthcenter'),
        type: 'number',
        format: 'uiselect',
        items: healthcenters.map(function(healthcenter) {
          return {
            value: healthcenter.id,
            label: healthcenter.name
          };
        }),
        placeholder: 'Select healthcenter'
      },
      description: {
        title: gettextCatalog.getString('Description'),
        type: 'string'
      },
      price: {
        title: gettextCatalog.getString('Price'),
        type: 'string'
      }
    },
    required: ['name', 'healthcenterId']
  };

  this.form = [
    'name',
    'healthcenterId',
    'description',
    'price',
    {
      type: 'submit',
      title: 'OK'
    }
  ];

  this.onSubmit = function() {

    Protocol.upsert(self.protocol, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Protocol saved'), gettextCatalog.getString(
        'Your protocol is safe with us!'));
      $state.go('^.list');
    }, function(err) {
      console.log(err);
    });
  };
}

app.controller('ProtocolsFormCtrl', ProtocolsFormCtrl);
