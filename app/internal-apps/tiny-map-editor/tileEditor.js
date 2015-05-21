'use strict';

top.require(["jquery", "model", "model/project", "view/util/query-string"],
function($, model, Project, queryString){

  var defaultPalette = [
    [0,255,255], // None
    [0,0,0], // Black
    [33,200,66], // Green
    [94,220,120], // Green (light)
    [84,85,237], // Blue (dark)
    [125,118,252], // Blue
    [212,82,77], // Red (dark)
    [66,235,245], // Cyan
    [252,85,84], // Red
    [255,121,120], // Red (light)
    [212,193,84], // Yellow (dark)
    [230,206,128], // Yellow
    [33,176,59], // Green (dark)
    [201,91,186], // Purple
    [204,204,204], // Gray
    [255,255,255] // White
  ];

  var tinyMapEditor = (function() {
      var win = window,
          doc = document,
          pal = doc.getElementById('palette').getContext('2d'),
          map = doc.getElementById('tileEditor').getContext('2d'),
          width = 16,
          height = 12,
          tileSize = 16,
          srcTile = 0,
          sprite = new Image(),
          tiles, // used for demo, not *really* needed atm
          alpha,

          selectedZoom = 4,
          mapZoom = 2,

          player,
          draw,
          build = doc.getElementById('build'),
          test = doc.getElementById('test'),

          $doc = $(doc);

      var app = {
          getTile : function(e) {
              if (e.target.nodeName === 'CANVAS') {
                  var targetId = e.target.id;
                  var zoom = targetId == 'tileEditor' ? mapZoom : 1;

                  var row = Math.floor(e.layerX / tileSize / zoom) | 0,
                      col = Math.floor(e.layerY / tileSize / zoom) | 0;

                  if (e.target.id === 'palette') srcTile = { row : row, col : col };

                  return { row : row, col : col };
              }
          },

          setTile : function(e) {
              var destTile;

              if (e.target.id === 'tileEditor' && srcTile && !draw) {
                  destTile = this.getTile(e);
                  map.clearRect(destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);
                  map.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);
              }
          },

          drawTool : function() {
              var rect = doc.createElement('canvas'),
                  ctx = rect.getContext('2d'),
                  eraser = function() {
                      ctx.fillStyle = 'red';
                      ctx.fillRect(0, 0, tileSize, tileSize);
                      ctx.fillStyle = 'white';
                      ctx.fillRect(2, 2, tileSize - 4, tileSize - 4);
                      ctx.strokeStyle = 'red';
                      ctx.lineWidth = 2;
                      ctx.moveTo(tileSize, 0);
                      ctx.lineTo(0, tileSize);
                      ctx.stroke();
                  };

              rect.width = rect.height = tileSize;
              rect.style.width = (rect.width * selectedZoom) + 'px';
              doc.getElementById('selected').appendChild(rect);
              eraser();

              this.drawTool = function() {
                  rect.width = tileSize;
                  srcTile ? ctx.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize) : eraser();
              };
          },

          eraseTile : function(e) {
              var destTile;
              if (!draw) {
                  if (e.target.id === 'erase' && srcTile) {
                      srcTile = 0;
                  } else if (e.target.id === 'tileEditor' && !srcTile) {
                      destTile = this.getTile(e);
                      map.clearRect(destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);
                  }
              }
          },

          drawMap : function() {
              var i, j, invert = document.getElementById('invert').checked ? 0 : 1;

              map.fillStyle = 'black';
              for (i = 0; i < width; i++) {
                  for (j = 0; j < height; j++) {
                      if (alpha[i][j] === invert) {
                          map.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
                      } else if (typeof alpha[i][j] === 'object') {
                          // map.putImageData(tiles[i][j], i * tileSize, j * tileSize); // temp fix to colour collision layer black
                      }
                  }
              }
          },

          clearMap : function(e) {
              if (e.target.id === 'clear') {
                  map.clearRect(0, 0, map.canvas.width, map.canvas.height);
                  this.destroy();
                  build.disabled = false;
              }
          },

          buildMap : function(e) {
              if (e.target.id === 'build') {
                  var obj = {},
                      pixels,
                      len,
                      x, y, z;

                  tiles = []; // graphical tiles (not currently needed, can be used to create standard tile map)
                  alpha = []; // collision map

                  for (x = 0; x < width; x++) { // tiles across
                      tiles[x] = [];
                      alpha[x] = [];

                      for (y = 0; y < height; y++) { // tiles down
                          pixels = map.getImageData(x * tileSize, y * tileSize, tileSize, tileSize);
                          len = pixels.data.length;

                          tiles[x][y] = pixels; // store ALL tile data
                          alpha[x][y] = [];

                          for (z = 0; z < len; z += 4) {
                              pixels.data[z] = 0;
                              pixels.data[z + 1] = 0;
                              pixels.data[z + 2] = 0;
                              alpha[x][y][z / 4] = pixels.data[z + 3]; // store alpha data only
                          }

                          if (alpha[x][y].indexOf(0) === -1) { // solid tile
                              alpha[x][y] = 1;
                          } else if (alpha[x][y].indexOf(255) === -1) { // transparent tile
                              alpha[x][y] = 0;
                          } else { // partial alpha, build pixel map
                              alpha[x][y] = this.sortPartial(alpha[x][y]);
                              tiles[x][y] = pixels; // (temporarily) used for drawing map
                          }
                      }
                  }

                  this.outputJSON();
                  this.drawMap();
              }
          },

          sortPartial : function(arr) {
              var len = arr.length,
                  temp = [],
                  i, j;

              for (i = 0; i < tileSize; i++) {
                  temp[i] = [];
                  for (j = 0; j < len; j++) {
                      if (j % tileSize === j) {
                          temp[i][j] = arr[j * tileSize + i];
                      }
                  }
                  temp[i] = temp[i].indexOf(255);
              }
              return temp;
          },

          outputJSON : function() {
              var output = '',
                  invert = document.getElementById('invert').checked;

              if (invert) {
                  alpha.forEach(function(arr) {
                      arr.forEach(function(item, index) {
                          // using bitwise not to flip values
                          if (typeof item === 'number') arr[index] = Math.abs(~-item);
                      });
                  });
              }

              // output = (output.split('],'));
              // output = output.concat('],');

              output = JSON.stringify(alpha);
              doc.getElementsByTagName('textarea')[0].value = output;
          },

          loadMap: function() {
            var query = queryString.parse(location.search);
            var Model = model.byName(query.entity);
            this.mapEntity = Model.objects.get(query.entityId);
            this.project = Project.objects.get(this.mapEntity.get('projectId'));
          },

          populateTilesets: function() {
            // TODO: Rewrite this without jQuery, to match the rest of the file.

            var $select = $doc.find('#tileSets');

            $select.empty();
            this.project.resources.ofType('TileSet').forEach(function(tileSet){
              $select.append($('<option>')
                .attr('value', tileSet.get('id'))
                .text(tileSet.get('name') || '**unnamed**'));
            });

            this.updateTileset();
          },

          updateTileset: function() {
            var select = doc.getElementById('tileSets');
            var selectedOption = select.selectedIndex < 0 ?
              null : select.options[select.selectedIndex];

            if (selectedOption) {
              var tileSet = this.project.resources.get('TileSet', selectedOption.value);
              console.warn(tileSet);

              var tiles = tileSet.tilePixels();
              console.warn(tiles);

              var tilesPerLine = 6,
                  tileSize = 16;

              var canvas = document.createElement('canvas');
              canvas.width = tileSize * tilesPerLine;
              canvas.height = tileSize * Math.ceil(tiles.length / tilesPerLine);

              var ctx = canvas.getContext('2d');
              var imgData = map.getImageData(0, 0, canvas.width, canvas.height);

              // Draw the tiles on the canvas
              var dX = 0,
                  dY = 0;
              tiles.forEach(function(tile){
                if (tile) {
                  // Draw tile on the canvas
                  for (var y = 0; y < tile.length; y++) {
                    var line = tile[y],
                        yOffs = (y + dY) * canvas.width;

                    for (var x = 0; x < line.length; x++) {
                      var colorIndex = line[x],
                          rgb = defaultPalette[colorIndex],
                          offs = (x + dX + yOffs) * 4;

                      imgData.data[offs] = rgb[0]; // Red
                      imgData.data[offs + 1] = rgb[1]; // Green
                      imgData.data[offs + 2] = rgb[2]; // Blue
                      imgData.data[offs + 3] = 255; // Alpha
                    }
                  }
                }

                // Calculate position of next tile
                dX += tileSize;
                if (dX >= canvas.width) {
                  dX = 0;
                  dY += tileSize;
                }
              });

              ctx.putImageData(imgData, 0, 0);
              sprite.src = canvas.toDataURL();
            }
          },

          bindEvents : function() {
              var _this = this;


              /**
               * Window events
               */

              win.addEventListener('click', function(e) {
                  _this.setTile(e);
                  _this.getTile(e);
                  _this.eraseTile(e);
                  _this.drawTool();
                  _this.clearMap(e);
                  _this.buildMap(e);
              }, false);


              /**
               * Image load event
               */

              sprite.addEventListener('load', function() {
                  pal.canvas.width = this.width;
                  pal.canvas.height = this.height;
                  pal.drawImage(this, 0, 0);
              }, false);


              /**
               * Input change events
               */

              document.getElementById('width').addEventListener('change', function() {
                  width = +this.value;
                  _this.destroy();
                  _this.init();
              }, false);

              document.getElementById('height').addEventListener('change', function() {
                  height = +this.value;
                  _this.destroy();
                  _this.init();
              }, false);
          },

          init : function() {
              this.loadMap();
              this.populateTilesets();

              //sprite.src = 'assets/tilemap_32a.png';
              map.canvas.width = width * tileSize;
              map.canvas.height = height * tileSize;
              map.canvas.style.width = (map.canvas.width * mapZoom) + 'px';
              this.drawTool();
          },

          destroy : function() {
              clearInterval(draw);
              alpha = [];
          }
      };



      app.bindEvents();
      app.init();
      return app;

  })();

});
