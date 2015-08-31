'use strict';
angular.module('com.module.protocols')
  .controller('ProtocolsCtrl', function($scope, $state, $stateParams, CoreService,
    FormHelper, gettextCatalog, Protocol, ProtocolsService) {

    $scope.delete = function(id) {
      ProtocolsService.deleteProtocol(id, function() {
        $state.reload();
      });
    };

    this.formHelper = new FormHelper(Protocol);
    $scope.cancel = function() {
      console.log('Cancel');
      console.log(this.formHelper);
      //this.formHelper.cancel('app.protocols.list');
    };

    var protocolId = $stateParams.id;

    if (protocolId) {
      $scope.protocol = Protocol.findById({
        id: protocolId
      }, function() {}, function(err) {
        console.log(err);
      });
    } else {
      $scope.protocol = {};
    }

    $scope.formFields = [{
      key: 'title',
      type: 'text',
      label: gettextCatalog.getString('Title'),
      required: true
    }, {
      key: 'content',
      type: 'textarea',
      label: gettextCatalog.getString('Content'),
      required: true
    }, {
      key: 'image',
      type: 'text',
      label: gettextCatalog.getString('image'),
      required: true
    }];

    $scope.formOptions = {
      uniqueFormId: true,
      hideSubmit: false,
      submitCopy: gettextCatalog.getString('Save')
    };

    $scope.onSubmit = function() {
      Protocol.upsert($scope.protocol, function() {
        CoreService.toastSuccess(gettextCatalog.getString('Protocol saved'),
          gettextCatalog.getString('Your protocol is safe with us!'));
        $state.go('^.list');
      }, function(err) {
        console.log(err);
      });
    };

  });
