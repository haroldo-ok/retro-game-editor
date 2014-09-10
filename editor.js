//---- Editor


function Editor(textarea) {
	this.el = textarea;
	this.timeout = null;
	this.last = null;
	this.oCursor = {x: 0, y: 0};
	this.onChangePosition = null; // function(x, y)
	this.onCheckKeyword = null; // function(line)
	this.onChange = null;
	this.onKeyUp = null; // function(char)
	this.onKeyDown = null; // function(char)	
	this.init();
	this.resetTimer();
}

Editor.prototype.postChange = function() {
	if (this.onChange) {
		if (this.last != this.el.value) {
			this.last = this.el.value;
			this.onChange();
		}
	}
}

Editor.prototype.init = function() {
	var editor = this;
	this.el.onclick = function() { editor.checkPosition(); }
	this.el.onkeyup = function(e) { editor.handleKeyUp(e); }	
	this.el.onkeydown = function(e) { editor.handleKeyDown(e); }
	if (!is_ie)
		this.el.oninput = function(e) { editor.checkPosition(e); editor.resetTimer(); }
	else
		this.el.onpaste = function(e) { editor.checkPosition(e); editor.resetTimer(); }
}

Editor.prototype.checkPosition = function() {
	if (this.onCheckKeyword) {
		var sel = Sel.getRange(this.el);
		var pos = sel.start;
		var txt = this.el.value;
		var from = scanLeft(txt, (pos == 0) ? 0 : pos-1, "\n");
		var to = scanRight(txt, pos, "\n;");
		var line = txt.substr(from, to-from + 1);
		this.onCheckKeyword(line);
	}
		
	// position indicator
	var txt = this.el.value.substr(0, sel.end);
	var lines = txt.split("\n");
	if (lines.length) {
		var last = lines[lines.length - 1];
		this.oCursor.x = last.length;
		this.oCursor.y = lines.length;
		(this.onChangePosition) && (this.onChangePosition(this.oCursor.x, this.oCursor.y));
	}	
}

Editor.prototype.resetTimer = function() {
	if (this.timeout)
		clearTimeout(this.timeout);
	var editor = this;
	this.timeout = setTimeout(function() { editor.postChange() }, 1000);
}

Editor.prototype.handleKeyUp = function(e) {
	e = e || window.event;
	var c = (is_ie) ? e.keyCode : e.which;
	if (c == 13) {
		var sel = Sel.getRange(this.el);
		var txt = this.el.value.substr(0, sel.end);
		var lines = txt.split("\n");
		var scroll = this.el.scrollTop;
		for (var i = lines.length - 1; i >=0; i--) {
			if (lines[i] != '') {
				var tabs = lines[i].replace(/[^\t].*/, '');
				Sel.replace(this.el, tabs);
				this.el.scrollTop = scroll;
				break;
			}
		}		
	}
	this.resetTimer();
	this.checkPosition();
	(this.onKeyUp) && (this.onKeyUp(c));
}

Editor.prototype.handleKeyDown = function(e){
	e = e || window.event;
	var c = (is_ie) ? e.keyCode : e.which;
	switch (c) {
		case 9: {
			var scroll = this.el.scrollTop;		
			var txt = Sel.getText(this.el);
			var new_txt;	
			if (e.shiftKey) {
				new_txt = txt.replace(/^\t/, "").replace(/\n\t/g, "\n");
			} else {
				new_txt = "\t" + txt.replace(/\n/g, "\n\t");
			}
			Sel.replace(this.el, new_txt);
			var el = this.el;
			setTimeout(function() { el.focus(); }, 0);
			this.el.scrollTop = scroll;			
			return false;
		}
		default:
			if (this.onKeyDown)
				return this.onKeyDown(e, c);
			break;
	}
}
