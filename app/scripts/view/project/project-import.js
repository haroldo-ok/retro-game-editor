define(["jquery", "underscore", "view/dock/modal",
  "bootstrap-fileinput",
  "css!/bower_components/bootstrap-fileinput/css/fileinput.min.css"],
function($, _, Modal){
  return Modal.extend({
    title: 'Import project',

    buttons: {
      'import': 'Import'
    },

    events: {
      'click .btn-import': 'import'
    },

    renderContent: function() {
      _.bindAll(this, 'import');

      return $('<input type="file" class="file" accept="application/json"' +
          'data-show-upload="false" data-show-preview="false">');
    },

    show: function() {
      Modal.prototype.show.apply(this, arguments);
      this.$el.find('input[type="file"]').fileinput();
    },

    import: function() {
      alert('TODO: Implement actual importing');
    }
  });
});
