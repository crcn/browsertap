/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
PopupDemo_kango.Console=function(){this._consoleService=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService)};PopupDemo_kango.Console.prototype=PopupDemo_kango.oop.extend(PopupDemo_kango.IConsole,{_consoleService:null,log:function(a){1<arguments.length&&(a=PopupDemo_kango.string.format.apply(PopupDemo_kango.string,arguments));this._consoleService.logStringMessage(a)}});PopupDemo_kango.console=new PopupDemo_kango.Console;
