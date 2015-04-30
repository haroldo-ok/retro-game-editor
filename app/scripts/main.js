require.config({
  shim: {
    dockspawn: {
      exports: 'dockspawn'
    }
  },
  paths: {
    jquery: '../../bower_components/jquery/dist/jquery',
    requirejs: '../../bower_components/requirejs/require',
    backbone: '../../bower_components/backbone/backbone',
    underscore: '../../bower_components/underscore/underscore',
    localforage: '../../bower_components/localforage/dist/localforage',
    'localforage-backbone': '../../bower_components/localforage-backbone/dist/localforage.backbone.min',
    dockspawn: '../../bower_components/dock-spawn/js/out/js/dockspawn',
    'requirejs-text': '../../bower_components/requirejs-text/text',
    'requirejs-html': '../../bower_components/requirejs-html/html',
    css: '../../bower_components/require-css/css',
    'css-builder': '../../bower_components/require-css/css-builder',
    normalize: '../../bower_components/require-css/normalize'
  },
  packages: [
    'model',
    'view'
  ],
  map: {
    '*': {
      text: 'requirejs-text',
      html: 'requirejs-html'
    }
  }
});

require(["jquery", "model/project", "view"], function($, Project) {
  window.Project = Project;
});
