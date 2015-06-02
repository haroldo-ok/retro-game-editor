'use strict';

define(["model"], function(model){
  return model("Map", {
    afterImport: function(importData) {
      this.set({
        tileSetId: importData.originalIds[this.get('tileSetId')]
      });
    }
  });
});
