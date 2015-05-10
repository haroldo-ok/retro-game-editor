'use strict';

define(["jquery", "backbone", "model/project", "view/dock/main",
  "hbars!./project-tree.hbs", "hbars!./project-menubar.hbs",
  "jstree", "view/dock/main", "view/util/main", "metisMenu",
  "css!/bower_components/bootstrap/dist/css/bootstrap.css",
  "css!/bower_components/jstree/dist/themes/default/style.min.css",
  "css!/bower_components/metisMenu/dist/metisMenu.css",
  "css!./bootstrap-multilevel-menu.css",
  "css!./bootstrap-dropdown-hover.css",
  "css!./menu.css",
  "domReady!"],
function($, BackBone, Project, dock, template, menubarTemplate){

  var ProjectTree = Backbone.View.extend({

    className: "project-tree-container",

    events: {
      'click .new-project': 'newProject',
      'click .resource-link': 'editResource'
    },

    initialize: function() {
      _.bindAll(this, "render", "newProject", "editResource");

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
    },

    editResource: function(ev) {
      var $target = $(ev.target);

      dock.createEditor(
        '<iframe src="internal-apps/tinysprite/tinysprite.html' +
        '?entity=' + $target.data('rgeEntity') +
        '&entityId=' + $target.data('rgeId') +
        '" style="width: 100%; height: 100%; border: 0">');
    }
  });

  $("#solution-window").html("").append(new ProjectTree().$el);

});
