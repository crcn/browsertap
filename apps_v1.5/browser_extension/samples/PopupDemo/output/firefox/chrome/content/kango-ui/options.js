/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
PopupDemo_kango.ui.OptionsPage=function(){var a=PopupDemo_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=PopupDemo_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();PopupDemo_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=PopupDemo_kango)})}};
PopupDemo_kango.ui.OptionsPage.prototype=PopupDemo_kango.oop.extend(PopupDemo_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);PopupDemo_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});PopupDemo_kango.ui.optionsPage=new PopupDemo_kango.ui.OptionsPage;
