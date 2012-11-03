/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
OptionsPageDemo_kango.ui.OptionsPage=function(){var a=OptionsPageDemo_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=OptionsPageDemo_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();OptionsPageDemo_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=OptionsPageDemo_kango)})}};
OptionsPageDemo_kango.ui.OptionsPage.prototype=OptionsPageDemo_kango.oop.extend(OptionsPageDemo_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);OptionsPageDemo_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});OptionsPageDemo_kango.ui.optionsPage=new OptionsPageDemo_kango.ui.OptionsPage;
