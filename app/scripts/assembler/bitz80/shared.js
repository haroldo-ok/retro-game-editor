shared.bit = {};

/* TODO: scan structs */
shared.bit.scanLabels = function(sCode, aDestLabels, sFilePath) {
	var lines = sCode.split("\n");
	var acc = [];
	var pos = 0;
	for (var i=0; i<lines.length; i++) {
		var line = lines[i].replace(/^[ \t]+/, '');
		if (line[0] == ';') {
			acc.push(line);
			pos += lines[i].length + 1;
			continue;
		}
		var idx = line.indexOf(':');
		if (idx >=0) {
			var cmt = line.indexOf(';');
			if (cmt == -1 || cmt > idx) {
				var label = line.substr(0, idx).replace(/[ \t]+$/g, '');
				var desc = acc.join("\n");
				aDestLabels[label] = { pos: pos, line: i, desc: desc, path: sFilePath };
				acc.length = 0;
				pos += lines[i].length + 1;			
				continue;
			}
		}
		acc.length = 0;
		pos += lines[i].length + 1;
	}	
}
