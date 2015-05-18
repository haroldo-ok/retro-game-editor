define(["./asm", "underscore", "file-saver", "jszip",
  "./tileset",
  "text!./sms.asm", "text!./data.asm", "text!./common.asm"],
function(asm, _, saveAs, JSZip,
    tileSetConverter,
    smsAsm, dataAsm, commonAsm){

  function arrayAsBinary(array) {
    return new Blob([array], {type: "application/octet-stream"});
  }

  return function(project){
    var prefix = project && project.get('name') || '';
    prefix = prefix.replace(/[|&;$%@"<>()+,]/g, "") || 'out';

    var code = [
      smsAsm, commonAsm, dataAsm,
      tileSetConverter(project)
    ].join('\n');

    var assembled = asm(code);
    var binary = new Uint8Array(assembled.code);

    var symbols = _.pairs(assembled.labels).map(function(pair){
      var addr = pair[1].toString(16);
      while (addr.length < 4) {
        addr = '0' + addr;
      }
      return '0000:' + addr + ' ' + pair[0];
    }).join('\n');

    function fname(ext) {
      return prefix + '.' + ext;
    }

    return {
      source: code,
      binary: binary,
      sym: symbols,

      saveBinary: function(name) {
        saveAs(arrayAsBinary(this.binary), name || fname('sms'));
      },

      saveSymbols: function(name) {
        saveAs(new Blob([this.sym]), name || fname('sym'));
      },

      saveZip: function(name) {
        var zip = new JSZip();
        zip.file(fname('asm'), this.source);
        zip.file(fname('sms'), this.binary);
        zip.file(fname('sym'), this.sym);

        content = zip.generate({type: "uint8array"});
        saveAs(arrayAsBinary(content) , name || fname('zip'));
      }
    };
  };
});
