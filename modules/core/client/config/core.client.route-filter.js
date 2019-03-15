(function () {
  'use strict';
  angular
    .module('core')
    .run(routeFilter);
  routeFilter.$inject = ['$state', 'Authentication', '$location'];
  function routeFilter($state, Authentication, $location) {
    // console.log('Route filter invoked');
    // console.log($location.path());
    // console.log(Authentication.user);
    if($location.path() === '/add-info'){
      if(Authentication.user) {
        $location.url('/add-info');
      } else {
        $location.url('/');
      }
    }
    if($location.path() === '/viewImages'){
      if(Authentication.user) {
        $location.url('/viewImages');
      } else {
        $location.url('/');
      }
    }
    if($location.path() === '/updateImages'){
      if(Authentication.user){
        $location.url('/updateImages');
      } else {
        $location.url('/');
      }
    }
  }
}());
