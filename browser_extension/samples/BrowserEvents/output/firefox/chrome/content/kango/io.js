/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserEvents_kango.IO=function(){};BrowserEvents_kango.IO.prototype=BrowserEvents_kango.oop.extend(BrowserEvents_kango.IOBase,{getExtensionFileUrl:function(a){return"chrome://BrowserEvents_kango/content/"+a},getResourceUrl:function(a){return"resource://BrowserEvents_kango/"+a}});BrowserEvents_kango.io=new BrowserEvents_kango.IO;
