kango.ui.BrowserButton=function(a){null==this._getContainerElem()&&this._insertButton();kango.ui.Button.call(this,document.getElementById(this._buttonId),a)};
kango.ui.BrowserButton.prototype=kango.oop.extend(kango.ui.Button,{_buttonId:"kango-ui-browserButton",_containerId:"kango-ui-browserButton-container",_getContainerElem:function(){return document.getElementById(this._containerId)},_insertButton:function(){var a=document.getElementById("nav-bar"),b=a.currentSet.split(",");if(-1==b.indexOf(this._containerId)){var c=b.indexOf("search-container")+1||b.length;a.currentSet=b.slice(0,c).concat(this._containerId).concat(b.slice(c)).join(",");document.persist(a.id,
"currentset");try{BrowserToolboxCustomizeDone(!0)}catch(d){}}}});