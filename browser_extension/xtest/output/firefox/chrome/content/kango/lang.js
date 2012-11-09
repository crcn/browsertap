/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserTap_kango.HTMLSandbox=function(){this._browser=document.getElementById(this._browserId)};BrowserTap_kango.HTMLSandbox.prototype={_browserId:"BrowserTap_kango-background-script-host",_browser:null,create:function(a,b){this._browser.addEventListener("DOMContentLoaded",function(a){b(a.target.defaultView.wrappedJSObject)},!0);this._browser.setAttribute("src",BrowserTap_kango.io.getExtensionFileUrl(a))}};BrowserTap_kango.Lang=function(){};
BrowserTap_kango.Lang.prototype=BrowserTap_kango.oop.extend(BrowserTap_kango.LangBase,{_contentProxyCode:null,makeDataExposed:function(a){a.__exposedProps__=a.__exposedProps__||{};for(var b in a)"__exposedProps__"!=b&&a.hasOwnProperty(b)&&(a.__exposedProps__[b]="wr",null!=a[b]&&BrowserTap_kango.lang.isObject(a[b])&&BrowserTap_kango.lang.makeDataExposed(a[b]));return a},createHTMLSandbox:function(a,b){return(new BrowserTap_kango.HTMLSandbox).create(a,b)},evalInSandbox:function(a,b,d){"undefined"!=typeof b.kango&&(null!=a&&a!=window)&&(b.kango=BrowserTap_kango.browser.getTabProxyForWindow(a));
var a=new Components.utils.Sandbox(a,{sandboxPrototype:a,wantXrays:!0}),c;for(c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);Components.utils.evalInSandbox("(function(){"+d+"\n})();",a)}});BrowserTap_kango.lang=new BrowserTap_kango.Lang;
