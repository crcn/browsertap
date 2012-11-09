/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
ChristmasTree_kango.ui.OptionsPage=function(){var a=ChristmasTree_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=ChristmasTree_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();ChristmasTree_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=ChristmasTree_kango)})}};
ChristmasTree_kango.ui.OptionsPage.prototype=ChristmasTree_kango.oop.extend(ChristmasTree_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);ChristmasTree_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});ChristmasTree_kango.ui.optionsPage=new ChristmasTree_kango.ui.OptionsPage;
