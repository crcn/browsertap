/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
NotificationsDemo_kango.Console=function(){this._consoleService=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService)};NotificationsDemo_kango.Console.prototype=NotificationsDemo_kango.oop.extend(NotificationsDemo_kango.IConsole,{_consoleService:null,log:function(a){1<arguments.length&&(a=NotificationsDemo_kango.string.format.apply(NotificationsDemo_kango.string,arguments));this._consoleService.logStringMessage(a)}});NotificationsDemo_kango.console=new NotificationsDemo_kango.Console;
