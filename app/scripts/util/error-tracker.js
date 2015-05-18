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

  window.addEventListener('error', trackError);

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
