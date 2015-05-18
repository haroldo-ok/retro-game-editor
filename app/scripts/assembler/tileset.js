define(["underscore", "hbars!./tileset.hbs"], function(_, template){

  function encodeTile(pixelsText) {
    if (!pixelsText) {
      return null;
    }

    // Convert the textual representation into a 2D number array
    var pixels = pixelsText.split('\n').map(function(line){
      var numericValues = [];
      for (var i = 0; i < line.length; i++) {
        numericValues[i] = parseInt(line[i], 16) || 0;
      }
      return numericValues;
    });
    var tileWidth = _.chain(pixels).pluck('length').max().value();

    // Cuts up the tile into 8x8 characters
    var chars = [];
    for (var oX = 0; oX < tileWidth; oX += 8) {
      pixels.forEach(function(line){
        chars.push(line.slice(oX, oX + 8));
      });
    }

    // Converts the "chunky" tiles to the planar format
    var planar = chars.map(function(line){
      var bitPlanes = [];

      for (var plane = 0, oMask = 1; plane < 4; plane++, oMask <<= 1) {
        var value = 0;
        for (var x = 0, dMask = 0x80; x < line.length; x++, dMask >>= 1) {
          if (line[x] & oMask) {
            value |= dMask;
          }
        }
        bitPlanes.push(value);
      }

      return bitPlanes;
    });

    return planar;
  }

  function toHex(byte) {
    var s = byte.toString(16);
    while (s.length < 2) {
      s = '0' + s;
    }
    return s;
  }

  return function(project) {
      if (!project) {
        return "";
      }

      var tileSets = project.resources.ofType('TileSet');
      return tileSets.map(function(tileSet, position){
        var json = tileSet.toJSON();
        json = _.extend(tileSet.toJSON(), {
          position: position,
          formattedId: json.id.replace(/-/g, '_'),
          tiles: (json.tiles || []).map(function(tile){
            tile.encoded = encodeTile(tile.pixels);

            tile.hex = (tile.encoded || []).map(function(line){
              return line.map(function(byte){
                return toHex(byte) + 'h';
              }).join(',');
            });

            return tile;
          })
        });
        return template(json);
      }).join('\n');
  }
});
