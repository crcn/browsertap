/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
ChristmasTree_kango.ui.PopupOpenParams={url:"",width:0,height:0};ChristmasTree_kango.ui.Popup=function(){ChristmasTree_kango.oop.mixin(this,ChristmasTree_kango.EventTarget.prototype);ChristmasTree_kango.oop.mixin(this,new ChristmasTree_kango.EventTarget)};
ChristmasTree_kango.ui.Popup.prototype={_popupWnd:null,open:function(a){0!=a.url.indexOf("http")&&(a.url=ChristmasTree_kango.io.getExtensionFileUrl(a.url));this.close();a.kango=ChristmasTree_kango;this._popupWnd=window.openDialog("chrome://ChristmasTree_kango/content/kango-ui/popup_window.xul","","chrome=yes,dependent=yes,width="+a.width+",height="+a.height,{wrappedJSObject:a});var c=this,b=function(){window.removeEventListener("focus",b,!0);window.removeEventListener("unload",b,!0);c.close()};window.addEventListener("focus",b,!0);window.addEventListener("unload",
b,!0);this._popupWnd.addEventListener("load",function(a){a.target.getElementById("frame").addEventListener("DOMContentLoaded",function(a){c.fireEvent("PopupDocumentComplete",{window:a.target.defaultView.wrappedJSObject})},!0)},!0)},close:function(){null!=this._popupWnd&&(this._popupWnd.close(),this._popupWnd=null)}};
