'use strict';

define(["jquery", "dockspawn", "backbone", "underscore"],
function($, dockspawn, Backbone, _){

  function ViewContainer(view, dockManager, title) {
    this.view = view;
    dockspawn.PanelContainer.call(this, view.$el[0], dockManager, title);
  }

  ViewContainer.prototype = Object.create(dockspawn.PanelContainer.prototype);
  ViewContainer.prototype.constructor = ViewContainer;

  function injectEvent(methodName, eventName) {
    var original = ViewContainer.prototype[methodName];
    function eventWrapper(){
      var args = _.toArray(arguments);
      this.view.trigger.apply(this.view, ['before' + eventName].concat(args));
      original.apply(this, arguments);
      this.view.trigger.apply(this.view, [eventName].concat(args));
    }
    ViewContainer.prototype[methodName] = eventWrapper;
  }

  injectEvent('onCloseButtonClicked', 'close');
  injectEvent('destroy', 'destroy');

  return ViewContainer;

});
