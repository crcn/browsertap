/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
BrowserEvents_kango.UserscriptEngineClient=function(){};BrowserEvents_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;BrowserEvents_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new BrowserEvents_kango.UserscriptApi(c);a.kango=BrowserEvents_kango;BrowserEvents_kango.lang.evalInSandbox(c,a,b)}catch(d){BrowserEvents_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};BrowserEvents_kango.UserscriptApi=function(){};
BrowserEvents_kango.UserscriptApi.prototype={};
