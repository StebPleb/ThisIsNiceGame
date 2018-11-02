//=============================================================================
// Change Tile Size
// by Shaz
// version 1.2
// Last Update: 2017.04.12
//=============================================================================

/*:
 * @plugindesc Allows maps based on a grid size other than 48x48
   <ChangeTileSize> v1.1
 * @author Shaz
 *
 * @param Tile Size
 * @desc Size of tiles (pixels)
 * @default 48
 *
 * @param Tileset Image Folder
 * @desc Folder where the in-game tilesets are kept
 * @default img/tilesets/
 *
 * @param Parallax Image Folder
 * @desc Folder where the in-game parallaxes are kept
 * @default img/parallaxes/
 *
 * @help This plugin does not provide plugin commands.
 *
 * To use the map editor with tiles of a size other than 48x48 in your project,
 * have two folders for tileset images.  The folder named in the plugin
 * parameters is for original, high-quality, final-sized tiles.  The
 * original folder, img/tilesets/ can contain a duplicate copy of each
 * tileset, shrunk or enlarged to 48x48 pixels per tile.  Quality in the
 * editor may be poorer, but the original tiles will be used in the game.
 * The img/tilesets folder can be cleared prior to distribution.
 *
 * The same applies to the img/parallaxes folder if using a parallax map
 * with a grid size other than 48x48.
 *
 * ----------------------------------------------------------------------------
 * Revisions
 *
 * 1.1  2016.10.17 Catered for Tilemap tilesize to reduce choppiness
 *                 Removed dependency on js file name
 *      2016.10.23 Ensure resized tiles/parallaxes are included in build
 * 1.2  2017.04.12 Fix issue with excluding unused resources
 * ----------------------------------------------------------------------------
RESOURCE LIST - DO NOT MODIFY BELOW THIS LINE
 * @requiredAssets img/tilesetsmol/BuryRoom_B
 * @requiredAssets img/tilesetsmol/BuryRoom_A5
 * @requiredAssets
RESOURCE LIST - DO NOT MODIFY ABOVE THIS LINE
 */

(function() {

  var parameters = $plugins.filter(function(p) { return p.description.contains('<ChangeTileSize>'); })[0].parameters;
  var tileSize = parseInt(parameters['Tile Size'] || 48);
  var tilesetsFolder = String(parameters['Tileset Image Folder'] || 'img/tilesets/');
  var parallaxesFolder = String(parameters['Parallax Image Folder'] || 'img/parallaxes/');

  ImageManager.loadTileset = function(filename, hue) {
    return this.loadBitmap(tilesetsFolder, filename, hue, false);
  };

  ImageManager.loadParallax = function(filename, hue) {
      return this.loadBitmap(parallaxesFolder, filename, hue, true);
  };

  Game_Map.prototype.tileWidth = function() {
    return tileSize;
  };

  Game_Map.prototype.tileHeight = function() {
    return tileSize;
  };

  Game_Vehicle.prototype.maxAltitude = function() {
    return tileSize;
  };

  var Tilemap_initialize = Tilemap.prototype.initialize;
  Tilemap.prototype.initialize = function() {
    Tilemap_initialize.call(this);
    this._tileWidth = tileSize;
    this._tileHeight = tileSize;
  };

  // Add image files to required assets list, to ensure they are included
  // in a deployed project
  var _changeTileSize_Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    _changeTileSize_Scene_Boot_start.call(this);

    if (!Utils.isOptionValid('test') || DataManager.isBattleTest() ||
      DataManager.isEventTest()) {
        return;
      }

    // Read in this script
    var fs = require('fs');
    var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/');
    if (path.match(/^\/([A-Z]\:)/)) {
      path = path.slice(1);
    }
    path = decodeURIComponent(path);
    var scriptName = $plugins.filter(function(p) {
      return p.description.contains('<ChangeTileSize>') && p.status;
    })[0].name + '.js';
    var sourcePath = path + 'js/plugins/' + scriptName;
    var dataPath = path + 'data/';
    if (fs.existsSync(sourcePath)) {
      var source = fs.readFileSync(sourcePath, { encoding: 'utf8' });
      source = source.split('\r\n');
      var resListStart = source.indexOf('RESOURCE LIST - DO NOT MODIFY BELOW THIS LINE');
      var resListEnd = source.indexOf('RESOURCE LIST - DO NOT MODIFY ABOVE THIS LINE');
      if (resListStart === -1 || resListEnd === -1) {
        console.log('ERROR - Unable to create resource list for ' + scriptName);
        console.log('Please redownload the script and paste over your current version');
      } else {
        // remove previous list of resources
        source.splice(resListStart + 1, resListEnd - resListStart - 1);
        // build list of new resources
        var resTilesets = [];
        var resParallaxes = [];

        // get tilesets & parallaxes that are actually used
        $dataMapInfos.forEach(function(mapinfo) {
          if (mapinfo) {
            var map = JSON.parse(fs.readFileSync(dataPath + 'Map%1.json'.format(mapinfo.id.padZero(3))));

            if (!resTilesets.contains(map.tilesetId)) {
              resTilesets.push(map.tilesetId);
            }

            if (map.parallaxName !== '' && !resParallaxes.contains(map.parallaxName)) {
              resParallaxes.push(map.parallaxName);
            }

            // map events
            map.events.forEach(function (event) {
              if (event) {
                event.pages.forEach(function (page) {
                  if (page) {
                    getResources(page.list, resTilesets, resParallaxes);
                  }
                })
              }
            })
          }
        });

        // common events
        $dataCommonEvents.forEach(function(commonEvent) {
          if (commonEvent) {
            getResources(commonEvent.list, resTilesets, resParallaxes);
          }
        });

        // troop events
        $dataTroops.forEach(function (troop) {
          if (troop) {
            troop.pages.forEach(function (page) {
              if (page) {
                getResources(page.list, resTilesets, resParallaxes);
              }
            })
          }
        })

        // add resource list to script
        var inspos = resListStart + 1;

        resTilesetNames = [];
        resTilesets.forEach(function(tilesetId) {
          var tileset = $dataTilesets[tilesetId];
          if (tileset) {
            tileset.tilesetNames.forEach(function(tilesetName) {
              if (tilesetName !== '' && !resTilesetNames.contains(tilesetName)) {
                resTilesetNames.push(tilesetName);
              }
            })
          }
        });

        var tag = ' * @requiredAssets';
        source.splice(inspos, 0, tag);

        resTilesetNames.forEach(function(tilesetName) {
          tag = ' * @requiredAssets ' + tilesetsFolder + tilesetName;
          source.splice(inspos, 0, tag);
        });

        resParallaxes.forEach(function(parallaxName) {
          tag = ' * @requiredAssets ' + parallaxesFolder + parallaxName;
          source.splice(inspos, 0, tag);
        });

        // and save the file
        source = source.join('\r\n');
        fs.writeFileSync(sourcePath, source, { encoding: 'utf8' });
      }
    }
  };

  getResources = function(list, aryTilesets, aryParallaxes) {
    list.filter(function (cmd) {
      return cmd.code === 282 || cmd.code === 284;
    }).forEach(function(cmd) {
      if (cmd.code === 282 && !aryTilesets.contains(cmd.parameters[0])) {
        aryTilesets.push(cmd.parameters[0]);
      }
      if (cmd.code === 284 && !aryParallaxes.contains(cmd.parameters[0])) {
        aryParallaxes.push(cmd.parameters[0]);
      }
    });
  };
})();