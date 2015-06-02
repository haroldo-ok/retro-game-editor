'use strict';

define(["model"], function(model){
  return model("Map", {
    afterImport: function(importData) {
      this.save({
        tileSetId: importData.originalIds[this.get('tileSetId')]
      });
    }
  });
});
