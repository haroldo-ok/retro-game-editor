function File(sDefaultExtension, aFilters) {
	this.sDefaultExtension = sDefaultExtension;
	this.aFilters = aFilters;
}

// file modes
File.RDONLY = 0x01;
File.WRONLY = 0x02;
File.RDWR = 0x04;
File.CREATE_FILE = 0x08;
File.APPEND = 0x10;
File.TRUNCATE = 0x20;
File.SYNC = 0x40;
File.EXCL = 0x80;

// file mode bits
File.IRWXU = 00700;  /* read, write, execute/search by owner */
File.IRUSR = 00400;  /* read permission, owner */
File.IWUSR = 00200;  /* write permission, owner */
File.IXUSR = 00100;  /* execute/search permission, owner */
File.IRWXG = 00070;  /* read, write, execute/search by group */
File.IRGRP = 00040;  /* read permission, group */
File.IWGRP = 00020;  /* write permission, group */
File.IXGRP = 00010;  /* execute/search permission, group */
File.IRWXO = 00007;  /* read, write, execute/search by others */
File.IROTH = 00004;  /* read permission, others */
File.IWOTH = 00002;  /* write permission, others */
File.IXOTH = 00001;  /* execute/search permission, others */

File.permission = function(fRun) {
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	} catch(e) {
		return false;
	}
	fRun();
	return true;
}

File.prototype.setPickerProps = function(fp) {
	if (this.sDefaultExtension)
		fp.defaultExtension = this.sDefaultExtension;
	if (this.aFilters) {
		for (var sFilter in this.aFilters) {
			fp.appendFilter(aFilters[sFilter], sFilter);
		}
	}
}

File.prototype.savePicker = function(sTitle) {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, sTitle, nsIFilePicker.modeSave);
	this.setPickerProps(fp);
	// nsIFilePicker.returnOK, nsIFilePicker.returnReplace
	var mRes = fp.show();
	this.oFile = (mRes == nsIFilePicker.returnOK || mRes == nsIFilePicker.returnReplace) ?
		fp.file : null;
	return this.oFile;
}

File.prototype.loadPicker = function(sTitle) {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, sTitle, nsIFilePicker.modeOpen);
	this.setPickerProps(fp);
	// nsIFilePicker.returnOK, nsIFilePicker.returnReplace
	var mRes = fp.show();
	this.oFile = (mRes == nsIFilePicker.returnOK || mRes == nsIFilePicker.returnReplace) ?
		fp.file : null;
	return this.oFile;
}

File.prototype.save = function(sData) {
	if (!this.oFile)
		return false;
	if (this.oFile.exists() == false )
		this.oFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
	var oStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
		.createInstance( Components.interfaces.nsIFileOutputStream );
	oStream.init(this.oFile, 0x02 | 0x08 | 0x20, 420, 0);
	var mRes = oStream.write(sData, sData.length);
	oStream.close();
	return mRes;
}

File.prototype.load = function() {
	if (!this.oFile)
		return false;
	if (this.oFile.exists() == false )
		return false;
	var oStream = Components.classes["@mozilla.org/network/file-input-stream;1"]
		.createInstance( Components.interfaces.nsIFileInputStream );
	oStream.init(this.oFile, 0x01, 00004, null);
	var oReader = Components.classes["@mozilla.org/scriptableinputstream;1"]
		.createInstance( Components.interfaces.nsIScriptableInputStream );
	oReader.init(oStream);
	var sData = oReader.read(oReader.available());
	return sData;
}
