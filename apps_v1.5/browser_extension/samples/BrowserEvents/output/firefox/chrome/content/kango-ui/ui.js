﻿/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserEvents_kango.ui={};BrowserEvents_kango.oop.mixin(BrowserEvents_kango.ui,BrowserEvents_kango.EventTarget.prototype);BrowserEvents_kango.oop.mixin(BrowserEvents_kango.ui,new BrowserEvents_kango.EventTarget);BrowserEvents_kango.ui._init=function(){throw new BrowserEvents_kango.NotImplementedException;};BrowserEvents_kango.ui.event={READY:"Ready"};BrowserEvents_kango.ui.ButtonBase=function(a){this._details=a;BrowserEvents_kango.oop.mixin(this,BrowserEvents_kango.EventTarget.prototype);BrowserEvents_kango.oop.mixin(this,new BrowserEvents_kango.EventTarget)};
BrowserEvents_kango.ui.ButtonBase.prototype={_details:null,event:{Command:"command",COMMAND:"command",PopupDocumentComplete:"PopupDocumentComplete"},setTooltipText:function(){throw new BrowserEvents_kango.NotImplementedException;},setCaption:function(){throw new BrowserEvents_kango.NotImplementedException;},setIcon:function(){throw new BrowserEvents_kango.NotImplementedException;},setBadgeValue:function(){throw new BrowserEvents_kango.NotImplementedException;},setBadgeBackgroundColor:function(){throw new BrowserEvents_kango.NotImplementedException;},setPopup:function(){throw new BrowserEvents_kango.NotImplementedException;
},setContextMenu:function(){throw new BrowserEvents_kango.NotImplementedException;}};BrowserEvents_kango.addEventListener(BrowserEvents_kango.event.READY,function(){BrowserEvents_kango.ui._init()});BrowserEvents_kango.ui.IOptionsPage=function(){};BrowserEvents_kango.ui.IOptionsPage.prototype={open:function(){throw new BrowserEvents_kango.NotImplementedException;}};BrowserEvents_kango.ui.NotificationBase=function(a,b){BrowserEvents_kango.oop.mixin(this,BrowserEvents_kango.EventTarget.prototype);BrowserEvents_kango.oop.mixin(this,new BrowserEvents_kango.EventTarget);this._id=a;b&&(this._impl=b)};
BrowserEvents_kango.ui.NotificationBase.prototype={_impl:null,event:{Click:"Click",Close:"Close",Show:"Show"},id:"",getId:function(){return this._id},show:function(){throw new BrowserEvents_kango.NotImplementedException;},close:function(){throw new BrowserEvents_kango.NotImplementedException;}};BrowserEvents_kango.ui.NotificationsBase=function(){};BrowserEvents_kango.ui.NotificationsBase.prototype={createNotification:function(){throw new BrowserEvents_kango.NotImplementedException;}};


// Merged from /Users/apple/Developer/eyebrowse/apps_v1.5/browser_extension/src/js/firefox/kango-ui/ui.part.js

BrowserEvents_kango.ui.Button=function(a,b){BrowserEvents_kango.ui.ButtonBase.call(this,b);this._element=a;this._popup=new BrowserEvents_kango.ui.Popup;this._popupDetails=null;this._badgeText=this._icon="";this._badgeBackgroundColor=this._badgeDefaultBackgroundColor;this._image=null;var d=this;this._element.addEventListener("command",function(a){d._onCommand(a)},!1);this._popup.addEventListener("PopupDocumentComplete",function(a){d._onPopupDocumentComplete(a)});this._initDetails(b)};
BrowserEvents_kango.ui.Button.prototype=BrowserEvents_kango.oop.extend(BrowserEvents_kango.ui.ButtonBase,{_element:null,_popup:null,_popupDetails:null,_icon:null,_badgeBackgroundColor:null,_badgeDefaultBackgroundColor:[176,0,18,255],_badgeText:"",_image:null,_initDetails:function(a){BrowserEvents_kango.lang.isObject(a)&&(BrowserEvents_kango.lang.isString(a.icon)&&this.setIcon(a.icon),BrowserEvents_kango.lang.isString(a.caption)&&this.setCaption(a.caption),BrowserEvents_kango.lang.isString(a.tooltipText)&&this.setTooltipText(a.tooltipText),"undefined"!=typeof a.popup&&BrowserEvents_kango.lang.isObject(a.popup)&&
(this._popupDetails=a.popup))},_onCommand:function(a){if(a.target.id==this._element.id)if(null!=this._popupDetails){var b=this._element.getBoundingClientRect(),a=parseInt(this._element.boxObject.screenX+b.width/2,10),b=parseInt(this._element.boxObject.screenY+b.height,10);this._popup.open({url:this._popupDetails.url,width:parseInt(this._popupDetails.width,10),height:parseInt(this._popupDetails.height,10),x:a,y:b})}else this.fireEvent(this.event.COMMAND)},_onPopupDocumentComplete:function(a){this.fireEvent(this.event.PopupDocumentComplete,
a)},_update:function(){var a=this._element;null!=this._image&&(this._image.onload=function(){},delete this._image,this._image=null);var b=this._image=new Image,d=this,k=function(){if(null!=d._image)if(d._image.complete){var g=b.width,i=b.height;if(19<g||19<i)g=i=19;var j=document.getElementById("BrowserEvents_kango-ui-canvas"),c=j.getContext("2d");if(""!=d._badgeText){c.font="bold 11px Tahoma,arial,helvetica,sans-serif";j.width=19;j.height=19;var h=Math.round(c.measureText(d._badgeText).width);j.width=g+h+2;j.height=
i;c.drawImage(b,0,0,g,i);var e=g+-4,f=i-11-1,h=h+6,l="rgba("+d._badgeBackgroundColor[0]+", "+d._badgeBackgroundColor[1]+", "+d._badgeBackgroundColor[2]+", "+d._badgeBackgroundColor[3]/255+")";c.beginPath();c.moveTo(e,f+4);c.lineTo(e,f+12-4);c.quadraticCurveTo(e,f+12,e+4,f+12);c.lineTo(e+h-4,f+12);c.quadraticCurveTo(e+h,f+12,e+h,f+12-4);c.lineTo(e+h,f+4);c.quadraticCurveTo(e+h,f,e+h-4,f);c.lineTo(e+4,f);c.quadraticCurveTo(e,f,e,f+4);c.fillStyle=l;c.fill();c.font="bold 11px Tahoma,arial,helvetica,sans-serif";
c.textBaseline="top";c.fillStyle="white";c.fillText(d._badgeText,g+-4+2,i-11)}else j.width=g,j.height=i,c.drawImage(b,0,0,g,i);a.image=j.toDataURL("image/png")}else window.setTimeout(k,10)};b.onload=k;b.src=this._icon},setTooltipText:function(a){this._element.setAttribute("tooltiptext",a)},setCaption:function(a){this._element.label=a},setIcon:function(a){var b=a;BrowserEvents_kango.io.isLocalUrl(a)&&(""!=a?b=BrowserEvents_kango.io.getExtensionFileUrl(a):(this._element.removeAttribute("image"),b=""));this._icon!=b&&(this._icon=
b,this._update())},setBadgeValue:function(a){a=null!=a&&0!=a?a.toString():"";this._badgeText!=a&&(this._badgeText=a,this._update())},setBadgeBackgroundColor:function(a){null!=a&&(BrowserEvents_kango.lang.isArray(a)&&4<=a.length)&&(this._badgeBackgroundColor=a,this._update())},setPopup:function(a){this._popupDetails=a},closePopup:function(){this._popup.close()},setContextMenu:function(a,b){var d=this._element,k=document.createElement("menupopup");k.setAttribute("id",d.id+"-menu");d.appendChild(k);var g=document.createElement("menuitem");
g.setAttribute("label",a);g.addEventListener("command",function(a){b();a.preventDefault()},!1);k.appendChild(g);this._element.addEventListener("contextmenu",function(a){k.openPopup(d,"after_start",0,0,!0,!1);a.preventDefault()},!1)}});BrowserEvents_kango.ui._init=function(){var a=BrowserEvents_kango.getExtensionInfo().toolbar;BrowserEvents_kango.lang.isObject(a)&&(BrowserEvents_kango.ui.toolbar=new BrowserEvents_kango.ui.Toolbar);a=BrowserEvents_kango.getExtensionInfo().browser_button;BrowserEvents_kango.lang.isObject(a)&&(BrowserEvents_kango.ui.browserButton=new BrowserEvents_kango.ui.BrowserButton(a));return this.fireEvent(this.event.READY)};
BrowserEvents_kango.ui.popup={};BrowserEvents_kango.ui.popup.close=function(){BrowserEvents_kango.ui.browserButton.closePopup()};
