(function () {
  'use strict';

  angular
    .module('coustmers')
    .controller('CoustmersListController', CoustmersListController);

  CoustmersListController.$inject = ['CoustmersService'];

  function CoustmersListController(CoustmersService) {
    var vm = this;

    vm.coustmers = CoustmersService.query();
  }
})();
