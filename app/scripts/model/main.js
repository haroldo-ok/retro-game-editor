'use strict';

define(["backbone", "underscore", "q", "localforage-backbone"], function(Backbone, _, Q){
  var registeredEntities = {};

  function entity(name, options){
    var modelOptions = _.omit(options || {}, 'objects');
    var collectionOptions = options && options.objects || {};

    function injectPromise(options) {
      var options = options || {};
      var deferred = Q.defer();
      var injected = (options, {
        success: function(){
          options.success && options.success.apply(this, arguments);
          deferred.resolve.apply(this, arguments);
        },
        error: function(){
          options.error && options.error.apply(this, arguments);
          deferred.reject.apply(this, arguments);
        },
        promise: deferred.promise
      });

      return injected;
    }

    var BaseModel = Backbone.Model.extend({
        entityName: name,

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
        fetch: function(options) {
          options = injectPromise(options);
          Backbone.Collection.prototype.fetch.call(this, options);
          return options.promise;
        },
        sync: Backbone.localforage.sync(name)
    });
    var ModelCollection = BaseCollection.extend(collectionOptions);

    Model.BaseModel = BaseModel;
    Model.BaseCollection = BaseCollection;
    Model.objects = new ModelCollection();

    registeredEntities[name] = Model;

    return Model;
  }

  entity.byName = function(name){
    return registeredEntities[name];
  }

  return entity;
});
