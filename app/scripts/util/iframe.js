// RequireJS IFRAME loader plugin
define({
    load: function (name, req, onload, config) {
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      iframe.onload = function(){
        onload(iframe);
      }
      iframe.src = req.toUrl(name);
    }
});
