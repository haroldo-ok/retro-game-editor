define(["./asm", "file-saver", "underscore",
  "text!./sms.asm", "text!./data.asm", "text!./common.asm"],
function(asm, saveAs, _,
    smsAsm, dataAsm, commonAsm){
  var code = [smsAsm, commonAsm, dataAsm].join('\n');

  return function(){
    var assembled = asm(code);

    var bytes = new Uint8Array(assembled.code)
    binary = new Blob([bytes], {type: "application/octet-stream"});

    var symbols = _.pairs(assembled.labels).map(function(pair){
      var addr = pair[1].toString(16);
      while (addr.length < 4) {
        addr = '0' + addr;
      }
      return '0000:' + addr + ' ' + pair[0];
    }).join('\n');

    return {
      source: code,
      binary: binary,
      sym: symbols,

      saveBinaryAs: function(name) {
        saveAs(this.binary, name || 'out.sms');
      },

      saveSymbolsAs: function(name) {
        saveAs(new Blob([this.sym]), name || 'out.sym');
      }
    };
  };
});
