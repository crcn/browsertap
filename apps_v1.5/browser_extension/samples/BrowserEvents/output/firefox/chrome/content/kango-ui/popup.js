﻿/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserEvents_kango.ui.PopupOpenParams={url:"",width:0,height:0};BrowserEvents_kango.ui.Popup=function(){BrowserEvents_kango.oop.mixin(this,BrowserEvents_kango.EventTarget.prototype);BrowserEvents_kango.oop.mixin(this,new BrowserEvents_kango.EventTarget)};
BrowserEvents_kango.ui.Popup.prototype={_popupWnd:null,open:function(a){0!=a.url.indexOf("http")&&(a.url=BrowserEvents_kango.io.getExtensionFileUrl(a.url));this.close();a.kango=BrowserEvents_kango;this._popupWnd=window.openDialog("chrome://BrowserEvents_kango/content/kango-ui/popup_window.xul","","chrome=yes,dependent=yes,width="+a.width+",height="+a.height,{wrappedJSObject:a});var c=this,b=function(){window.removeEventListener("focus",b,!0);window.removeEventListener("unload",b,!0);c.close()};window.addEventListener("focus",b,!0);window.addEventListener("unload",
b,!0);this._popupWnd.addEventListener("load",function(a){a.target.getElementById("frame").addEventListener("DOMContentLoaded",function(a){c.fireEvent("PopupDocumentComplete",{window:a.target.defaultView.wrappedJSObject})},!0)},!0)},close:function(){null!=this._popupWnd&&(this._popupWnd.close(),this._popupWnd=null)}};
