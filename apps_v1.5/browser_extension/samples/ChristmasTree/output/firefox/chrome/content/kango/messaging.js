﻿/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
ChristmasTree_kango.MessageRouter=function(){};ChristmasTree_kango.MessageRouter.prototype={_onMessage:function(a){this.onmessage(a)},onmessage:function(){},dispatchMessage:function(a,b){var c={name:a,data:b,origin:"background",target:ChristmasTree_kango,source:ChristmasTree_kango},d=this;window.setTimeout(function(){d.onmessage(c)},1);return!0}};
