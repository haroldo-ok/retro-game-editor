define(["jquery", "underscore", "view/dock/modal", "model/project",
  "util/error-tracker",
  "bootstrap-fileinput",
  "css!/bower_components/bootstrap-fileinput/css/fileinput.min.css"],
function($, _, Modal, Project, trackError){
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
      function showError(e) {
        console.error(e);
        trackError(e);
        alert("Error while importing project:\n" + e);
      }

      try {
        var file = this.$el.find('input[type="file"]').prop('files')[0];
        var reader = new FileReader();
        reader.onload = function(ev){
          try {
            var text = ev.target.result;
            new Project().importJSON(text);
          } catch (e) {
            showError(e);
          }
        };
        reader.readAsText(file);
      } catch (e) {
        showError(e);
      }
    }
  });
});
