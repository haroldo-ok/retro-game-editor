'use strict';

define(["model", "model/onetomany", "model/tileset", "q"],
function(model, OneToMany, TileSet, Q){
  var Project = model("Project", {
    constructor: function() {
      this.resources = new OneToMany(this, [TileSet], 'projectId');
      Project.BaseModel.apply(this, arguments);
    },

    objects: {
      fetchAll: function(options) {
        return this.fetch.apply(this, arguments)
          .then(function(collection, response, options){

            var promises = collection.toArray().map(function(project){
              return project.resources.fetch();
            });

            return Q.all(promises)
              .then(function(){
                return collection;
              });
          });
      }
    }
  });
  return Project;
});
