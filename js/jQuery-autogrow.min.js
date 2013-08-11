/*
 Copyright (c) 2012 Petka Antonov

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
(function(p,d){function g(a,c){return parseInt(a.css(c),10)||0}function l(a){return"border-box"===a.css(v)}function q(a){return l(a)?g(a,"height"):a[0].offsetHeight?a.height():0}function r(a){return g(a,"paddingTop")+g(a,"paddingBottom")+g(a,"borderTopWidth")+g(a,"borderBottomWidth")}function w(a,c,b){var e=0,d=function(){s(e);var d=b||this,h=x.call(arguments);e=y(function(){a.apply(d,h)},c)};d.cancel=function(){s(e)};return d}var s=p.clearTimeout,t="autogrow-measure-"+(""+Math.random()).replace(/[^0-9]/g,
""),x=[].slice,z={}.hasOwnProperty,y=p.setTimeout,m=function(){return{define:function(a,c,b,e){a=d[a];var h=a[c],f=null;h?f=h[b]:h=a[c]={};h[b]="set"===b?function(b,a,c){var d;f&&(d=f(b,a,c));return e(b,a,c)||d}:function(b,a){var c,d;f&&(c=f(b,a));d=e(b,a);return null===d?c:d}},GETTER:"get",SETTER:"set",ATTR:"attrHooks",PROP:"propHooks",VAL:"valHooks"}}(),v=function(){for(var a=["boxSizing","mozBoxSizing","webkitBoxSizing"],c=document.createElement("div").style,b=0;b<a.length;++b)if(a[b]in c)return a[b];
return a[0]}(),A={left:-999999,padding:0,height:1,border:"none",overflow:"hidden",position:"absolute",mozBoxSizing:"content-box",webkitBoxSizing:"content-box",boxSizing:"content-box",pointerEvents:"none"},k="fontWeight fontFamily fontStyle fontSize wordWrap lineHeight wordSpacing letterSpacing textIndent textTransform".split(" "),B=function(){function a(){this.counter=0;this.textarea=d("<textarea>",{tabIndex:-1}).css(A).addClass(t).appendTo("body")}var c=a.prototype;c.isUsedBy=function(b){return d(b).data("autogrow-instance")._measurement===
this.textarea};c.isValid=function(){return 0<this.counter};c.useBy=function(b){this.isUsedBy(b)||(this.counter++,d(b).data("autogrow-instance")._measurement=this.textarea)};c.deuseBy=function(b){if(!this.isValid())return!0;if(!this.isUsedBy(b))return!1;this.counter--;d(b).data("autogrow-instance")._measurement=null;return this.isValid()?!1:(this.textarea.remove(),this.textarea=null,!0)};return a}(),n={cache:{},hashFor:function(a){for(var c="",b=0,e=k.length;b<e;++b)c+=a.css(k[b]);return c},applyTo:function(a){var c=
this.hashFor(a),b=this.cache,e=b[c];e&&e.isValid()||(b[c]=e=new B);e.useBy(a[0])},removeFrom:function(a){var c=this.hashFor(a),b=this.cache,e=b[c];if(e&&e.isUsedBy(a[0]))e.deuseBy(a[0])&&delete b[c];else for(var d in b)z.call(b,d)&&(e=b[d],e.deuseBy(a[0])&&delete b[d])}},u=function(){function a(b){this._elem=d(b);this._measurement=null;this._baseHeight=-1;this._additionalHeight=this._lastHeight=0;this._oninput=w(this._oninput,13,this);this._elem.on("cut.autogrow input.autogrow paste.autogrow mouseup.autogrow keydown.autogrow keyup.autogrow keypress.autogrow",
this._oninput);this._elem.on("destroy.autogrow",d.proxy(this.destroy,this))}var c=a.prototype;c._oninput=function(){if(0>=this._baseHeight){var b=this._elem,a=b[0],c=a.value,d=a.style.height;a.style.height="";a.value="";b=q(b);a.style.height=d;a.value=c;this._baseHeight=b;l(this._elem)?this._additionalHeight=r(this._elem):this._additionalHeight=0}0<this._baseHeight&&(a=this._measureHeight(),a=Math.max(this._baseHeight,a)+this._additionalHeight,a!==this._lastHeight&&(this._lastHeight=a,this._elem.css("height",
a)))};c._measureHeight=function(){this._measurement.css("width",l(this._elem)?g(this._elem,"width"):this._elem[0].offsetWidth?this._elem.width():0).val(this._elem.val()+"ＭＭＭＭ");return this._measurement.prop("scrollHeight")|0};c._refresh=function(){null!=this._measurement&&n.removeFrom(this._elem);n.applyTo(this._elem);for(var a=0;a<k.length;++a)this._measurement.css(k[a],this._elem.css(k[a]));l(this._elem)?this._additionalHeight=r(this._elem):this._additionalHeight=0;this._baseHeight=-1;this._lastHeight=
q(this._elem)};c.refresh=function(){this._refresh()};c.destroy=function(){n.removeFrom(this._elem);this._oninput.cancel();this._elem.removeData("autogrow-instance");this._elem.off(".autogrow");this._elem=null};m.define(m.VAL,"textarea",m.SETTER,function(a,c){if(d.data(a,"autogrow-instance"))return a.value=c,this._oninput(),!0});return a}(),C=d.fn.autogrow,f;f=d.fn.autogrow=function(a){var c=[].slice.call(arguments,1);return this.filter("textarea").each(function(){var b=d(this),e=b.data("autogrow-instance");
b.hasClass(t)||(e||(b.data("autogrow-instance",e=new u(this)),e.refresh()),"string"===typeof a&&("_"!==a.charAt(0)&&"function"===typeof e[a])&&e[a].apply(e,c))})};f.Constructor=u;f.noConflict=function(){d.fn.autogrow=C;return f};f.refresh=function(){d("textarea[data-autogrow]").autogrow()};d(f.refresh);d.ajaxPrefilter(function(a,c,b){(b.complete||b.always)(f.refresh)})})(this,this.jQuery);
