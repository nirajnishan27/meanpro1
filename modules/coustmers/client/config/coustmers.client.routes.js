(function () {
  'use strict';

  angular
    .module('coustmers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('coustmers', {
        abstract: true,
        url: '/coustmers',
        template: '<ui-view/>'
      })
      .state('coustmers.list', {
        url: '',
        templateUrl: 'modules/coustmers/client/views/list-coustmers.client.view.html',
        controller: 'CoustmersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Coustmers List'
        }
      })
      .state('coustmers.create', {
        url: '/create',
        templateUrl: 'modules/coustmers/client/views/form-coustmer.client.view.html',
        controller: 'CoustmersController',
        controllerAs: 'vm',
        resolve: {
          coustmerResolve: newCoustmer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Coustmers Create'
        }
      })
      .state('coustmers.edit', {
        url: '/:coustmerId/edit',
        templateUrl: 'modules/coustmers/client/views/form-coustmer.client.view.html',
        controller: 'CoustmersController',
        controllerAs: 'vm',
        resolve: {
          coustmerResolve: getCoustmer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Coustmer {{ coustmerResolve.name }}'
        }
      })
      .state('coustmers.view', {
        url: '/:coustmerId',
        templateUrl: 'modules/coustmers/client/views/view-coustmer.client.view.html',
        controller: 'CoustmersController',
        controllerAs: 'vm',
        resolve: {
          coustmerResolve: getCoustmer
        },
        data:{
          pageTitle: 'Coustmer {{ articleResolve.name }}'
        }
      });
  }

  getCoustmer.$inject = ['$stateParams', 'CoustmersService'];

  function getCoustmer($stateParams, CoustmersService) {
    return CoustmersService.get({
      coustmerId: $stateParams.coustmerId
    }).$promise;
  }

  newCoustmer.$inject = ['CoustmersService'];

  function newCoustmer(CoustmersService) {
    return new CoustmersService();
  }
})();
