(function () {
  'use strict';

  // Coustmers controller
  angular
    .module('coustmers')
    .controller('CoustmersController', CoustmersController);

  CoustmersController.$inject = ['$scope', '$state', 'Authentication', 'coustmerResolve'];

  function CoustmersController ($scope, $state, Authentication, coustmer) {
    var vm = this;

    vm.authentication = Authentication;
    vm.coustmer = coustmer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Coustmer
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.coustmer.$remove($state.go('coustmers.list'));
      }
    }

    // Save Coustmer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.coustmerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.coustmer._id) {
        vm.coustmer.$update(successCallback, errorCallback);
      } else {
        vm.coustmer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('coustmers.view', {
          coustmerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
