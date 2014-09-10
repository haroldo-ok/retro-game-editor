var oLogDiv = null;
var iLogCount = 0;

function log(sText) {
	if (!oLogDiv) {
		var bExpanded = false;
		oLogDiv = document.createElement('div');
		oLogDiv.style.position = 'absolute';
		oLogDiv.style.top = 0;
		oLogDiv.style.left = 0;
		oLogDiv.style.width = 24;
		oLogDiv.style.height = 24;
		oLogDiv.style.padding = '2px';
		oLogDiv.style.background = 'red';
		oLogDiv.style.color = 'white';		
		oLogDiv.style.border = 'dotted 1px white';
		oLogDiv.style.zIndex = 1000;
		document.body.appendChild(oLogDiv);		
		oLogDiv.innerHTML =
			'<div><span style="font-size:11px"></span><button style="margin-left:10px;font-size:11px;border:none;display:none">clear</button></div>' +
			'<div style="font-size:10px;display:none;color:black;background:white;overflow:auto;width:470px;height:490px;margin:5px"></div>';
		oLogDiv.firstChild.firstChild.style.cursor = 'pointer';
		oLogDiv.firstChild.onclick = function() {
			bExpanded = !bExpanded;
			oLogDiv.style.width = (bExpanded) ? 480 : 24;
			oLogDiv.style.height = (bExpanded) ? 520 : 24;
			oLogDiv.firstChild.nextSibling.style.display = (bExpanded) ? 'block' : 'none';
			oLogDiv.firstChild.firstChild.nextSibling.style.display = (bExpanded) ? '' : 'none';
			oLogDiv.style.background = 'green';
			if (oLogDiv.firstChild.nextSibling.lastChild)
				oLogDiv.firstChild.nextSibling.lastChild.scrollIntoView(false);
		};
		oLogDiv.firstChild.firstChild.nextSibling.onclick = function() {
			iLogCount = 0;
			oLogDiv.firstChild.firstChild.innerHTML = iLogCount;
			oLogDiv.firstChild.nextSibling.innerHTML = '';
		};
	}
	++iLogCount;
	oLogDiv.firstChild.firstChild.innerHTML = iLogCount;
	var logEntry = document.createElement('pre');
	logEntry.style.padding = 0;
	logEntry.style.margin = 0;
	logEntry.innerHTML = ('' + sText).replace(/\</, '&lt;');
	oLogDiv.firstChild.nextSibling.appendChild(logEntry);
	oLogDiv.style.background = 'red';
}

function dump(a, sep) {
	sep = (sep == null) ? ', ' : sep;
	var r = [];
	if (a.length >= 0)
	for (var k = 0; k < a.length; k++) {
		var v = a[k];
		if (typeof v == 'object')
			v = "{" + dump(v) + "}";
		r.push(v);
	}
	else
	for (var k in a) {
		var v = a[k];
		if (typeof v == 'object')
			v = dump(v);
		r.push(k + ": " + v);
	}
	return r.join(sep);
}

function dumpElement(oEl, sep) {
	sep = (sep == null) ? ',' : sep;
	var aRes = [];
	for (var sKey in oEl) {
		try {
			var mValue = oEl[sKey];
			if (typeof mValue != "function")
				aRes.push(sKey + ": " + mValue);
		} catch(e) {}
	}
	return aRes.join(sep);
}
