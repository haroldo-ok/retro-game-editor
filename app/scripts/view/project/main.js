define(["jquery", "hbars!./project-tree.hbs",
  "jstree", "view/dock/main",
  "css!/bower_components/jstree/dist/themes/default/style.min.css",
  "domReady!"],
  function($, template){
    console.warn(template);
    $("#solution_window").jstree();
  });
