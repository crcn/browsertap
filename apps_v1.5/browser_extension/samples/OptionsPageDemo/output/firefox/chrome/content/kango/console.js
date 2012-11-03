/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
OptionsPageDemo_kango.Console=function(){this._consoleService=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService)};OptionsPageDemo_kango.Console.prototype=OptionsPageDemo_kango.oop.extend(OptionsPageDemo_kango.IConsole,{_consoleService:null,log:function(a){1<arguments.length&&(a=OptionsPageDemo_kango.string.format.apply(OptionsPageDemo_kango.string,arguments));this._consoleService.logStringMessage(a)}});OptionsPageDemo_kango.console=new OptionsPageDemo_kango.Console;
