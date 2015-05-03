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
        .find('.project-tree > ul')
          .metisMenu()
          .end()
        .find('.project-menubar ul')
          .end();
    }
  });

  $("#solution_window").html("").append(new ProjectTree().$el);

});
