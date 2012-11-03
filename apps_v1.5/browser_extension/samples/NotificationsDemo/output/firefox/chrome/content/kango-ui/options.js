/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
NotificationsDemo_kango.ui.OptionsPage=function(){var a=NotificationsDemo_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=NotificationsDemo_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();NotificationsDemo_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=NotificationsDemo_kango)})}};
NotificationsDemo_kango.ui.OptionsPage.prototype=NotificationsDemo_kango.oop.extend(NotificationsDemo_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);NotificationsDemo_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});NotificationsDemo_kango.ui.optionsPage=new NotificationsDemo_kango.ui.OptionsPage;
