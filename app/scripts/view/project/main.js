'use strict';

define(["jquery", "backbone", "model/project",
  "hbars!./project-tree.hbs", "hbars!./project-menubar.hbs",
  "jstree", "view/dock/main", "view/util/main", "flexnav",
  "css!/bower_components/jstree/dist/themes/default/style.min.css",
  "css!/bower_components/flexnav/css/flexnav.css",
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
        .find('.project-tree')
          .jstree()
          .end()
        .find('.project-menubar ul')
          .flexNav({hover: true})
          .end();
    }
  });

  $("#solution_window").html("").append(new ProjectTree().$el);

});
