'use strict';

define(["jquery", "backbone", "underscore",
  "html!./tab-panel", "hbars!./tab-panel-tab.hbs",
  "bootstrap"],
function($, Backbone, _, template, tabTemplate){

  var nextId = 1;

  var TabPanel = Backbone.View.extend({
    className: 'tabpanel',
    tabs: [],

    events: {
      'click .close-tab': 'closeTab'
    },

    initialize: function(options) {
      _.bindAll(this, 'closeTab');

      this.render();
    },

    render: function() {
      this.$el.html(template);
      this.$nav = this.$el.find("> .nav-tabs");
      this.$content = this.$el.find("> .tab-content");

      var that = this;
      this.tabs.forEach(function(tab){
        tab.render();
        that.$nav.append(tab.$nav);
        that.$content.append(tab.$el);
      });
    },

    createTab: function(view) {
      var tab = new TabPanel.Tab({
        tabPanel: this,
        view: view
      });
      this.tabs.push(tab);

      this.$nav.append(tab.$nav);
      this.$content.append(tab.$el);

      tab.show();

      return tab;
    },

    closeTab: function(ev) {
      var $tabNav = $(ev.target).closest('a'),
          href = $tabNav.attr('href');

      var tab = _.chain(this.tabs)
          .where({id: href.replace('#', '')})
          .first().value();

      if (tab) {
        ev.stopPropagation();
        tab.close();
        this.tabs = _.without(this.tabs, tab);
      }
    }

  });

  TabPanel.Tab = Backbone.View.extend({
    className: 'tab-pane',

    initialize: function(options) {
      this.tabPanel = options.tabPanel;
      this.view = options.view;
      this.id = 'tabpanel-tab-' + nextId++;
      this.render();
    },

    render: function() {
      this.$el.attr({
        id: this.id,
        role: 'tabpanel'
      })
      this.$el.html('').append(this.view.$el);

      this.$nav = $(tabTemplate(this));
    },

    show: function() {
      this.$nav.find('a').tab('show');
    },

    close: function() {
      this.$el.remove();
      this.$nav.remove();
      this.trigger('close', this);
    }
  });

  return TabPanel;

});
