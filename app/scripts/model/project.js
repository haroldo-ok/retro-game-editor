'use strict';

define(["model", "model/onetomany", "q", "underscore",
  "model/tileset", "model/map", "model/actor"],
function(model, OneToMany, Q, _, TileSet, Map, Actor){
  var Project = model("Project", {
    constructor: function() {
      this.resources = new OneToMany(this, [TileSet, Map, Actor], 'projectId');
      this.resources.ofType = function(type){
        return this.where({entityName: type});
      }
      Project.BaseModel.apply(this, arguments);
    },

    fullJSON: function() {
      return _.extend(this.toJSON(), {
        entityName: this.entityName,
        resources: this.resources.toJSON()
      });
    },

    importJSON: function(json) {
      var json = _.isString(json) ? JSON.parse(json) : json;

      var that = this;
      this.save(_.omit(json, 'id', 'resources', 'entityName'));

      var importData = {
        project: this,
        originalIds: {}
      };

      (json.resources || []).forEach(function(resJson){
        var Model = model.byName(resJson.entityName);
        var resource = new Model(_.omit(resJson, 'id', 'projectId', 'entityName'));
        importData.originalIds[resJson.entityName + ':' + resJson.id] = resource;
        that.resources.add(resource);
        resource.save();
      });

      this.resources.forEach(function(resource){
        resource.afterImport && resource.afterImport(importData);
      });
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
      },
      fullJSON: function() {
        return this.map(function(project){
          return project.fullJSON();
        });
      }
    }
  });
  return Project;
});
