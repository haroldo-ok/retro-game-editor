define(["./asm",
  "text!./sms.asm", "text!./data.asm", "text!./common.asm"],
function(asm, smsAsm, dataAsm, commonAsm){
  var code = [smsAsm, commonAsm, dataAsm].join('\n');

  return function(){
    return asm(code);
  };
});
