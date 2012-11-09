/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
ChristmasTree_kango.Console=function(){this._consoleService=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService)};ChristmasTree_kango.Console.prototype=ChristmasTree_kango.oop.extend(ChristmasTree_kango.IConsole,{_consoleService:null,log:function(a){1<arguments.length&&(a=ChristmasTree_kango.string.format.apply(ChristmasTree_kango.string,arguments));this._consoleService.logStringMessage(a)}});ChristmasTree_kango.console=new ChristmasTree_kango.Console;
