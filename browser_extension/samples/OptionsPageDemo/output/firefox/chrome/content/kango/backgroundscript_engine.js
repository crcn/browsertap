/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
OptionsPageDemo_kango.BackgroundScriptEngine=function(){};
OptionsPageDemo_kango.BackgroundScriptEngine.prototype={_sandbox:null,_window:null,init:function(a){var b=this;this._sandbox=OptionsPageDemo_kango.lang.createHTMLSandbox("background.html",function(c){b._initScripts(c,a)})},getContext:function(){return this._window},_initScripts:function(a,b){this._window=a;a.kango=b;var c=a.document,d=OptionsPageDemo_kango.getExtensionInfo().background_scripts;if("undefined"!=typeof d){var e=0,f=function(){var a=c.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",OptionsPageDemo_kango.io.getExtensionFileUrl(d[e]));
var b=function(){e++;e<d.length&&f()};"undefined"!=typeof a.onreadystatechange?a.onreadystatechange=function(){"complete"==a.readyState&&b()}:a.onload=b;c.body.appendChild(a)};f()}}};OptionsPageDemo_kango.BackgroundScriptModule=function(){};OptionsPageDemo_kango.BackgroundScriptModule.prototype.init=function(a){OptionsPageDemo_kango.backgroundScript=new OptionsPageDemo_kango.BackgroundScriptEngine;OptionsPageDemo_kango.addEventListener(OptionsPageDemo_kango.event.READY,function(){OptionsPageDemo_kango.backgroundScript.init(a)})};OptionsPageDemo_kango.registerModule(OptionsPageDemo_kango.BackgroundScriptModule);
