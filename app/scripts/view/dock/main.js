'use strict';

define(["jquery", "./static-view",
    "html!./dock", "css!./dock",
    "css!/bower_components/dock-spawn/js/out/css/dock-manager",
    "css!/bower_components/dock-spawn/js/out/css/font-awesome",
    "css!/bower_components/font-awesome/css/font-awesome",
    "domReady!"],
    function($, StaticView, template){
      $('body').append(template);

      // ***** //

      function prepareView(content) {
        if (content && content.el && content.render) {
          // Assumes it's a Backbone.js view
          return content;
        } else {
          return new StaticView.from(content);
        }
      }

      // ***** //

      function Dock() {
      }

      Dock.prototype.createEditor = function(content) {
        var view = prepareView(content);
        $('#editor-window').html('').append(view.$el);
      }

      return new Dock();

    });
