define(["handlebars"], function(Handlebars){
  Handlebars.registerHelper('default', function (value, _default) {
    return value || _default;
  });
});
