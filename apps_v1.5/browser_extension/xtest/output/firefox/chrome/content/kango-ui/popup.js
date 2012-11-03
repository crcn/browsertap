/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserTap_kango.ui.PopupOpenParams={url:"",width:0,height:0};BrowserTap_kango.ui.Popup=function(){BrowserTap_kango.oop.mixin(this,BrowserTap_kango.EventTarget.prototype);BrowserTap_kango.oop.mixin(this,new BrowserTap_kango.EventTarget)};
BrowserTap_kango.ui.Popup.prototype={_popupWnd:null,open:function(a){0!=a.url.indexOf("http")&&(a.url=BrowserTap_kango.io.getExtensionFileUrl(a.url));this.close();a.kango=BrowserTap_kango;this._popupWnd=window.openDialog("chrome://BrowserTap_kango/content/kango-ui/popup_window.xul","","chrome=yes,dependent=yes,width="+a.width+",height="+a.height,{wrappedJSObject:a});var c=this,b=function(){window.removeEventListener("focus",b,!0);window.removeEventListener("unload",b,!0);c.close()};window.addEventListener("focus",b,!0);window.addEventListener("unload",
b,!0);this._popupWnd.addEventListener("load",function(a){a.target.getElementById("frame").addEventListener("DOMContentLoaded",function(a){c.fireEvent("PopupDocumentComplete",{window:a.target.defaultView.wrappedJSObject})},!0)},!0)},close:function(){null!=this._popupWnd&&(this._popupWnd.close(),this._popupWnd=null)}};
