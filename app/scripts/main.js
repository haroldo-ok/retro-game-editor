require.config({
  shim: {

  },
  paths: {
    jquery: "../../bower_components/jquery/dist/jquery",
    requirejs: "../../bower_components/requirejs/require",
    backbone: "../../bower_components/backbone/backbone",
    underscore: "../../bower_components/underscore/underscore"
  },
  packages: [

  ]
});

require(["jquery", "backbone", "underscore"], function($, Backbone, _) {
});
