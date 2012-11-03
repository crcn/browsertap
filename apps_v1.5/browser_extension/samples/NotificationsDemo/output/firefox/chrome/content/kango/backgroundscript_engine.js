/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
NotificationsDemo_kango.BackgroundScriptEngine=function(){};
NotificationsDemo_kango.BackgroundScriptEngine.prototype={_sandbox:null,_window:null,init:function(a){var b=this;this._sandbox=NotificationsDemo_kango.lang.createHTMLSandbox("background.html",function(c){b._initScripts(c,a)})},getContext:function(){return this._window},_initScripts:function(a,b){this._window=a;a.kango=b;var c=a.document,d=NotificationsDemo_kango.getExtensionInfo().background_scripts;if("undefined"!=typeof d){var e=0,f=function(){var a=c.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",NotificationsDemo_kango.io.getExtensionFileUrl(d[e]));
var b=function(){e++;e<d.length&&f()};"undefined"!=typeof a.onreadystatechange?a.onreadystatechange=function(){"complete"==a.readyState&&b()}:a.onload=b;c.body.appendChild(a)};f()}}};NotificationsDemo_kango.BackgroundScriptModule=function(){};NotificationsDemo_kango.BackgroundScriptModule.prototype.init=function(a){NotificationsDemo_kango.backgroundScript=new NotificationsDemo_kango.BackgroundScriptEngine;NotificationsDemo_kango.addEventListener(NotificationsDemo_kango.event.READY,function(){NotificationsDemo_kango.backgroundScript.init(a)})};NotificationsDemo_kango.registerModule(NotificationsDemo_kango.BackgroundScriptModule);
