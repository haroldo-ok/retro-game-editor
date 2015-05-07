'use strict';

define(["jquery", "./static-view", "./tab-panel",
    "html!./dock", "css!./dock",
    "css!/bower_components/font-awesome/css/font-awesome",
    "domReady!"],
    function($, StaticView, TabPanel, template){
      $('body').append(template);

      var tabPanel = new TabPanel();
      $('#editor-window').html('').append(tabPanel.$el);

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
        tabPanel.createTab(view);
//        $('#editor-window').html('').append(view.$el);
      }

      return new Dock();

    });
