define(["backbone", "underscore", "q"], function(Backbone, _, Q){
  function OneToMany(one, many, ref){
    _.extend(this, Backbone.Events);

    this._one = one;
    this._many = many;
    this._ref = ref;
    this._items = [];
  }

  function paramToArray(param) {
    return _.isArray(param) ? param : [param];
  }

  function addAll(oneToMany, models) {
    oneToMany._items = _.chain(this._items)
        .difference(models)
        .union(models)
        .value();
  }

  OneToMany.prototype.add = function(models) {
    var that = this;
    var models = paramToArray(models);
    addAll(this, models);
    _.each(models, function(model){
      model.set(that._ref, that._one.id);
    });
  }

  OneToMany.prototype.fetch = function() {
    that = this;
    this._items = [];

    var promises = this._many.map(function(Model){
      return Model.objects.fetch();
    });

    return Q.all(promises)
      .then(function(results){
        results.forEach(function(collection){
          var filter = {};
          filter[that._ref] = that._one.id;

          var values = collection.where(filter);
          that._items = that._items.concat(values);
        });
        return that._items;
      });
  }

  return OneToMany;
});
