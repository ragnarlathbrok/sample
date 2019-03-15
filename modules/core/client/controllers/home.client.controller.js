'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$location', 'Notification','$sce',
  function ($scope, Authentication, $http, $location, Notification,$sce) {
    // This provides Authentication context.
    var vm = this;
    vm.authentication = Authentication.user;
    vm.checkVideo = checkVideo;
    vm.checkImage = checkImage;
    vm.initPage = initPage;
    vm.checkYoutube = checkYoutube;
    vm.getPath = getPath;
    vm.getYoutubePath = getYoutubePath;
    vm.checkPhone = checkPhone;
    vm.checkUrl = checkUrl;
    vm.isURL = isURL;
    vm.checkEmail = checkEmail;
    function isURL(path) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return pattern.test(path);
    }
    function checkPhone(message) {
      var re = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
      return re.test(message);
    }
    function checkEmail(message) {
      var re = /\S+@\S+\.\S+/;
      return re.test(message);
    }
    function checkUrl(message) {
      if(!checkEmail(message) && !checkPhone(message))
        return true;
    }
    function getPath(path) {
      if(isURL(path)) {
        return $sce.trustAsResourceUrl(path);
      }
      var newpath = 'http://13.127.44.186:9000/'+ path + '#t=0.2';
      // console.log(newpath);
      return $sce.trustAsResourceUrl(newpath);
    }
    function getYoutubePath(path) {
      return $sce.trustAsResourceUrl(path);
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
    function initPage() {
      console.log(vm.authentication);
      if(!Authentication.user) {
        $http({
          method: 'GET',
          url: '/getImages'
        }).then(function success(response) {
          vm.head = response.data.head;
          vm.body = response.data.body;
          vm.other = response.data.other;
          vm.hInfo = response.data.headInfo;
          vm.bInfo = response.data.bodyInfo;
          vm.oInfo = response.data.otherInfo;
          vm.hPriority = response.data.headPriority;
          vm.bPriority = response.data.bodyPriority;
          vm.showHead = vm.head.length !== 0;
          vm.showBody = vm.body.length !== 0;
          vm.showOther = vm.other.length !== 0;
        });
      } else {
        vm.head = Authentication.user.head;
        vm.body = Authentication.user.body;
        vm.other = Authentication.user.other;
        vm.hInfo = Authentication.user.headInfo;
        vm.bInfo = Authentication.user.bodyInfo;
        vm.oInfo = Authentication.user.otherInfo;
        vm.hPriority = Authentication.user.headPriority;
        vm.bPriority = Authentication.user.bodyPriority;
        vm.showHead = vm.head.length !== 0;
        vm.showBody = vm.body.length !== 0;
        vm.showOther = vm.other.length !== 0;
      }
    }
  }
]);
