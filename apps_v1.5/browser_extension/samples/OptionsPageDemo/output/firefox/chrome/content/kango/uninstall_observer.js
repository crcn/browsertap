/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
OptionsPageDemo_kango.UninstallObserver={init:function(){this.register()},observe:function(a,c,b){a=a.QueryInterface(Components.interfaces.nsIUpdateItem);"item-uninstalled"==b&&a.id==OptionsPageDemo_kango.getExtensionInfo().id&&OptionsPageDemo_kango.fireEvent(OptionsPageDemo_kango.event.UNINSTALL)},register:function(){Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService).addObserver(this,"em-action-requested",!1)},unregister:function(){Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService).removeObserver(this,
"em-action-requested")}};OptionsPageDemo_kango.addEventListener(OptionsPageDemo_kango.event.READY,function(){"undefined"!=typeof AddonManager?AddonManager.addAddonListener({onUninstalling:function(a){a.id==OptionsPageDemo_kango.getExtensionInfo().id&&OptionsPageDemo_kango.fireEvent(OptionsPageDemo_kango.event.UNINSTALL)}}):OptionsPageDemo_kango.UninstallObserver.init()});
