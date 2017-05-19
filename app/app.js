angular.module('starter', [ 'starter.controllers', 'ui.router', 'ngSanitize', 'ngCordova'])


.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $stateProvider

  // Each tab has its own nav history stack:
  .state('home', {
    url: '/home',
    cache: false,
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })

  .state('page1', {
    url: '/page1',
    templateUrl: 'views/page1.html',
    controller: 'page1Ctrl'
  })

  .state('page2', {
    url: '/page2',
    templateUrl: 'views/page2.html',
    controller: 'page2Ctrl'
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.post['Content-Type'] =  'application/x-www-form-urlencoded';
  // var clientId = ;
  // var clientSecret =;
  // var oauthToken =;
  //$twitterApi.configure(clientId, clientSecret, oauthToken);
});