/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
PopupDemo_kango.BackgroundScriptEngine=function(){};
PopupDemo_kango.BackgroundScriptEngine.prototype={_sandbox:null,_window:null,init:function(a){var b=this;this._sandbox=PopupDemo_kango.lang.createHTMLSandbox("background.html",function(c){b._initScripts(c,a)})},getContext:function(){return this._window},_initScripts:function(a,b){this._window=a;a.kango=b;var c=a.document,d=PopupDemo_kango.getExtensionInfo().background_scripts;if("undefined"!=typeof d){var e=0,f=function(){var a=c.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",PopupDemo_kango.io.getExtensionFileUrl(d[e]));
var b=function(){e++;e<d.length&&f()};"undefined"!=typeof a.onreadystatechange?a.onreadystatechange=function(){"complete"==a.readyState&&b()}:a.onload=b;c.body.appendChild(a)};f()}}};PopupDemo_kango.BackgroundScriptModule=function(){};PopupDemo_kango.BackgroundScriptModule.prototype.init=function(a){PopupDemo_kango.backgroundScript=new PopupDemo_kango.BackgroundScriptEngine;PopupDemo_kango.addEventListener(PopupDemo_kango.event.READY,function(){PopupDemo_kango.backgroundScript.init(a)})};PopupDemo_kango.registerModule(PopupDemo_kango.BackgroundScriptModule);
