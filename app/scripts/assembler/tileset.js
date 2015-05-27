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

  function palToHex(palette) {
    var padded = (palette || []).slice(0, 16);
    while (padded.length < 16) {
      padded.push({r: 0, g: 0, b: 0});
    }

    return padded.map(function(rgb){
      if (!rgb) {
        return '00h';
      }

      var b = (rgb.r >> 6 << 4) | (rgb.g >> 6 << 2) | (rgb.b >> 6);
      return toHex(b) + 'h';
    }).join(',')
  }

  return function(project) {
      if (!project) {
        return "";
      }

      var tileSets = project.resources.ofType('TileSet');
      return tileSets.map(function(tileSet, position){
        var json = tileSet.toJSON();
        json = _.extend(json, {
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
          }),
          palHex: palToHex(json.palette)
        });
        return template(json);
      }).join('\n');
  }
});
