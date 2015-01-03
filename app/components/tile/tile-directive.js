'use strict';

angular.module('retroGameEditor.tile.tile-directive', [])

.directive('rgeTile', [function() {
	return {
		restrict: 'A',
		scope: {
			tile: '=rgeTile'
		},
		link: function(scope, elm, attrs) {
			var canvas = elm[0];
			var ctx = canvas.getContext('2d');
			
			canvas.width = scope.tile.w;
			canvas.height = scope.tile.h;
			
			var imageData = ctx.createImageData(canvas.width, canvas.height);
			var imgPtr = 0;
			var tilePixels = scope.tile.pixels;
			for (var y = 0; y != tilePixels.length; y++) {
				var row = tilePixels[y];
				for (var x = 0; x != tilePixels.length; x++) {
					var colorIndex = row[x];
					imageData.data[imgPtr++] = colorIndex << 8; // Red
					imageData.data[imgPtr++] = colorIndex << 8; // Green
					imageData.data[imgPtr++] = colorIndex << 8; // Blue
					imageData.data[imgPtr++] = 0xFF; // Alpha
				}
			}
			ctx.putImageData(imageData, 0, 0);
		
			console.warn('OK');
		}
	};
}]);
