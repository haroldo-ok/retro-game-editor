define(["backbone", "localforage-backbone"], function(Backbone){
  return function(name, options){
    var Model = Backbone.Model.extend({
        save: function(attributes, options){
          // Adds it to the main collection
          if (this.isNew()) {
            Model.objects.add(this);
          }
          // Does the actual saving
          Backbone.Model.prototype.save.apply(this, arguments);
        },
        sync: Backbone.localforage.sync(name)
    });

    var ModelCollection = Backbone.Collection.extend({
        model: Model,
        sync: Backbone.localforage.sync(name)
    });

    Model.objects = new ModelCollection();

    return Model;
  }
});
