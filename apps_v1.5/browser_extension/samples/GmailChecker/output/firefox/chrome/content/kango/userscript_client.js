/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
GmailnChecker_kango.UserscriptEngineClient=function(){};GmailnChecker_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;GmailnChecker_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new GmailnChecker_kango.UserscriptApi(c);a.kango=GmailnChecker_kango;GmailnChecker_kango.lang.evalInSandbox(c,a,b)}catch(d){GmailnChecker_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};GmailnChecker_kango.UserscriptApi=function(){};
GmailnChecker_kango.UserscriptApi.prototype={};
