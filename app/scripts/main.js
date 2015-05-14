'use strict';

require.config({
  shim: {
    backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    underscore: {
        exports: '_'
    }
  },
  paths: {
    jquery: '../../bower_components/jquery/dist/jquery',
    requirejs: '../../bower_components/requirejs/require',
    backbone: '../../bower_components/backbone/backbone',
    underscore: '../../bower_components/underscore/underscore',
    localforage: '../../bower_components/localforage/dist/localforage',
    'localforage-backbone': '../../bower_components/localforage-backbone/dist/localforage.backbone.min',
    'requirejs-text': '../../bower_components/requirejs-text/text',
    'requirejs-html': '../../bower_components/requirejs-html/html',
    css: '../../bower_components/require-css/css',
    'css-builder': '../../bower_components/require-css/css-builder',
    normalize: '../../bower_components/require-css/normalize',
    'requirejs-domready': '../../bower_components/requirejs-domready/domReady',
    q: '../../bower_components/q/q',
    jstree: '../../bower_components/jstree/dist/jstree',
    'requirejs-handlebars': '../../bower_components/requirejs-handlebars/hb',
    handlebars: '../../bower_components/handlebars/handlebars',
    'font-awesome': '../../bower_components/font-awesome/fonts/*',
    bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap'
  },
  packages: [
    'model',
    'view'
  ],
  map: {
    '*': {
      text: 'requirejs-text',
      html: 'requirejs-html',
      hbars: 'requirejs-handlebars',
      domReady: 'requirejs-domready'
    }
  }
});

require(["jquery", "model/project", "view"], function($, Project) {
  $("#main-loading-animation").fadeOut();
  console.log('Loaded.');
});
