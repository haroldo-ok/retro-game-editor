function eid(sId) {
	return document.getElementById(sId);
}

var agt = navigator.userAgent.toLowerCase();
var is_ie = (agt.indexOf("msie") != -1);
var localAccess = (document.location.href.substring(0,4).toLowerCase() == 'file');

function getOffsetLeft(el) {
	var ret = 0;
	do {
		ret += el.offsetLeft;
	} while (el = el.offsetParent);
	return ret;
}

function getOffsetTop(el) {
	var ret = 0;
	do {
		ret += el.offsetTop;
	} while (el = el.offsetParent);
	return ret;
}

function scanLeft(txt, pos, delims, inclusive) {
	while (pos > 0) {
		var c = txt.charAt(pos);
		if (delims.indexOf(c) >= 0)
			return (inclusive) ? pos : pos + 1;
		pos--;
	}
	return 0;
}

function scanRight(txt, pos, delims, inclusive) {
	var len = txt.length;
	while (pos < len) {
		var c = txt.charAt(pos);
		if (delims.indexOf(c) >= 0)
			return (inclusive) ? pos : pos - 1;
		pos++;
	}
	return len - 1;
}


//--- Selection

function Sel() {}

Sel.setRange = function(input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	}
	else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
}

Sel.getRange = function(input) {
	if (input.setSelectionRange) {
		return { 'start': input.selectionStart, 'end': input.selectionEnd };
	}
	else 
	if (document.selection) {
		var oRange = document.selection.createRange();
		var oTextRange = oElement.createTextRange();
		oTextRange.setEndPoint('EndToStart', oRange);
		return { 'start': oTextRange.text.length, 'end': (this.start + oRange.text.length) };
	}		
}

Sel.getText = function(input, sel) {
	sel = sel || Sel.getRange(input);
	return input.value.slice(sel.start, sel.end);
}

Sel.replace = function(input, replaceString) {
	if (input.setSelectionRange) {
		var selectionStart = input.selectionStart;
		var selectionEnd = input.selectionEnd;
		input.value = input.value.substring(0, selectionStart)+ replaceString + input.value.substring(selectionEnd);
	
		if (selectionStart != selectionEnd) { 
			Sel.setRange(input, selectionStart, selectionStart + replaceString.length);
		} else {
			Sel.setRange(input, selectionStart + replaceString.length, selectionStart + replaceString.length);
		}
	} else 
	if (document.selection) {
		var range = document.selection.createRange();
		
		if (range.parentElement() == input) {
			var isCollapsed = range.text == '';
			range.text = replaceString;
		
			if (!isCollapsed) {
				range.moveStart('character', -replaceString.length);
				range.select();
			}
		}
	}
}
