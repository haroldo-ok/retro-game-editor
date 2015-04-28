define(["backbone", "localforage-backbone"], function(Backbone){
  return function(name, options){
    var Model = Backbone.Model.extend({
        sync: Backbone.localforage.sync(name)
    });

    Model.objects = Backbone.Collection.extend({
        model: Model,
        sync: Backbone.localforage.sync(name)
    });

    return Model;
  }
});
