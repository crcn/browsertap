/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserEvents_kango.BackgroundScriptEngine=function(){};
BrowserEvents_kango.BackgroundScriptEngine.prototype={_sandbox:null,_window:null,init:function(a){var b=this;this._sandbox=BrowserEvents_kango.lang.createHTMLSandbox("background.html",function(c){b._initScripts(c,a)})},getContext:function(){return this._window},_initScripts:function(a,b){this._window=a;a.kango=b;var c=a.document,d=BrowserEvents_kango.getExtensionInfo().background_scripts;if("undefined"!=typeof d){var e=0,f=function(){var a=c.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",BrowserEvents_kango.io.getExtensionFileUrl(d[e]));
var b=function(){e++;e<d.length&&f()};"undefined"!=typeof a.onreadystatechange?a.onreadystatechange=function(){"complete"==a.readyState&&b()}:a.onload=b;c.body.appendChild(a)};f()}}};BrowserEvents_kango.BackgroundScriptModule=function(){};BrowserEvents_kango.BackgroundScriptModule.prototype.init=function(a){BrowserEvents_kango.backgroundScript=new BrowserEvents_kango.BackgroundScriptEngine;BrowserEvents_kango.addEventListener(BrowserEvents_kango.event.READY,function(){BrowserEvents_kango.backgroundScript.init(a)})};BrowserEvents_kango.registerModule(BrowserEvents_kango.BackgroundScriptModule);
