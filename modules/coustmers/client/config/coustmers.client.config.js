(function () {
  'use strict';

  angular
    .module('coustmers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Coustmers',
      state: 'coustmers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'coustmers', {
      title: 'List Coustmers',
      state: 'coustmers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'coustmers', {
      title: 'Create Coustmer',
      state: 'coustmers.create',
      roles: ['user']
    });
  }
})();
