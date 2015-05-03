'use strict';

define(["jquery", "backbone", "model/project",
  "hbars!./project-tree.hbs", "hbars!./project-menubar.hbs",
  "jstree", "view/dock/main", "view/util/main",
  "css!/bower_components/jstree/dist/themes/default/style.min.css",
  "domReady!"],
function($, BackBone, Project, template, menubarTemplate){

  var ProjectTree = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "render");

      Project.objects.fetchAll()
        .then(this.render)
        .done();
    },

    render: function() {
      this.$el
        .html(
          menubarTemplate({}) +
          template({projects: Project.objects.fullJSON()})
        )
        .find('.project-tree').jstree();
    }
  });

  $("#solution_window").html("").append(new ProjectTree().$el);

});
