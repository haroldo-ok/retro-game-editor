require.config({
  shim: {

  },
  paths: {
    jquery: "../../bower_components/jquery/dist/jquery",
    requirejs: "../../bower_components/requirejs/require",
    backbone: "../../bower_components/backbone/backbone",
    underscore: "../../bower_components/underscore/underscore",
    localforage: "../../bower_components/localforage/dist/localforage",
    "localforage-backbone": "../../bower_components/localforage-backbone/dist/localforage.backbone.min"
  },
  packages: [

  ]
});

require(["jquery", "backbone", "underscore", "localforage", "localforage-backbone"], function($, Backbone, _) {
  // Just for a quick-and-dirty test. TODO: Remove this.
  window.MyModel = Backbone.Model.extend({
      sync: Backbone.localforage.sync('MyModel')
  });

  window.MyCollection = Backbone.Collection.extend({
      model: MyModel,
      sync: Backbone.localforage.sync('MyCollection')
  });
});
