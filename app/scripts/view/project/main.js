'use strict';

define(["jquery", "backbone", "handlebars", "model/project",
  "view/dock/main", "model",
  "hbars!./project-tree.hbs", "hbars!./project-menubar.hbs",
  "text!./resource-menu.hbs",
  "jstree", "view/dock/main", "view/util/main", "metisMenu",
  "css!/bower_components/bootstrap/dist/css/bootstrap.css",
  "css!/bower_components/jstree/dist/themes/default/style.min.css",
  "css!/bower_components/metisMenu/dist/metisMenu.css",
  "css!./bootstrap-multilevel-menu.css",
  "css!./bootstrap-dropdown-hover.css",
  "css!./menu.css",
  "domReady!"],
function($, BackBone, Handlebars, Project, dock, model,
  template, menubarTemplate, resourceMenuTemplate){

  Handlebars.registerPartial('resourceMenu', resourceMenuTemplate);

  var ProjectTree = Backbone.View.extend({

    className: "project-tree-container",

    events: {
      'click .new-project': 'newProject',
      'click .resource-link': 'editResource',
      'click .rename-resource': 'renameResource',
      'click .delete-resource': 'deleteResource'
    },

    initialize: function() {
      _.bindAll(this, "render", "newProject", "editResource", "renameResource", "deleteResource");

      Project.objects.fetchAll()
        .then(this.render)
        .done();

      Project.objects.on('add', this.render, this);
      Project.objects.on('change:name', this.render, this);
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
    },

    getSelectedResorce: function(clickedElement) {
      var $link = $(clickedElement).closest('.resource')
          .find('.resource-link, .project-link');

      var entityName = $link.data('rgeEntity');
      var entityId = $link.data('rgeId');

      var Model = model.byName(entityName);
      var entity = Model.objects.get(entityId);

      return entity;
    },

    renameResource: function(ev) {
      var resource = this.getSelectedResorce(ev.target);

      var name = prompt(
        resource.entityName + ' name?',
        resource.get('name') || '');

      if (name) {
        resource.save({name: name});
      }
    },

    deleteResource: function(ev) {

    }
  });

  $("#solution-window").html("").append(new ProjectTree().$el);

});
