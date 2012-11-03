/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserTap_kango.BackgroundScriptEngine=function(){};
BrowserTap_kango.BackgroundScriptEngine.prototype={_sandbox:null,_window:null,init:function(a){var b=this;this._sandbox=BrowserTap_kango.lang.createHTMLSandbox("background.html",function(c){b._initScripts(c,a)})},getContext:function(){return this._window},_initScripts:function(a,b){this._window=a;a.kango=b;var c=a.document,d=BrowserTap_kango.getExtensionInfo().background_scripts;if("undefined"!=typeof d){var e=0,f=function(){var a=c.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",BrowserTap_kango.io.getExtensionFileUrl(d[e]));
var b=function(){e++;e<d.length&&f()};"undefined"!=typeof a.onreadystatechange?a.onreadystatechange=function(){"complete"==a.readyState&&b()}:a.onload=b;c.body.appendChild(a)};f()}}};BrowserTap_kango.BackgroundScriptModule=function(){};BrowserTap_kango.BackgroundScriptModule.prototype.init=function(a){BrowserTap_kango.backgroundScript=new BrowserTap_kango.BackgroundScriptEngine;BrowserTap_kango.addEventListener(BrowserTap_kango.event.READY,function(){BrowserTap_kango.backgroundScript.init(a)})};BrowserTap_kango.registerModule(BrowserTap_kango.BackgroundScriptModule);
