define(["./asm", "underscore", "file-saver", "jszip",
  "text!./sms.asm", "text!./data.asm", "text!./common.asm"],
function(asm, _, saveAs, JSZip,
    smsAsm, dataAsm, commonAsm){
  var code = [smsAsm, commonAsm, dataAsm].join('\n');

  function arrayAsBinary(array) {
    return new Blob([array], {type: "application/octet-stream"});
  }

  return function(){
    var assembled = asm(code);

    var binary = new Uint8Array(assembled.code);

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

      saveBinary: function(name) {
        saveAs(arrayAsBinary(this.binary), name || 'out.sms');
      },

      saveSymbols: function(name) {
        saveAs(new Blob([this.sym]), name || 'out.sym');
      },

      saveZip: function(name) {
        var zip = new JSZip();
        zip.file('out.asm', this.source);
        zip.file('out.sms', this.binary);
        zip.file('out.sym', this.sym);

        content = zip.generate({type: "uint8array"});
        saveAs(arrayAsBinary(content) , name || 'out.zip');
      }
    };
  };
});
