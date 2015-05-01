define(["backbone", "localforage-backbone"], function(Backbone){
  return function(name, options){
    var modelOptions = _.omit(options || {}, 'objects');
    var collectionOptions = options && options.objects || {};

    var BaseModel = Backbone.Model.extend({
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
    var Model = BaseModel.extend(modelOptions);

    var BaseCollection = Backbone.Collection.extend({
        model: Model,
        sync: Backbone.localforage.sync(name)
    });
    var ModelCollection = BaseCollection.extend(collectionOptions);

    Model.BaseModel = BaseModel;
    Model.BaseCollection = BaseCollection;
    Model.objects = new ModelCollection();

    return Model;
  }
});
