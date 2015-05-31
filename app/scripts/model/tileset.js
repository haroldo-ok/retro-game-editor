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
    },

    palette: function() {
      var palette = this.get('palette') || [];

      for (var i = 0; i < 16; i++) {
        var palEntry = palette[i] || {};
        palEntry.r = palEntry.r || 0;
        palEntry.g = palEntry.g || 0;
        palEntry.b = palEntry.b || 0;
        palette[i] = palEntry;
      }

      return palette;
    }
  });
});
