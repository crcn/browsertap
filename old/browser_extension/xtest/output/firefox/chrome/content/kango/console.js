/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserTap_kango.Console=function(){this._consoleService=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService)};BrowserTap_kango.Console.prototype=BrowserTap_kango.oop.extend(BrowserTap_kango.IConsole,{_consoleService:null,log:function(a){1<arguments.length&&(a=BrowserTap_kango.string.format.apply(BrowserTap_kango.string,arguments));this._consoleService.logStringMessage(a)}});BrowserTap_kango.console=new BrowserTap_kango.Console;
