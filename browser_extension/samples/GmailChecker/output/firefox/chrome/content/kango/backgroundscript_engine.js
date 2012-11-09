/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
GmailnChecker_kango.BackgroundScriptEngine=function(){};
GmailnChecker_kango.BackgroundScriptEngine.prototype={_sandbox:null,_window:null,init:function(a){var b=this;this._sandbox=GmailnChecker_kango.lang.createHTMLSandbox("background.html",function(c){b._initScripts(c,a)})},getContext:function(){return this._window},_initScripts:function(a,b){this._window=a;a.kango=b;var c=a.document,d=GmailnChecker_kango.getExtensionInfo().background_scripts;if("undefined"!=typeof d){var e=0,f=function(){var a=c.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",GmailnChecker_kango.io.getExtensionFileUrl(d[e]));
var b=function(){e++;e<d.length&&f()};"undefined"!=typeof a.onreadystatechange?a.onreadystatechange=function(){"complete"==a.readyState&&b()}:a.onload=b;c.body.appendChild(a)};f()}}};GmailnChecker_kango.BackgroundScriptModule=function(){};GmailnChecker_kango.BackgroundScriptModule.prototype.init=function(a){GmailnChecker_kango.backgroundScript=new GmailnChecker_kango.BackgroundScriptEngine;GmailnChecker_kango.addEventListener(GmailnChecker_kango.event.READY,function(){GmailnChecker_kango.backgroundScript.init(a)})};GmailnChecker_kango.registerModule(GmailnChecker_kango.BackgroundScriptModule);
