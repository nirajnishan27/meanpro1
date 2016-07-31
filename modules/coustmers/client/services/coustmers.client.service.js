//Coustmers service used to communicate Coustmers REST endpoints
(function () {
  'use strict';

  angular
    .module('coustmers')
    .factory('CoustmersService', CoustmersService);

  CoustmersService.$inject = ['$resource'];

  function CoustmersService($resource) {
    return $resource('api/coustmers/:coustmerId', {
      coustmerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
