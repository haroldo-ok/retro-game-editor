'use strict';

define(["jquery", "backbone", "hbars!./modal.hbs"],
function($, Backbone, template){
  return Backbone.View.extend({
    className: 'modal fade',

    title: 'Modal thingy',

    buttons: {
      'example': 'Example button'
    },

    initialize: function(options) {
      this.render();
    },

    render: function() {
      this.$el.attr({
        tabIndex: -1,
        role: 'dialog',
        'aria-hidden': true
      });
      this.$el.html(template(this));
      this.$el.find('.modal-body').empty().append(this.renderContent);
    },

    renderContent: function() {
      return "Your content here...";
    },

    show: function() {
      if (!$.contains(document, this.$el)) {
        $('body').append(this.$el);
      }
      this.$el.modal('show');
    }
  });
});
