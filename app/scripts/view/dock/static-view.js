'use strict';

define(["jquery", "backbone", "underscore"],
function($, Backbone, _){

  var StaticView = Backbone.View.extend({
    initialize: function(options) {
      this.html = options.html;
      this.render();
    },

    render: function() {
      this.$el.html(this.html);
    }
  });

  StaticView.from = function(content) {
    return new StaticView({html: content});
  }

  return StaticView;

});
