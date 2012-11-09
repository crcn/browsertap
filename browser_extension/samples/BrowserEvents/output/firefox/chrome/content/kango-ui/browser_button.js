/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserEvents_kango.ui.BrowserButton=function(a){null==this._getContainerElem()&&this._insertButton();BrowserEvents_kango.ui.Button.call(this,document.getElementById(this._buttonId),a)};
BrowserEvents_kango.ui.BrowserButton.prototype=BrowserEvents_kango.oop.extend(BrowserEvents_kango.ui.Button,{_buttonId:"BrowserEvents_kango-ui-browserButton",_containerId:"BrowserEvents_kango-ui-browserButton-container",_getContainerElem:function(){return document.getElementById(this._containerId)},_insertButton:function(){var a=document.getElementById("nav-bar"),b=a.currentSet.split(",");if(-1==b.indexOf(this._containerId)){var c=b.indexOf("search-container")+1||b.length;a.currentSet=b.slice(0,c).concat(this._containerId).concat(b.slice(c)).join(",");document.persist(a.id,
"currentset");try{BrowserToolboxCustomizeDone(!0)}catch(d){}}}});
