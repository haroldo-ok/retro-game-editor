define(["underscore", "underscore.string", "hbars!./map.hbs"],
function(_, s, template) {
  return function(project) {
    if (!project) {
      return "";
    }

    var maps = project.resources.ofType('Map');

    return maps.map(function(map, position){
      var json = map.toJSON();
      json = _.extend(json, {
        position: position,
        formattedId: json.id.replace(/-/g, '_'),
        tiles: (json.tiles || []).map(function(row){
          return (row || []).map(function(tileNum){
            return s.lpad((tileNum || 0).toString(16)) + 'h';
          }).join(',');
        })
      });
      return template(json);
    }).join('\n');
  }
});
