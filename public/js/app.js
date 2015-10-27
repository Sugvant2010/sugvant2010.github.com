(function () {
    'use strict';

    angular
        .module('app', ["ui.router"])
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
            $stateProvider
                .state('home',{
                    url: '/',
                    templateUrl: '/partials/home.html'

                })
                .state('login',{
                    url: '/login',
                    templateUrl: '/partials/login.html',
                    controller: 'UserController as vm'
                })
                .state('logout',{
                    url: '/logout',
                    templateUrl: ' ',
                    controller: 'UserController as vm'
                })
                .state('signup',{
                    url: '/signup',
                    templateUrl: '/partials/profile.html',
                    controller: 'UserController as vm'

                })
                .state('forgot',{
                    url: '/forgot',
                    templateUrl: '/partials/forgot.html',
                    controller: 'UserController as vm'

                })
                .state('reset',{
                    url: '/reset/:token',
                    templateUrl: '/partials/reset.html',
                    controller: 'UserController as vm'
                });

            $stateProvider
                .state('links',{
                    url: '/links',
                    templateUrl: '/partials/links.html',
                    controller: 'LinksController as vm'
                })
                .state('link',{
                    url: '/links/:id',
                    templateUrl: '/partials/link.html',
                    controller: 'LinksController as vm'
                })
                .state('tags',{
                    url: '/tags/:tag',
                    templateUrl: '/partials/links.html',
                    controller: 'LinksController as vm'
                });

            $stateProvider
                .state('profile',{
                    url: '/profile',
                    templateUrl: '/partials/profile.html',
                    controller: 'UserController as vm',
                    authenticate: true
                })
                .state('mylinks',{
                    url: '/mylinks',
                    templateUrl: '/partials/mylinks.html',
                    controller: 'LinksController as vm',
                    authenticate: true
                })
                .state('createLink',{
                    url: '/create',
                    templateUrl: '/partials/link.create.html',
                    controller: 'LinksController as vm',
                    authenticate: true
                })
                .state('updateLink',{
                    url: '/links/:id/update',
                    templateUrl: '/partials/link.update.html',
                    controller: 'LinksController as vm',
                    authenticate: true
                });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        })

        .run(function ($rootScope, $state, userService) {
            $rootScope.$on("$stateChangeStart", function(event, toState){

                    userService.checkSession().then(function(data) {
                        if (data.result) {
                            $rootScope.userId = data.id;
                        }
                        if (toState.authenticate && !$rootScope.userId) {
                            $state.transitionTo("login");
                            event.preventDefault();
                        }
                    });

            });
        });

})();