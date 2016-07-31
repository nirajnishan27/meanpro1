'use strict';

describe('Coustmers E2E Tests:', function () {
  describe('Test Coustmers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/coustmers');
      expect(element.all(by.repeater('coustmer in coustmers')).count()).toEqual(0);
    });
  });
});
