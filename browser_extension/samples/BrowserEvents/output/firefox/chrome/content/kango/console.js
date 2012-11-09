/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserEvents_kango.Console=function(){this._consoleService=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService)};BrowserEvents_kango.Console.prototype=BrowserEvents_kango.oop.extend(BrowserEvents_kango.IConsole,{_consoleService:null,log:function(a){1<arguments.length&&(a=BrowserEvents_kango.string.format.apply(BrowserEvents_kango.string,arguments));this._consoleService.logStringMessage(a)}});BrowserEvents_kango.console=new BrowserEvents_kango.Console;
