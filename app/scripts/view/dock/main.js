'use strict';

define(["jquery", "./static-view", "./tab-panel",
    "html!./dock", "css!./dock",
    "css!/bower_components/font-awesome/css/font-awesome",
    "css!/bower_components/github-fork-ribbon-css/gh-fork-ribbon",
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
      }

      Dock.prototype.createInternalEditor = function(url) {
        this.createEditor(
          '<iframe src="' + url + '" ' +
              'style="width: 100%; height: 100%; border: 0">');
      }

      return new Dock();

    });
