define(["iframe!./bitz80/bitz80-frame.html",
  "text!./sms.asm", "text!./data.asm", "text!./common.asm"],
function(iframe, smsAsm, dataAsm, commonAsm){
  var ASM = iframe.contentWindow.ASM;
  var code = [smsAsm, commonAsm, dataAsm].join('\n');

  return function(){
    var asm = new ASM();

    asm.start(code);
    asm.evaluateData();
    asm.patch();

    return {
      code: asm.aMem,
      labels: asm.aLabels
    }
  };
});
