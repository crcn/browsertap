﻿/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
ChristmasTree_kango.SimpleStorage=function(){var a="http://"+this._getDomainFromId(ChristmasTree_kango.getExtensionInfo().id)+".kangoextensions.com";this._storage=this._getLocalStorageForUrl(a);this._migrateFrom095()};
ChristmasTree_kango.SimpleStorage.prototype={_storage:null,_migrateFrom095:function(){for(var a=this._getLocalStorageForUrl("http://"+"ChristmasTree_kango".replace("_","-")+".kangoextensions.com"),c=a.length,b=0;b<c;b++){var d=a.key(b);this._storage.setItem(d,a.getItem(d))}0<c&&a.clear()},_getDomainFromId:function(a){for(var c="",b=0;b<a.length;b++)if(ChristmasTree_kango.string.isAlpha(a[b])||ChristmasTree_kango.string.isDigit(a[b])||"-"==a[b])c+=a[b];return c},_getLocalStorageForUrl:function(a){var c=Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService),
b=Components.classes["@mozilla.org/scriptsecuritymanager;1"].getService(Components.interfaces.nsIScriptSecurityManager),d=Components.classes["@mozilla.org/dom/storagemanager;1"].getService(Components.interfaces.nsIDOMStorageManager),a=c.newURI(a,null,null),b=b.getNoAppCodebasePrincipal?b.getNoAppCodebasePrincipal(a):b.getCodebasePrincipal(a);return d.getLocalStorageForPrincipal(b,"")},getItem:function(a){return this._storage.getItem(a)},setItem:function(a,c){this._storage.setItem(a,c)},removeItem:function(a){this._storage.removeItem(a)},
clear:function(){this._storage.clear()},getKeys:function(){for(var a=this._storage.length,c=Array(a),b=0;b<a;b++)c[b]=this._storage.key(b);return c}};ChristmasTree_kango.simpleStorage=new ChristmasTree_kango.SimpleStorage;
