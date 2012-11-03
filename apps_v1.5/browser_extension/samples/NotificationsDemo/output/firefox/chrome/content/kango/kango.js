﻿/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
var NotificationsDemo_kango={oop:{extend:function(a,b){var c=function(){};c.prototype=a.prototype;c=new c;c.superclass=a;this.mixin(c,b);return c},mixin:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])},createProxy:function(a){var b=function(){};b.prototype=a;b=new b;b.baseObject=a;return b},decorate:function(a,b,c){var d=a[b];a[b]=function(){return c.call(this,d,arguments)}}},array:{map:function(a,b){for(var c=a.length,d=Array(c),e=0;e<c;e++)d[e]=b(a[e]);return d},forEach:function(a,b){for(var c=a.length,
d=0;d<c;d++)b(a[d])}},string:{format:function(a,b){for(var c=1;c<arguments.length;c++)a=a.replace(RegExp("\\{"+(c-1)+"}","g"),arguments[c].toString());return a},isAlpha:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a},isDigit:function(a){return"0"<=a&&"9">=a}},object:{getKeys:function(a){var b=[],c;for(c in a)a.hasOwnProperty(c)&&b.push(c);return b}},date:{diff:function(a,b){return Math.ceil((a.getTime()-b.getTime())/1E3)}},ExtensionInfo:function(){this.homepage_url=this.creator=this.description=
this.version=this.name="";this.background_scripts=[];this.content_scripts=[];this.browser_button={};this.options_page=this.update_path_url=""},NotImplementedException:function(a){this.prototype=Error.prototype;this.name="KangoNotImplementedException";this.message="Method "+(a?a+" ":"")+"is not implemented";this.toString=function(){return this.name+": "+this.message}},event:{READY:"Ready",Ready:"Ready",MESSAGE:"message",Message:"message",UNINSTALL:"Uninstall"},Event:function(a,b,c){this.type=a;this.target=
c||null;"object"==typeof b&&NotificationsDemo_kango.oop.mixin(this,b)},EventTarget:function(){this._eventListeners={}}};
NotificationsDemo_kango.EventTarget.prototype={_eventListeners:{},dispatchEvent:function(a){var b=a.type.toLowerCase();if("undefined"!=typeof this._eventListeners[b]){for(var b=this._eventListeners[b],c=0;c<b.length;c++)b[c](a);return!0}return!1},fireEvent:function(a,b){return this.dispatchEvent(new NotificationsDemo_kango.Event(a,b))},addEventListener:function(a,b){if("undefined"!=typeof b.call&&"undefined"!=typeof b.apply){for(var c=a.toLowerCase(),c=this._eventListeners[c]=this._eventListeners[c]||[],d=0;d<c.length;d++)if(c[d]==
b)return!1;c.push(b);return!0}return!1},removeEventListener:function(a,b){var c=a.toLowerCase();if("undefined"!=typeof this._eventListeners[c])for(var c=this._eventListeners[c],d=0;d<c.length;d++)if(c[d]==b)return c.splice(d,1),!0;return!1}};NotificationsDemo_kango.IConsole=function(){};NotificationsDemo_kango.IConsole.prototype={log:function(){throw new NotificationsDemo_kango.NotImplementedException;}};NotificationsDemo_kango.IStorage=function(){};
NotificationsDemo_kango.IStorage.prototype={SYSTEM_STORAGE_PREFIX:"{772ED927-1623-4E2C-94CC-D5E488E34C5B}_NotificationsDemo_kangoSystemStorage.",setItem:function(){throw new NotificationsDemo_kango.NotImplementedException;},getItem:function(){throw new NotificationsDemo_kango.NotImplementedException;},removeItem:function(){throw new NotificationsDemo_kango.NotImplementedException;},getKeys:function(){throw new NotificationsDemo_kango.NotImplementedException;},clear:function(){throw new NotificationsDemo_kango.NotImplementedException;}};NotificationsDemo_kango.IOBase=function(){};
NotificationsDemo_kango.IOBase.prototype={getExtensionFileUrl:function(){throw new NotificationsDemo_kango.NotImplementedException;},isLocalUrl:function(a){return-1==a.indexOf("http://")&&-1==a.indexOf("https://")},getFileUrl:function(a){this.isLocalUrl(a)&&(a=this.getExtensionFileUrl(a));return a},getExtensionFileContents:function(a){var b=new XMLHttpRequest;b.open("GET",this.getExtensionFileUrl(a),!1);"undefined"!=typeof b.overrideMimeType&&b.overrideMimeType("text/plain");try{return b.send(null),b.responseText}catch(c){return null}},
getResourceUrl:function(){throw new NotificationsDemo_kango.NotImplementedException;}};NotificationsDemo_kango.LangBase=function(){};
NotificationsDemo_kango.LangBase.prototype={getGlobalContext:function(){return function(){return this}.call(null)},invoke:function(a,b,c){for(var b=b.split("."),d=b.pop(),e=0;e<b.length;e++)a=a[b[e]];return a[d].apply(a,c)},evalInSandbox:function(){throw new NotificationsDemo_kango.NotImplementedException;},bind:function(a,b){return function(){a.apply(b,arguments)}},clone:function(a){return JSON.parse(JSON.stringify(a))},isString:function(a){return"string"==typeof a||a instanceof String},isObject:function(a){return"object"==typeof a||
"[object Object]"==Object.prototype.toString.call(a)},isArray:function(a){return a instanceof Array||"[object Array]"==Object.prototype.toString.call(a)},isFunction:function(a){return"function"==typeof a}};
(function(){NotificationsDemo_kango.oop.mixin(NotificationsDemo_kango,NotificationsDemo_kango.EventTarget.prototype);NotificationsDemo_kango.oop.mixin(NotificationsDemo_kango,new NotificationsDemo_kango.EventTarget);NotificationsDemo_kango.oop.mixin(NotificationsDemo_kango,{_configFileName:"extension_info.json",_extensionInfo:null,_messageRouter:null,_eventState:0,_modules:[],_loadExtensionInfo:function(){null==this._extensionInfo&&(this._extensionInfo=JSON.parse(NotificationsDemo_kango.io.getExtensionFileContents(this._configFileName)))},_initMessaging:function(){var a=this;this._messageRouter=new NotificationsDemo_kango.MessageRouter;this._messageRouter.onmessage=function(b){a.fireEvent(a.event.MESSAGE,
b)};this.dispatchMessage=function(a,c){this._messageRouter.dispatchMessage(a,c)}},_initModules:function(){for(var a=0;a<this._modules.length;a++)(new this._modules[a]).init(NotificationsDemo_kango)},_init:function(){this._loadExtensionInfo();this._initMessaging();this._initModules();return this.fireEvent(this.event.READY)},registerModule:function(a){this._modules.push(a)},getExtensionInfo:function(){null==this._extensionInfo&&this._loadExtensionInfo();return NotificationsDemo_kango.lang.clone(this._extensionInfo)},getContext:function(){var a=
NotificationsDemo_kango.backgroundScript.getContext();return a?a:NotificationsDemo_kango.lang.getGlobalContext()},isDebug:function(){var a=this.getExtensionInfo();return"undefined"!=typeof a.debug&&a.debug}})})();


// Merged from D:\Work\SVN\trunk\NotificationsDemo_kangoBuildTool\output\public\src\js\ie firefox\NotificationsDemo_kango\NotificationsDemo_kango.part.js

NotificationsDemo_kango.TabProxy=function(a){this._tab=a;this._listeners=[];(new NotificationsDemo_kango.InvokeAsyncModule).init(this);(new NotificationsDemo_kango.MessageTargetModule).init(this)};
NotificationsDemo_kango.TabProxy.prototype={_tab:null,_listeners:null,xhr:{send:function(){return NotificationsDemo_kango.xhr.send.apply(NotificationsDemo_kango.xhr,arguments)}},console:{log:function(){return NotificationsDemo_kango.console.log.apply(NotificationsDemo_kango.console,arguments)}},browser:{getName:function(){return NotificationsDemo_kango.browser.getName()}},io:{getResourceUrl:function(a){return NotificationsDemo_kango.io.getResourceUrl(a)}},event:{MESSAGE:"message"},dispatchMessage:function(a,c){var b={name:a,data:c,origin:"tab",source:this._tab,target:this._tab};window.setTimeout(function(){NotificationsDemo_kango.fireEvent(NotificationsDemo_kango.event.MESSAGE,
b)},1);return!0},addEventListener:function(a,c){if("message"==a){for(var b=0;b<this._listeners.length;b++)if(this._listeners[b]==c)return;this._listeners.push(c)}},fireEvent:function(a,c){if("message"==a){c.source=c.target=this;for(var b=0;b<this._listeners.length;b++)this._listeners[b](c)}}};


// Merged from D:\Work\SVN\trunk\NotificationsDemo_kangoBuildTool\output\public\src\js\firefox\NotificationsDemo_kango\NotificationsDemo_kango.part.js

NotificationsDemo_kango.TabProxy.prototype.__exposedProps__={xhr:"r",console:"r",browser:"r",io:"r",event:"r",invokeAsync:"r",invokeAsyncCallback:"r",dispatchMessage:"r",addMessageListener:"r",removeMessageListener:"r",removeAllMessageListeners:"r"};NotificationsDemo_kango.TabProxy.prototype.xhr.__exposedProps__={send:"r"};
NotificationsDemo_kango.TabProxy.prototype.xhr.send=function(b,c){NotificationsDemo_kango.xhr.send(b,function(a){a.__exposedProps__={response:"rw",status:"r"};""!=a.response&&null!=a.response&&"json"==b.contentType&&NotificationsDemo_kango.lang.makeDataExposed(a.response);c(a)})};NotificationsDemo_kango.TabProxy.prototype.console.__exposedProps__={log:"r"};NotificationsDemo_kango.TabProxy.prototype.browser.__exposedProps__={getName:"r"};NotificationsDemo_kango.TabProxy.prototype.io.__exposedProps__={getResourceUrl:"r"};NotificationsDemo_kango.TabProxy.prototype.event.__exposedProps__={MESSAGE:"r"};
