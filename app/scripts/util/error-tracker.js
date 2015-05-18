define(["GA"], function(GA){
  function trackError(e) {
    try {
      GA.event(
        'Javascript Error',
        e.message,
        e.filename + ': ' + e.lineno,
        1, e
      );
    } catch (e) {
      console.error(e);
    }
  }

  trackError.listenTo = function(element) {
    element.addEventListener('error', trackError);
  }
  trackError.listenTo(window);

  require(["jquery"], function($){
    $(document).ajaxError(function(e, request, settings) {
        GA.event(
          'Ajax Error',
          settings.url,
          e.result,
          1, e
        );
    });
  });

  return trackError;
});
