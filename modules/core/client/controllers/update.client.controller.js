'use strict';

angular.module('core').controller('UpdateController', ['$scope', '$state', 'Authentication','$location','$http','Notification','$sce',
  function ($scope, $state, Authentication,$location,$http,Notification,$sce) {
    $scope.authentication = Authentication;
    var vm=this;
    vm.authentication = Authentication.user;
    vm.addOperation = addOperation;
    vm.preOperation = preOperation;
    vm.addNewChoice = addNewChoice;
    vm.removeChoice = removeChoice;
    vm.appendUrls = appendUrls;
    vm.prependUrls = prependUrls;
    vm.checkVideo = checkVideo;
    vm.getAllImages = getAllImages;
    vm.checkImage = checkImage;
    vm.checkYoutube = checkYoutube;
    vm.replaceHeader = replaceHeader;
    vm.replaceBody = replaceBody;
    vm.replaceOther = replaceOther;
    vm.addUpdateAction = addUpdateAction;
    vm.replaceWithUrl = replaceWithUrl;
    vm.deleteAll = deleteAll;
    vm.deleteImages = deleteImages;
    vm.removeImage = removeImage;
    vm.getPath = getPath;
    vm.isURL = isURL;
    vm.getYoutubePath = getYoutubePath;
    vm.addInfo = addInfo;
    vm.addPriority = addPriority;
    vm.show = [];
    vm.showB = [];
    vm.showO = [];
    vm.removeHeadIndexes = [];
    vm.removeBodyIndexes = [];
    vm.removeOtherIndexes = [];
    vm.addPriority = addPriority;
    vm.infoOptions = {
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
    vm.priorityOptions = {
      model: null,
      options: [{
        name: 'Header',
        value: 'header'
      }, {
        name: 'Body',
        value: 'body'
      }]
    };
    vm.updateData = {
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
    vm.updateHeaderChoices ={
      mimetype: '',
      path: ''
    };
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
    vm.update = {
      model: null,
      options: [{
        name: 'Insert Images',
        value: 'insert'
      }, {
        name: 'Delete Images',
        value: 'delete'
      }, {
        name: 'Add Info',
        value: 'addinfo'
      }, {
        name: 'Prioritize',
        value: 'prioritize'
      }]
    };
    vm.insert = {
      model: null,
      options: [{
        name: 'Append Images',
        value: 'append'
      }, {
        name: 'Prepend Images',
        value: 'prepend'
      }, {
        name: 'Replace Images',
        value: 'replace'
      }]
    };
    vm.delete = {
      model: null,
      options: [{
        name: 'Delete All Images',
        value: 'delAll'
      }, {
        name: 'Delete particular Image',
        value: 'delP'
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
    vm.updateOptions = {
      model: null,
      options: [{
        name: 'Browse Images',
        value: 'browse'
      }, {
        name: 'Add Links',
        value: 'link'
      }]
    };
    function addOperation() {
      var url = vm.data.model + '/appendImages';
      return url;
    }
    function preOperation() {
      var url = vm.data.model + '/prependImages';
      return url;
    }
    function isURL(path) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return pattern.test(path);
    }
    function getPath(path) {
      if (isURL(path)) {
        return $sce.trustAsResourceUrl(path);
      }
      path = 'http://13.127.44.186:9000/' + path;
      return $sce.trustAsResourceUrl(path);
    }
    function getYoutubePath(path) {
      return $sce.trustAsResourceUrl(path);
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
    function getAllImages() {
      vm.head = vm.authentication.head;
      vm.body = vm.authentication.body;
      vm.other = vm.authentication.other;
      vm.hinfo = vm.authentication.headInfo;
      vm.binfo = vm.authentication.bodyInfo;
      vm.oinfo = vm.authentication.otherInfo;
      vm.hpriority = vm.authentication.headPriority;
      vm.bpriority = vm.authentication.bodyPriority;
      vm.showHead = vm.head.length !== 0;
      vm.showBody = vm.body.length !== 0;
      vm.showOther = vm.other.length !== 0;
      for(var i = 0;i<vm.head.length;i++) {
        vm.show[i] = false;
        vm.head[i].id = i;
        vm.removeHeadIndexes[i] = false;
      }
      for(var j = 0;j<vm.body.length;j++) {
        vm.showB[j] = false;
        vm.body[j].id = j;
        vm.removeBodyIndexes[j] = false;
      }
      for(var k = 0;k<vm.other.length;k++) {
        vm.showO[k] = false;
        vm.other[k].id = k;
        vm.removeOtherIndexes[k] = false;
      }
    }
    function checkImage(mimetype) {
      // console.log(mimetype);
      if (mimetype !== undefined) {
        if (mimetype.split('/')[0] === 'image') {
          return true;
        }
        return false;
      }
    }
    function checkVideo(mimetype) {
      // console.log(mimetype);
      if (mimetype !== undefined) {
        if (mimetype.split('/')[0] === 'video') {
          return true;
        }
        return false;
      }
    }
    function checkYoutube(mimetype) {
      // console.log(mimetype);
      if (mimetype !== undefined) {
        if(mimetype === 'youtube') {
          return true;
        }
        return false;
      }
    }
    function appendUrls() {
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
            url: '/append-links',
            data: data
          }).then(function success(response) {
            $location.url('/viewImages');
          });
        }
      }
    }
    function prependUrls() {
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
            url: '/prepend-links',
            data: data
          }).then(function success(response) {
            $location.url('/viewImages');
          });
        }
      }
    }
    function replaceHeader(index) {
      if (index !== vm.prevIndex) {
        vm.show[index] = !vm.show[index];
      } else {
        vm.show[vm.prevIndex] = !vm.show[vm.prevIndex];
      }
      vm.prevIndex = index;
    }
    function replaceBody(index) {
      if (index !== vm.prevIndexBody) {
        vm.showB[index] = !vm.showB[index];
      } else {
        vm.showB[vm.prevIndexBody] = !vm.showB[vm.prevIndexBody];
      }
      vm.prevIndexBody = index;
    }
    function replaceOther(index) {
      if (index !== vm.prevIndexOther) {
        vm.showO[index] = !vm.showO[index];
      } else {
        vm.showO[vm.prevIndexOther] = !vm.showO[vm.prevIndexOther];
      }
      vm.prevIndexOther = index;
    }
    function addUpdateAction() {
      var index;
      if (vm.data.model === 'header')
        index = vm.show.indexOf(true);
      else if (vm.data.model === 'body')
        index = vm.showB.indexOf(true);
      else 
        index = vm.showO.indexOf(true);
      return index+'/'+ vm.data.model +'/replace';
    }
    function replaceWithUrl() {
      if (vm.updateHeaderChoices.mimetype === '' || vm.updateHeaderChoices.url === '') {
        Notification.error({
          message: 'Please Enter the type and Url',
          title: '<i class="glyphicon glyphicon-remove"></i> Alert!',
          delay: 3000
        });
      } else {
        var index;
        if (vm.data.model === 'header')
          index = vm.show.indexOf(true);
        else if (vm.data.model === 'body')
          index = vm.showB.indexOf(true);
        else 
          index = vm.showO.indexOf(true);
        var data = {
          index: index,
          where: vm.data.model,
          image: vm.updateHeaderChoices
        };
        $http({
          method: 'POST',
          url: '/replace-url',
          data: data
        }).then(function success(response) {
          location.reload();
        });
      }
    }
    function deleteAll() {
      if (vm.data.model === null)
        Notification.error({
          message: 'Please select image category',
          title: '<i class="glyphicon glyphicon-remove"></i> Alert!',
          delay: 3000
        });
      else
        $http({
          method: 'PUT',
          url: '/delAll',
          data: {
            which: vm.data.model
          }
        }).then(function success(response) {
          $location.url('/add-info');
        });
    }
    function removeImage(index) {
      if (vm.data.model === 'header')
        vm.head.splice(index,1);
      else if (vm.data.model === 'body')
        vm.body.splice(index,1);
      else
        vm.other.splice(index,1);
    }
    function deleteImages() {
      var i;
      if (vm.data.model === 'header') {
        for(i=0;i<vm.head.length;i++)
          vm.removeHeadIndexes[vm.head[i].id] = true;
        $http({
          method: 'PUT',
          url: '/delete-image',
          data: {
            which: vm.data.model,
            images: vm.head,
            indexes : vm.removeHeadIndexes
          }
        }).then(function success(response) {
          $location.url('/add-info');
        });
      } else if(vm.data.model === 'body') {
        for(i=0;i<vm.body.length;i++)
          vm.removeBodyIndexes[vm.body[i].id] = true;
        $http({
          method: 'PUT',
          url: '/delete-image',
          data: {
            which: vm.data.model,
            images: vm.body,
            indexes : vm.removeBodyIndexes
          }
        }).then(function success(response) {
          $location.url('/add-info');
        });
      } else {
        for(i=0;i<vm.body.length;i++)
          vm.removeOtherIndexes[vm.body[i].id] = true;
        $http({
          method: 'PUT',
          url: '/delete-image',
          data: {
            which: vm.data.model,
            images: vm.other,
            indexes : vm.removeOtherIndexes
          }
        }).then(function success(response) {
          $location.url('/add-info');
        });
      }
    }
    function addInfo() {
      var info = document.getElementsByClassName('url-info');
      var infos = [].map.call(info, function(input) {
        return input.value;
      });
      $http({
        method: 'PUT',
        url:'/addurlInfo',
        data: {
          where: vm.infoOptions.model,
          info: infos
        }
      }).then(function success(res) {
        $location.url('/viewImages');
      });
    }
    function addPriority() {
      var priority = document.getElementsByClassName('url-priority');
      var priorities = [].map.call(priority, function(input) {
        return parseInt(input.value);
      });
      $http({
        method:'PUT',
        url: '/addPriority',
        data: {
          which: vm.priorityOptions.model,
          priorities: priorities
        }
      }).then(function success(response) {
        $location.url('/viewImages');
      });
    }
  }
]);
