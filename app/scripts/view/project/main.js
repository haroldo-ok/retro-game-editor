'use strict';

define(["jquery", "backbone", "hbars!./project-tree.hbs", "model/project",
  "jstree", "view/dock/main", "view/util/main",
  "css!/bower_components/jstree/dist/themes/default/style.min.css",
  "domReady!"],
  function($, BackBone, template, Project){
    console.warn(template);

    var ProjectTree = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this, "render");

        Project.objects.fetchAll()
          .then(this.render)
          .done();
      },

      render: function() {
        this.$el.html(template({projects: Project.objects.toJSON()}))
          .find('.project-tree').jstree();
      }
    });

    $("#solution_window").html("").append(new ProjectTree().$el);

  });
