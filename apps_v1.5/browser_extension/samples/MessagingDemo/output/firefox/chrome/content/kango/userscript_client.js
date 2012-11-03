/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
MessagingDemo_kango.UserscriptEngineClient=function(){};MessagingDemo_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;MessagingDemo_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new MessagingDemo_kango.UserscriptApi(c);a.kango=MessagingDemo_kango;MessagingDemo_kango.lang.evalInSandbox(c,a,b)}catch(d){MessagingDemo_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};MessagingDemo_kango.UserscriptApi=function(){};
MessagingDemo_kango.UserscriptApi.prototype={};
