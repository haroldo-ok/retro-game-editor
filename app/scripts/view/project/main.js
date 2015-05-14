'use strict';

define(["jquery", "backbone", "handlebars", "model/project",
  "view/dock/main", "model",
  "hbars!./project-tree.hbs", "hbars!./project-menubar.hbs",
  "text!./resource-menu.hbs",
  "jstree", "view/dock/main", "view/util/main",
  "css!/bower_components/bootstrap/dist/css/bootstrap.css",
  "css!/bower_components/jstree/dist/themes/default/style.min.css",
  "css!./bootstrap-multilevel-menu.css",
  "css!./bootstrap-dropdown-hover.css",
  "css!./menu.css",
  "domReady!"],
function($, BackBone, Handlebars, Project, dock, model,
  template, menubarTemplate, resourceMenuTemplate){

  Handlebars.registerPartial('resourceMenu', resourceMenuTemplate);
  Handlebars.registerHelper('resourceMenuOptions', function(entityName){
    var options = [
      { action: 'rename', icon: 'edit', label: 'Rename...' },
      { action: 'delete', icon: 'trash', label: 'Delete...' }
    ];

    if (entityName == 'Project') {
      options = options.concat([
        {
          action: 'new',
          icon: 'image',
          label: 'New tileset...',
          entityName: 'TileSet'
        },
        {
          action: 'new',
          icon: 'cubes',
          label: 'New map...',
          entityName: 'Map'
        }
      ]);
    }

    return options;
  });

  var ProjectTree = Backbone.View.extend({

    className: "project-tree-container",

    events: {
      'click .new-project': 'newProject',
      'click .resource-link': 'editResource',
      'click .new-resource': 'newResource',
      'click .rename-resource': 'renameResource',
      'click .delete-resource': 'deleteResource'
    },

    initialize: function() {
      _.bindAll(this, "render", "newProject",
        "newResource", "editResource", "renameResource", "deleteResource");

      Project.objects.fetchAll()
        .then(this.render)
        .done();

      var that = this;
      ['add', 'destroy', 'change:name',
        'add-detail', 'change-detail', 'destroy-detail']
        .forEach(function(evName){
          Project.objects.on(evName, that.render, that);
        });
    },

    render: function() {
      try {
        this.$el
          .html(
            menubarTemplate({}) +
            template({projects: Project.objects.fullJSON()})
          );
      } catch (e) {
        console.error(e);
        throw new Error('Problems while rendering the project pane: ' + e);
      }
    },

    newProject: function() {
      new Project({name: prompt('Project name?')}).save();
    },

    newResource: function(ev) {
      var $target = $(ev.target).closest('a');
      var $projectLink = $target.closest('.resource').find('> [data-rge-entity="Project"]');

      var resourceEntityName = $target.data('rgeEntity');
      var parentProjectId = $projectLink.data('rgeId');

      var name = prompt('Name of the new ' + resourceEntityName + '?');
      if (!name) {
        return;
      }

      var Model = model.byName(resourceEntityName);
      var resource = new Model({name: name});

      var project = Project.objects.get(parentProjectId);
      project.resources.add(resource);
      resource.save();
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

      // TODO: Use a prettier prompt.
      var name = prompt(
        resource.entityName + ' name?',
        resource.get('name') || '');

      if (name) {
        resource.save({name: name});
      }
    },

    deleteResource: function(ev) {
      var resource = this.getSelectedResorce(ev.target);

      // TODO: Use a prettier prompt.
      var confirmed = confirm(
        'Do you want to delete the ' + resource.entityName + ' named ' +
        (resource.get('name') || '*unnamed*') + '?');

      if (confirmed) {
        resource.destroy();
      }
    }
  });

  $("#solution-window").html("").append(new ProjectTree().$el);

});
