'use strict';

define(["model"], function(model){
  return model("Map", {
    afterImport: function(importData) {
      this.save({
        tileSetId: importData.originalIds['TileSet:' + this.get('tileSetId')].get('id')
      });
    }
  });
});
