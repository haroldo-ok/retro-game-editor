function Float() {
	this.oEl = null;
	this.oSelected = null;
	this.oReturnFocus = null;
	this.onChange = null; // function(mItem)
	
	this.create();
}

Float.prototype.create = function() {
	this.oEl = document.createElement('div');
	this.oEl.className = 'float';
	this.oEl.style.display = 'none';
	this.oEl.style.position = 'absolute';
	document.body.appendChild(this.oEl);
	var oFloat = this;
	this.oEl.onkeydown = function(e) {
		return oFloat.handleKeyDown(e);
	}
	this.oEl.onkeyup = function(e) {
		return oFloat.handleKeyUp(e);
	}
	this.oEl.onblur = function() {
		oFloat.hide();
	}
}

Float.prototype.isActive = function() {
	return this.oEl.style.display == 'block';
}

Float.prototype.focus = function(oReturnTo) {
	this.oReturnFocus = oReturnTo;
	this.oEl.focus();
	if (!this.oSelected && this.oEl.firstChild) {
		this.oSelected = this.oEl.firstChild;
		this.oSelected.className = 'floatItemSelected';		
	}
}

Float.prototype.handleKeyUp = function(e) {
	e = e || window.event;	
	var c = (is_ie) ? e.keyCode : e.which;

	//log('float keyup ' + c);

	switch (c) {
		case 13:
			if (this.oSelected && this.onChange)
				this.onChange(this.oSelected.oData);
			this.hide();
			return false;
	}
}

Float.prototype.handleKeyDown = function(e) {
	e = e || window.event;	
	var c = (is_ie) ? e.keyCode : e.which;
	
	//log('float keydown ' + c);
	
	switch (c) {
		case 38: // up
		case 40: // down
			if (this.oSelected) {
				this.oSelected.className = 'floatItem';
				if (c == 38) {
					this.oSelected = (this.oSelected.previousSibling) ? 
						this.oSelected.previousSibling : this.oEl.lastChild;
				} else {
					this.oSelected = (this.oSelected.nextSibling) ? 
						this.oSelected.nextSibling : this.oEl.firstChild;
				}
				if (this.oSelected)
					this.oSelected.className = 'floatItemSelected';
			}
			break;
		case 27:
			this.hide();
			break;
	}
}

Float.prototype.setup = function(aItems) {
	this.oSelected = null;
	while (this.oEl.firstChild)
		this.oEl.removeChild(this.oEl.firstChild);
	for (var sDesc in aItems) {
		var oDiv = document.createElement('div');
		this.oEl.appendChild(oDiv);
		oDiv.className = 'floatItem';
		oDiv.innerHTML = sDesc;
		oDiv.oData = aItems[sDesc];
	}
}

Float.prototype.show = function(x, y) {
	this.oEl.style.left = x;
	this.oEl.style.top = y;
	this.oEl.style.display = 'block';
}

Float.prototype.hide = function() {
	this.oEl.style.display = 'none';
	if (this.oReturnFocus)
		this.oReturnFocus.focus();
}
