'use strict';

// Declare app level module which depends on views, and components
angular.module('retroGameEditor', [
	'ngRoute',
	'retroGameEditor.tileset'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/tiles', {
			templateUrl: 'tileset/tileset-list.html',
			controller: 'TilesetListCtrl'
		}).
		otherwise({
			redirectTo: '/tiles'
		});
}]);
