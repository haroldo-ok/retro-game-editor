function compl2(v) {
	return (v < 0) ? (256 + v) : v;
}

function compl2_16(v) {
	return (v < 0) ? (65536 + v) : v;
}

function toHex(v, sz) {
	sz = sz || 0;
	var c = 0;
	var r = '';
	while (v > 0) {
		var n = v & 15;
		r = ((n > 9) ? String.fromCharCode(n + 55) : n.toString()) + r;
		v >>= 4;
		c++;
	}
	while (c++ < sz)
		r = '0' + r;
	return r;
}

function ASM() {
	this.aMem = [];
	this.aData = {};
	this.aLabels = {};
	this.iLine = 0;
	this.iPos = 0;
	this.iPointer = 0;
	this.iBegin = 0;
	this.iExec = null;
	this.aTime = [0,0];
	this.iM1 = 0;
	this.sLastLabel = null;
	this.fBreakpoint = null;
	this.aBreakpoints = null;
	this.sGenType = 'bin';
	this.oParentASM = null;
	this.sStruct = null;
	this.iStruct = 0;
}

ASM.fExternalLoader = function(sFilename) {
	throw('ERROR: External loader not specified');
}

ASM.prototype.getLineNumber = function() {
	var o = this;
	while (o.oParentASM)
		o = o.oParentASM;
	return o.iLine;
}

ASM.prototype.prepareParam = function(sData) {
	var aLabels = this.aLabels;
	sData = sData.replace(/[a-f0-9]+h(?![a-z0-9_])/ig, function(m) {
		return "0x" + m.substr(0, m.length-1);
	});
	sData = sData.replace(/\$[a-f0-9]+/ig, function(m) {
		return "0x" + m.substr(1, m.length-1);
	});
	sData = sData.replace(/[01]+b(?![a-z0-9_])/ig, function(m) {
		return parseInt(m.substr(0, m.length-1), 2).toString();
	});
	sData = sData.replace(/[a-z_][a-z0-9_\.]*/ig, function(m) {
		if (aLabels[m] != undefined)
			return aLabels[m];
		return m;
	});
	return sData;
}

ASM.prototype.evaluateData = function(bSkipErrors) {
	if (bSkipErrors) {
		for (var iPos in this.aData) {
			try { this.evaluateDataPos(iPos); } catch (e) {}
		}
	} else {
		for (var iPos in this.aData) {
			this.evaluateDataPos(iPos);
		}
	}
}

ASM.prototype.evaluateDataPos = function(iPos) {
	// translate types such as XXXXh, check constraints
	var aInstr = this.aData[iPos];
	for (var i=0; i<aInstr.length; i++) {
		var aCode = aInstr[i];
		this.iLine = aCode.line;
		this.iPos = aCode.pos;
		var sData = this.prepareParam(aCode.data);
		var mV;
		switch (aCode.type) {
			case 'nn':
				mV = eval(sData);
				if (mV < 0)
					mV = compl2_16(mV);
				if (mV < 0 || mV > 65535)
					throw "Expecting a 16-bit value";
				break;
			case 'n':
				mV = eval(sData);
				if (mV < 0)
					mV = compl2(mV);				
				if (mV < 0 || mV > 255)
					throw "Expecting an 8-bit value";
				break;
			case 'b':
				mV = eval(sData);
				if (mV < 0 || mV > 7)
					throw "Expecting a 3-bit value";
				break;
			case 'o':
				mV = eval(sData);
				if (aCode.op == 'JR' || aCode.op == 'DJNZ') {
					mV -= (aCode.pointer + aCode.sz);
				}
				if (mV < -128 || mV > 127)
					throw "Expecting an 8-bit offset";
				mV = compl2(mV);
				break;
			case 'r':
				var aRegs = {A:7, B:0, C:1, D:2, E:3, H:4, L:5, '(HL)':6};
				mV = aRegs[sData.toUpperCase()];
				if (mV == undefined)
					throw "Expecting one of: " + dump(aRegs);
				break;
			case 'p':
			case 'q':
				var aSum = {H:4, L:5};
				mV = aSum[sData.toUpperCase()];
				if (mV == undefined)
					throw "Expecting one of: " + dump(aSum);
				break;
		}
		aInstr[i] = mV;
		//log(aCode.data + " -> " + mV);
	}
}

ASM.prototype.patch = function(bSkipErrors) {
	var aMem = this.aMem;
	var aPatch = null;
	for (var i=0; i<aMem.length; i++) {
		if (this.aData[i])
			aPatch = this.aData[i];
		if (typeof aMem[i] == 'function') {
			if (bSkipErrors) {
				try {
					aMem[i] = aMem[i](aPatch);
				} catch (e) {}
			} else {
				aMem[i] = aMem[i](aPatch);
			}
		}
	}
}

ASM.prototype.matchParams = function(sOp, sParams, aMask) {
	// first elem means certainty, the higher the better
	var aParts = aMask.re;
	var aData = [0];
	//log(">> " + aMask.mn);
	for (var i=0; i<aParts.length; i++) {
		var sPart = aParts[i];
		//log(sParams + " <- " + sPart);
		var m;
		var eat = 0;
		var bData = true;
		switch (sPart) {
			case 'nn':
			case 'n':
			case 'b':
			case 'o':
				m = /^[^,]+/i.exec(sParams);
				if (!m)
					return false;
				eat = m[0].length;
				var sNext = aParts[i+1] || '';
				if (sNext.charAt(0) == ')')
					eat--;
				break;
			case 'r':
				m = /^(A|B|C|D|E|H|L|\(HL\))/i.exec(sParams);
				if (!m)
					return false;
				eat = m[1].length;
				aData[0]++;
				break;
			case 'p':
			case 'q':
				m = /^[hl]/i.exec(sParams);
				if (!m)
					return false;
				eat = m[0].length;
				aData[0]++;
				break;
			default:
				m = sParams.substr(0, sPart.length);
				if (m.toUpperCase() != sPart)				
					return false;
				eat = sPart.length;
				bData = false;
				break;
		}
		if (bData)
			aData.push({ type: sPart, data: sParams.substr(0, eat), op: sOp, line: this.iLine, pos: this.iPos, pointer: this.iPointer, sz: aMask.sz });
		sParams = sParams.substr(eat);
	}
	return (sParams == '') ? aData : false;
}

ASM.prototype.matchInstr = function(sOp, sParams) {
	var aInstr = aInstrTbl[sOp];
	if (!aInstr) {
		if (!this.matchDirective(sOp, sParams))
			throw "Invalid instruction " + sOp;
		else
			return true;
	}
	var aMatch = null;
	var aMatchMask = null;
	var iBest = -1;
	for (var i=0; i<aInstr.length; i++) {
		var aMask = aInstr[i];
		var aData;
		if (aData = this.matchParams(sOp, sParams, aMask)) {
			if (aData[0] > iBest) {
				aMatch = aData;
				aMatchMask = aMask;
				iBest = aData[0];
			}
		}
	}

	if (aMatch) {
		// TODO: write bytecodes properly
		aMatch.shift();
		if (aMatch.length > 0)
			this.aData[this.aMem.length] = aMatch;
		for (var p=0; p<aMatchMask.op.length; p++) {
			if (typeof aMatchMask.op[p] == "string") {
				aMatchMask.op[p] = new Function("_dt", "return " + aMatchMask.op[p] + ";");
			}
		}
		this.aMem = this.aMem.concat(aMatchMask.op);
		this.iPointer += aMatchMask.op.length;
		// sum timing info
		if (typeof aMatchMask.z8 == 'object') {
			this.aTime[0] += aMatchMask.z8[0];
			this.aTime[1] += aMatchMask.z8[1];
		} else {
			this.aTime[0] += aMatchMask.z8;
			this.aTime[1] += aMatchMask.z8;
		}
		// sum M1 waitstate time info
		this.iM1++;
		switch (aMatchMask.op[0]) {
			case 0xCB:
			case 0xDD:
			case 0xED:
			case 0xFD:
				this.iM1++;
				break;
			case 0xDD:
				if (aMatchMask.op[1] == 0xCB || aMatchMask.op[1] == 0xFD)
					this.iM1++;
				break;				
		}
		return true;
	}
	throw "Invalid parameters '" + sParams + "' for " + sOp;
}

ASM.prototype.matchDirective = function(sOp, sParams) {
	if (this.sStruct) {
		switch (sOp) {
			case 'DS':
			case 'DEFS':
			case 'ENDS':
				break;
			default:
				throw "Invalid directive inside of struct";
				break;
		}
	}
	switch (sOp) {
		case 'ORG':
			this.iPointer = eval(this.prepareParam(sParams));
			if (this.aMem.length == 0) {
				this.iBegin = this.iPointer;
				// FIXME: this is still an ugly hack
				if (this.sGenType == 'rom') {
					this.iPointer += 4;				
					this.aMem.push(65); // 'A'
					this.aMem.push(66); // 'B'
					this.aMem.push(this.iPointer & 0xFF);
					this.aMem.push((this.iPointer >> 8) & 0xFF);					
				}
			} else
				throw "Only one ORG at the top is currently supported";
			break;
		case 'DB':
		case 'DEFB':
			var aBytes = eval("[" + this.prepareParam(sParams) + "]");
			for (var i=0; i<aBytes.length; i++) {
				if (typeof aBytes[i] == "string") {
					var sTxt = aBytes[i];
					for (var c=0; c<sTxt.length; c++) {
						this.aMem.push(sTxt.charCodeAt(c));
						++this.iPointer;
					}
				} else {
					this.aMem.push(aBytes[i]);
					++this.iPointer;
				}
			}
			break;
		case 'DW':
		case 'DEFW':
			var aBytes = eval("[" + this.prepareParam(sParams) + "]");
			for (var i=0; i<aBytes.length; i++) {
				this.aMem.push(aBytes[i] & 0xFF);
				this.aMem.push((aBytes[i] >> 8) & 0xFF);				
			}
			this.iPointer += aBytes.length * 2;
			break;
		case 'DS':
		case 'DEFS':
			var iAmount = eval(this.prepareParam(sParams));
			if (iAmount <= 0) {
				throw "Amount should be greater than 0";
			}
			this.iPointer += iAmount;
			if (this.sStruct == null) {
				while (iAmount-- > 0)
					this.aMem.push(0);
			}
			break;
		case 'EQU':
			var sLabel = this.sLastLabel;
			if (!sLabel)
				throw "EQU without label";
			if (this.aLabels[sLabel] != this.iPointer)
				throw "EQU without label";
			this.aLabels[sLabel] = eval(this.prepareParam(sParams));
			break;
		case 'END':
			break;
		case 'INCLUDE':
			var sFile = eval(this.prepareParam(sParams));
			var sCode = ASM.fExternalLoader(sFile);
			var oASM = new ASM();
			oASM.aMem = this.aMem;
			oASM.aData = this.aData;
			oASM.aLabels = this.aLabels;
			oASM.iPointer = this.iPointer;
			oASM.iBegin = this.iBegin;
			oASM.iExec = this.iExec;
			oASM.aTime = this.aTime;
			oASM.iM1 = this.iM1;
			oASM.sLastLabel = this.sLastLabel;
			oASM.sGenType = this.sGenType;
			
			//this.fBreakpoint = null;
			//this.aBreakpoints = null;
			//this.sGenType = 'bin';
			oASM.oParentASM = this;
			oASM.start(sCode);
			
			this.iPointer = oASM.iPointer;
			this.iBegin = oASM.iBegin;
			this.iM1 = oASM.iM1;
			this.sLastLabel = oASM.sLastLabel;			
			break;
		case 'STRUCT':
			if (!this.sLastLabel)
				throw "STRUCT without label";
			if (this.aLabels[this.sLastLabel] != this.iPointer)
				throw "STRUCT without label";
			this.sStruct = this.sLastLabel;
			this.iStruct = this.iPointer;
			break;
		case 'ENDS':
			this.aLabels[this.sStruct] = this.iPointer - this.iStruct;
			this.sStruct = null;
			this.iPointer = this.iStruct;
			this.iStruct = 0;
			break;
		default:
			return false;
	}
	return true;
}

ASM.prototype.start = function(sCode) {
	var aLines = sCode.split("\n");

	this.iLine = 0;
	this.iPos = 0;
	for (var i=0; i<aLines.length; i++) {
		if (this.aBreakpoints && this.aBreakpoints[i] != undefined)
			this.aBreakpoints[i] = this.iPointer;
		if (this.fBreakpoint) {
			if (this.fBreakpoint())
				break;
		}
		this.iLine = i+1;
		var sOrigLine = aLines[i];
		//log(this.iLine.toString() + ': '+ sOrigLine);
		var sLine = sOrigLine.replace(/;.*/, '');
		var m;
		var sOp = null;
		var sParams = null;
		if (m = /(.*)\:(.*)/.exec(sLine)) {
			var sLabel = m[1].replace(/^[ \t]+/, '').replace(/[ \t]+$/, '');
			sLabel = (this.sStruct) ? (this.sStruct + '.' + sLabel) : sLabel;
			sLine = m[2];
			this.aLabels[sLabel] = this.iPointer - this.iStruct;
			this.sLastLabel = sLabel;
			if (sLabel.toUpperCase() == 'MAIN') {
				this.iExec = this.iPointer;
			}
		}
		if (m = /[ \t]*([a-z]+)[ \t]*(.*)/i.exec(sLine)) {
			sOp = m[1].toUpperCase();
			// TODO: this is a very weak space handler
			sParams = m[2].replace(/[ \t]*,[ \t]*/, ',').replace(/[ \t]+$/, '');
			this.matchInstr(sOp, sParams);
		}
		this.iPos += sOrigLine.length + 1;
	}
}
