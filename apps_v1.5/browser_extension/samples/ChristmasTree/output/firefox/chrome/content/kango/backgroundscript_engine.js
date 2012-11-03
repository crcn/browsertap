/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
ChristmasTree_kango.BackgroundScriptEngine=function(){};
ChristmasTree_kango.BackgroundScriptEngine.prototype={_sandbox:null,_window:null,init:function(a){var b=this;this._sandbox=ChristmasTree_kango.lang.createHTMLSandbox("background.html",function(c){b._initScripts(c,a)})},getContext:function(){return this._window},_initScripts:function(a,b){this._window=a;a.kango=b;var c=a.document,d=ChristmasTree_kango.getExtensionInfo().background_scripts;if("undefined"!=typeof d){var e=0,f=function(){var a=c.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",ChristmasTree_kango.io.getExtensionFileUrl(d[e]));
var b=function(){e++;e<d.length&&f()};"undefined"!=typeof a.onreadystatechange?a.onreadystatechange=function(){"complete"==a.readyState&&b()}:a.onload=b;c.body.appendChild(a)};f()}}};ChristmasTree_kango.BackgroundScriptModule=function(){};ChristmasTree_kango.BackgroundScriptModule.prototype.init=function(a){ChristmasTree_kango.backgroundScript=new ChristmasTree_kango.BackgroundScriptEngine;ChristmasTree_kango.addEventListener(ChristmasTree_kango.event.READY,function(){ChristmasTree_kango.backgroundScript.init(a)})};ChristmasTree_kango.registerModule(ChristmasTree_kango.BackgroundScriptModule);
