define(["iframe!./bitz80/bitz80-frame.html"],
function(iframe, smsAsm, dataAsm, commonAsm){
  var ASM = iframe.contentWindow.ASM;

  return function(code){
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
