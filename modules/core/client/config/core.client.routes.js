'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html',
      controller:'HomeController',
      controllerAs: 'vm'
    })
    .state('add-info',{
      url: '/add-info',
      templateUrl: 'modules/core/client/views/add.client.view.html',
      controller: 'AddController',
      controllerAs: 'vm'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('viewImages', {
      url: '/viewImages',
      templateUrl: 'modules/core/client/views/viewImages.client.view.html',
      controller: 'ViewController',
      controllerAs: 'vm'
    })
    .state('updateImages', {
      url: '/updateImages',
      templateUrl: 'modules/core/client/views/updateImages.client.view.html',
      controller: 'UpdateController',
      controllerAs: 'vm'
    });
  }
]);
