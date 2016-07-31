(function () {
  'use strict';

  describe('Coustmers Route Tests', function () {
    // Initialize global variables
    var $scope,
      CoustmersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CoustmersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CoustmersService = _CoustmersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('coustmers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/coustmers');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CoustmersController,
          mockCoustmer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('coustmers.view');
          $templateCache.put('modules/coustmers/client/views/view-coustmer.client.view.html', '');

          // create mock Coustmer
          mockCoustmer = new CoustmersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Coustmer Name'
          });

          //Initialize Controller
          CoustmersController = $controller('CoustmersController as vm', {
            $scope: $scope,
            coustmerResolve: mockCoustmer
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:coustmerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.coustmerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            coustmerId: 1
          })).toEqual('/coustmers/1');
        }));

        it('should attach an Coustmer to the controller scope', function () {
          expect($scope.vm.coustmer._id).toBe(mockCoustmer._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/coustmers/client/views/view-coustmer.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CoustmersController,
          mockCoustmer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('coustmers.create');
          $templateCache.put('modules/coustmers/client/views/form-coustmer.client.view.html', '');

          // create mock Coustmer
          mockCoustmer = new CoustmersService();

          //Initialize Controller
          CoustmersController = $controller('CoustmersController as vm', {
            $scope: $scope,
            coustmerResolve: mockCoustmer
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.coustmerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/coustmers/create');
        }));

        it('should attach an Coustmer to the controller scope', function () {
          expect($scope.vm.coustmer._id).toBe(mockCoustmer._id);
          expect($scope.vm.coustmer._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/coustmers/client/views/form-coustmer.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CoustmersController,
          mockCoustmer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('coustmers.edit');
          $templateCache.put('modules/coustmers/client/views/form-coustmer.client.view.html', '');

          // create mock Coustmer
          mockCoustmer = new CoustmersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Coustmer Name'
          });

          //Initialize Controller
          CoustmersController = $controller('CoustmersController as vm', {
            $scope: $scope,
            coustmerResolve: mockCoustmer
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:coustmerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.coustmerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            coustmerId: 1
          })).toEqual('/coustmers/1/edit');
        }));

        it('should attach an Coustmer to the controller scope', function () {
          expect($scope.vm.coustmer._id).toBe(mockCoustmer._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/coustmers/client/views/form-coustmer.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
