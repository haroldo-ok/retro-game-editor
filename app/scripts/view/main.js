define(["jquery", "dockspawn", "html!./main",
    "css!/bower_components/dock-spawn/js/out/css/dock-manager",
    "css!/bower_components/dock-spawn/js/out/css/font-awesome"], 
    function($, dockspawn, template){
      $('body').append(template);
    });
