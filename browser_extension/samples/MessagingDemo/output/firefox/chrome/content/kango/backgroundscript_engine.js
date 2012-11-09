/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
MessagingDemo_kango.BackgroundScriptEngine=function(){};
MessagingDemo_kango.BackgroundScriptEngine.prototype={_sandbox:null,_window:null,init:function(a){var b=this;this._sandbox=MessagingDemo_kango.lang.createHTMLSandbox("background.html",function(c){b._initScripts(c,a)})},getContext:function(){return this._window},_initScripts:function(a,b){this._window=a;a.kango=b;var c=a.document,d=MessagingDemo_kango.getExtensionInfo().background_scripts;if("undefined"!=typeof d){var e=0,f=function(){var a=c.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",MessagingDemo_kango.io.getExtensionFileUrl(d[e]));
var b=function(){e++;e<d.length&&f()};"undefined"!=typeof a.onreadystatechange?a.onreadystatechange=function(){"complete"==a.readyState&&b()}:a.onload=b;c.body.appendChild(a)};f()}}};MessagingDemo_kango.BackgroundScriptModule=function(){};MessagingDemo_kango.BackgroundScriptModule.prototype.init=function(a){MessagingDemo_kango.backgroundScript=new MessagingDemo_kango.BackgroundScriptEngine;MessagingDemo_kango.addEventListener(MessagingDemo_kango.event.READY,function(){MessagingDemo_kango.backgroundScript.init(a)})};MessagingDemo_kango.registerModule(MessagingDemo_kango.BackgroundScriptModule);
