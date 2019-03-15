'use strict';

angular.module('core').controller('ViewController', ['$scope', '$state', 'Authentication', '$location','$sce',
  function ($scope, $state, Authentication, $location,$sce) {
    var vm = this;
    //console.log(vm.authentication.head)
    
    vm.authentication = Authentication.user;
    vm.checkVideo = checkVideo;
    vm.checkImage = checkImage;
    vm.head = vm.authentication.head;
    vm.showHead = vm.head.length !== 0;
    vm.body = vm.authentication.body;
    vm.showBody = vm.body.length !== 0;
    vm.other = vm.authentication.other;
    vm.showOther = vm.other.length !== 0;
    vm.hInfo = vm.authentication.headInfo;
    vm.bInfo = vm.authentication.bodyInfo;
    vm.oInfo = vm.authentication.otherInfo;
    vm.hPriority = vm.authentication.headPriority;
    vm.bPriority = vm.authentication.bodyPriority;
    vm.checkYoutube = checkYoutube;
    vm.getPath = getPath;
    vm.isURL = isURL;
    vm.getYoutubePath = getYoutubePath;
    vm.checkPhone = checkPhone;
    vm.checkUrl = checkUrl;
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
    function getYoutubePath(path) {
      return $sce.trustAsResourceUrl(path);
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
      if (isURL(path)) {
        return $sce.trustAsResourceUrl(path);
      }
      var newpath = 'http://13.127.44.186:9000/' + path + '#t=0.2';
      // console.log(newpath);
      return $sce.trustAsResourceUrl(newpath);
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
  }
]);
