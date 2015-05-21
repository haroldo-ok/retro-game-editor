'use strict';

define(["model"], function(model){
  return model("TileSet", {
    tilePixels: function() {
      var tiles = this.get('tiles');

      return (tiles || []).map(function(tile){
        if (!tile || !tile.pixels) {
          return null;
        }

        // Convert the textual representation into a 2D number array
        return tile.pixels.split('\n').map(function(line){
          var numericValues = [];
          for (var i = 0; i < line.length; i++) {
            numericValues[i] = parseInt(line[i], 16) || 0;
          }
          return numericValues;
        });
      });
    }
  });
});
