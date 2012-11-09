/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
MessagingDemo_kango.Console=function(){this._consoleService=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService)};MessagingDemo_kango.Console.prototype=MessagingDemo_kango.oop.extend(MessagingDemo_kango.IConsole,{_consoleService:null,log:function(a){1<arguments.length&&(a=MessagingDemo_kango.string.format.apply(MessagingDemo_kango.string,arguments));this._consoleService.logStringMessage(a)}});MessagingDemo_kango.console=new MessagingDemo_kango.Console;
