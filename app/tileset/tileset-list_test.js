'use strict';

describe('Tileset list', function() {
	var scope, ctrl;

	beforeEach(module('retroGameEditor.tileset'));

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		ctrl = $controller('TilesetListCtrl', {$scope: scope});
	}));

	it('should return a list of tilesets', inject(function($controller) {
		expect(scope.tilesets.length).toBeGreaterThan(0);
	}));

	it('should have consistent dimensions for the tiles', inject(function($controller) {
		scope.tilesets.forEach(function(tileset){
			tileset.tiles.forEach(function(tile){
				expect(tile.pixels.length).toBe(tile.h);
				tile.pixels.forEach(function(row){
					expect(row.length).toBe(tile.w);
				});
			});
		});
	}));

});