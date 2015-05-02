'use strict';

define(["jquery", "dockspawn", "html!./dock", "css!./dock",
    "css!/bower_components/dock-spawn/js/out/css/dock-manager",
    "css!/bower_components/dock-spawn/js/out/css/font-awesome",
    "domReady!"],
    function($, dockspawn, template){
      $('body').append(template);

      // Convert a div to the dock manager.  Panels can then be docked on to it
      var divDockManager = document.getElementById("my_dock_manager");
      var dockManager = new dockspawn.DockManager(divDockManager);
      dockManager.initialize();
      // Let the dock manager element fill in the entire screen
      var onResized = function(e)
      {
          dockManager.resize(window.innerWidth - (divDockManager.clientLeft + divDockManager.offsetLeft), window.innerHeight - (divDockManager.clientTop + divDockManager.offsetTop));
      }
      $(window).resize(onResized);
      onResized(null);

      // Convert existing elements on the page into "Panels".
      // They can then be docked on to the dock manager
      // Panels get a titlebar and a close button, and can also be
      // converted to a floating dialog box which can be dragged / resized
      var solution = new dockspawn.PanelContainer(document.getElementById("solution_window"), dockManager);
      var properties = new dockspawn.PanelContainer(document.getElementById("properties_window"), dockManager);
      var toolbox = new dockspawn.PanelContainer(document.getElementById("toolbox_window"), dockManager);
      var outline = new dockspawn.PanelContainer(document.getElementById("outline_window"), dockManager);
      var problems = new dockspawn.PanelContainer(document.getElementById("problems_window"), dockManager);
      var output = new dockspawn.PanelContainer(document.getElementById("output_window"), dockManager);
      var editor1 = new dockspawn.PanelContainer(document.getElementById("editor1_window"), dockManager);
      var editor2 = new dockspawn.PanelContainer(document.getElementById("editor2_window"), dockManager);
      var infovis = new dockspawn.PanelContainer(document.getElementById("infovis"), dockManager);

      // Dock the panels on the dock manager
      var documentNode = dockManager.context.model.documentManagerNode;
      var outlineNode = dockManager.dockLeft(documentNode, outline, 0.15);
      var solutionNode = dockManager.dockFill(outlineNode, solution);
      var propertiesNode = dockManager.dockDown(outlineNode, properties, 0.6);
      var outputNode = dockManager.dockDown(documentNode, output, 0.2);
      var problemsNode = dockManager.dockRight(outputNode, problems, 0.40);
      var toolboxNode = dockManager.dockRight(documentNode, toolbox, 0.20);
      var editor1Node = dockManager.dockFill(documentNode, editor1);
      var editor2Node = dockManager.dockFill(documentNode, editor2);
      var infovisNode = dockManager.dockFill(documentNode, infovis);
    });
