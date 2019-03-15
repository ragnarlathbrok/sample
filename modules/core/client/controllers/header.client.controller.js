'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication','$location',
  function ($scope, $state, Authentication,$location) {
    var vm=this;
    vm.authentication = Authentication.user;
    if (vm.authentication) {
      vm.authentication.location = $location.path();
    }
  }
]);
