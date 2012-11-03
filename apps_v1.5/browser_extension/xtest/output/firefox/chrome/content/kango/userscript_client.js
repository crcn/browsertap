/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserTap_kango.UserscriptEngineClient=function(){};BrowserTap_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;BrowserTap_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new BrowserTap_kango.UserscriptApi(c);a.kango=BrowserTap_kango;BrowserTap_kango.lang.evalInSandbox(c,a,b)}catch(d){BrowserTap_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};BrowserTap_kango.UserscriptApi=function(){};
BrowserTap_kango.UserscriptApi.prototype={};
