'use strict';

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
    oneToMany._items = _.chain(oneToMany._items)
        .difference(models)
        .union(models)
        .value();
  }

  function captureEvents(oneToMany, models) {
    models.forEach(function(model){
      model.off(null, null, oneToMany);

      model.on('destroy', function(){
        oneToMany._items = _.without(oneToMany._items, model);
      });

      ['change', 'add', 'destroy'].forEach(function(evName){
        model.on(evName, function(){
          oneToMany._one.trigger(evName + '-detail');
        }, oneToMany);
      });
    });
  }

  OneToMany.prototype.add = function(models) {
    var that = this;
    var models = paramToArray(models);
    addAll(this, models);
    _.each(models, function(model){
      model.set(that._ref, that._one.id);
    });

    this._one.trigger('add-detail', models);
    captureEvents(this, models);
  }

  OneToMany.prototype.fetch = function() {
    var that = this;
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
        captureEvents(that, that._items);
        return that._items;
      });
  }

  OneToMany.prototype.toJSON = function() {
    return this._items.map(function(item){
      return _.extend(item.toJSON(), {
        entityName: item.entityName
      });
    });
  }

  var functionsToProxy = [
    'forEach','each','map','collect','reduce','foldl','inject','reduceRight',
    'foldr','find','detect','filter','select','reject','every','all','some',
    'any','contains','include','invoke','max','min','sortBy','groupBy',
    'shuffle','toArray','size','first','head','take','initial','rest','tail',
    'drop','last','without','indexOf','lastIndexOf','isEmpty','chain',
    'difference','sample','partition','countBy','indexBy', 'where',
    'findWhere'];

  functionsToProxy.forEach(function(funcName){
    OneToMany.prototype[funcName] = function(){
      var params = [this._items].concat(_.toArray(arguments));
      return _[funcName].apply(this, params);
    }
  });

  return OneToMany;
});
