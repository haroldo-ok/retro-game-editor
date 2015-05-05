'use strict';

define(["jquery", "backbone", "model/project",
  "hbars!./project-tree.hbs", "hbars!./project-menubar.hbs",
  "jstree", "view/dock/main", "view/util/main", "metisMenu",
  "css!/bower_components/bootstrap/dist/css/bootstrap.css",
  "css!/bower_components/jstree/dist/themes/default/style.min.css",
  "css!/bower_components/metisMenu/dist/metisMenu.css",
  "css!./menu.css",
  "domReady!"],
function($, BackBone, Project, template, menubarTemplate){

  var ProjectTree = Backbone.View.extend({

    className: "project-tree-container",

    events: {
      'click .new-project': 'newProject'
    },

    initialize: function() {
      _.bindAll(this, "render", "newProject");

      Project.objects.fetchAll()
        .then(this.render)
        .done();

      Project.objects.on('add', this.render, this);
    },

    render: function() {
      this.$el
        .html(
          menubarTemplate({}) +
          template({projects: Project.objects.fullJSON()})
        )
        .find('.project-tree > ul')
          .metisMenu()
          .end()
        .find('.project-menubar .popup-menu > ul')
          .end();
    },

    newProject: function() {
      new Project({name: prompt('Project name?')}).save();
    }
  });

  $("#solution-window").html("").append(new ProjectTree().$el);

});
