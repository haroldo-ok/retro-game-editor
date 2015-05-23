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
        this._internalEditors = {};
      }

      Dock.prototype.createEditor = function(content) {
        var view = prepareView(content);
        return tabPanel.createTab(view);
      }

      Dock.prototype.createInternalEditor = function(url) {
        var tab = this._internalEditors[url];
        if (tab) {
          tab.show();
        } else {
          var tab = this.createEditor(
            '<iframe src="' + url + '" ' +
                'style="width: 100%; height: 100%; border: 0">');
          this._internalEditors[url] = tab;          
        }
      }

      return new Dock();

    });
