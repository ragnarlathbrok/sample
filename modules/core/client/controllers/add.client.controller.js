'use strict';

angular.module('core').controller('AddController', ['$scope', '$state', 'Authentication','$location','$http','Notification',
  function ($scope, $state, Authentication,$location,$http,Notification) {
    $scope.authentication = Authentication;
    var vm=this;
    vm.authentication = Authentication.user;
    vm.addAction = addAction;
    vm.addNewChoice = addNewChoice;
    vm.removeChoice = removeChoice;
    vm.saveUrls = saveUrls;
    vm.choices = [{
      id: 'choice1'
    }];
    vm.type = {
      options: [{
        name: 'Image',
        value: 'image'
      }, {
        name: 'Video',
        value: 'video'
      }, {
        name: 'Youtube',
        value: 'youtube'
      }]
    };
    vm.data = {
      model: null,
      options: [{
        name: 'Header',
        value: 'header'
      }, {
        name: 'Body',
        value: 'body'
      }, {
        name: 'Other',
        value: 'other'
      }]
    };
    vm.options = {
      model: null,
      options: [{
        name: 'Browse Images',
        value: 'browse'
      }, {
        name: 'Add Links',
        value: 'link'
      }]
    };
    function addAction() {
      var url = vm.data.model + '/image';
      return url;
    }
    function saveUrls() {
      if (vm.data.model === '' || vm.data.model === null || vm.data.model === undefined) {
        Notification.error({
          message: 'Please Select where you want to add these images',
          title: '<i class="glyphicon glyphicon-remove"></i> Alert!',
          delay: 3000
        });
      } else {
        if (vm.choices[vm.choices.length - 1].url === undefined || vm.choices[vm.choices.length - 1].url === '')
          Notification.error({
            message: 'Please Enter the last Field or Delete it',
            title: '<i class="glyphicon glyphicon-remove"></i> Alert!',
            delay: 3000
          });
        else {
          var urls = [];
          for (var i = 0; i < vm.choices.length; i++) {
            urls.push({
              path: vm.choices[i].url,
              mimetype: vm.choices[i].type
            });
            vm.choices[i].url = '';
            vm.choices[i].type = '';
          }
          while (vm.choices.length - 1) vm.choices.pop();
          var data = {
            where: vm.data.model,
            images: urls
          };
          $http({
            method: 'POST',
            url: '/save-links',
            data: data
          }).then(function success(response) {
            $location.url('/viewImages');
          });
        }
      }
    }
    function addNewChoice() {
      if (vm.choices[vm.choices.length - 1].url === '' || vm.choices[vm.choices.length - 1].url === undefined) {
        Notification.error({
          message: 'Enter URL',
          title: '<i class="glyphicon glyphicon-remove"></i> Alert!',
          delay: 3000
        });
      } else {
        var newItemNo = vm.choices.length + 1;
        vm.choices.push({
          'id': 'choice' + newItemNo
        });
      }
    }

    function removeChoice(index) {
      if (index === 0) {
        Notification.error({
          message: 'Atleast 1 Url must be added',
          title: '<i class="glyphicon glyphicon-remove"></i> Alert!',
          delay: 3000
        });
      } else {
        vm.choices.splice(index);
      }
    }
  }
]);
