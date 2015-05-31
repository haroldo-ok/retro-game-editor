'use strict';

define(["jquery", "underscore", "backbone", "handlebars", "model/project",
  "view/dock/main", "model", "assembler/main",
  "hbars!./project-tree.hbs", "hbars!./project-menubar.hbs",
  "text!./resource-menu.hbs",
  "jstree", "view/dock/main", "view/util/main",
  "css!/bower_components/bootstrap/dist/css/bootstrap.css",
  "css!/bower_components/jstree/dist/themes/default/style.min.css",
  "css!./bootstrap-multilevel-menu.css",
  "css!./bootstrap-dropdown-hover.css",
  "css!./menu.css",
  "domReady!"],
function($, _, BackBone, Handlebars, Project, dock, model, assembler,
  template, menubarTemplate, resourceMenuTemplate){

  Handlebars.registerPartial('resourceMenu', resourceMenuTemplate);
  Handlebars.registerHelper('resourceMenuOptions', function(entityName){
    var options = [
      { action: 'rename', icon: 'edit', label: 'Rename...' },
      { action: 'delete', icon: 'trash', label: 'Delete...' },
      { action: 'export', icon: 'save', label: 'Export...' }
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

  var editors = {
    TileSet: "internal-apps/tinysprite/tinysprite.html",
    Map: "internal-apps/tiny-map-editor/index.html"
  }

  var ProjectTree = Backbone.View.extend({

    className: "project-tree-container",

    events: {
      'click .new-project': 'newProject',
      'click .resource-link': 'editResource',
      'click .new-resource': 'newResource',
      'click .rename-resource': 'renameResource',
      'click .delete-resource': 'deleteResource',
      'click .export-resource': 'exportResource',
      'click .compile-project': 'compileProject',
      'click .run-project': 'runProject',
    },

    initialize: function() {
      _.bindAll(this, "render", "newProject", "compileProject",
        "newResource", "editResource", "renameResource", "deleteResource",
        "exportResource");

      this.requestRender = _.debounce(this.render, 300);

      Project.objects.fetchAll()
        .then(this.render)
        .done();

      var that = this;
      ['add', 'destroy', 'change:name',
        'add-detail', 'change-detail', 'destroy-detail']
        .forEach(function(evName){
          Project.objects.on(evName, that.requestRender, that);
        });
    },

    render: function() {
      try {
        var lastExpandedId = this.$el.find('.collapse.in').first().attr('id');

        this.$el
          .html(
            menubarTemplate({}) +
            template({projects: Project.objects.fullJSON()})
          );

        // Expands whatever was expanded last, if any; otherwise, expands the first item.
        var $toExpand = this.$el.find('#' + lastExpandedId);
        if (!$toExpand.length) {
          $toExpand = this.$el.find('.collapse').first();
        }
        $toExpand.collapse('show');
      } catch (e) {
        console.error(e);
        throw new Error('Problems while rendering the project pane: ' + e);
      }
    },

    newProject: function() {
      new Project({name: prompt('Project name?')}).save();
      this.requestRender();
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

      this.requestRender();
    },

    editResource: function(ev) {
      var $target = $(ev.target);

      var entityName = $target.data('rgeEntity'),
          entityId = $target.data('rgeId'),
          src = editors[entityName] +
              '?entity=' + entityName +
              '&entityId=' + entityId;

      dock.createInternalEditor(src);
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
    },

    exportResource: function(ev) {
      var resource = this.getSelectedResorce(ev.target);
      var json = resource.fullJSON ? resource.fullJSON() : resource.toJSON();
      var jsonString = JSON.stringify(json, null, '\t');
      console.log(json);

      require(["file-saver"], function(saveAs){
        // TODO: Move this replace to an utility function
        var prefix = resource && resource.get('name') || '';
        prefix = prefix.replace(/[|&;$%@"<>()+,]/g, "") || 'exported';

        var fileName = prefix + '.'
            + resource.entityName.toLowerCase() + '.json';

        saveAs(new Blob([jsonString]), fileName);
      });
    },

    compileProject: function(ev) {
      var projectId = $('.project-link:not(.collapsed):first').data('rgeId');
      var project = Project.objects.get(projectId);
      assembler(project).saveZip();
    },

    runProject: function(ev) {
      var projectId = $('.project-link:not(.collapsed):first').data('rgeId');

      var entityName = 'Project',
          entityId = projectId,
          src = 'internal-apps/js-sms/index.html' +
              '?entity=' + entityName +
              '&entityId=' + entityId;

      dock.createInternalEditor(src);
    }
  });

  $("#solution-window").html("").append(new ProjectTree().$el);

});
