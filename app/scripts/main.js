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
    "model"
  ]
});

require(["jquery", "model/project"], function($, Project) {
  window.Project = Project;
});
