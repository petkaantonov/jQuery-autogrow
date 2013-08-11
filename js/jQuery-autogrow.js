/* jshint -W014 */
/**
 * @preserve Copyright (c) 2012 Petka Antonov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(global, $) {
    "use strict";

    var INSTANCE_KEY = "autogrow-instance";

    var clearTimeout = global.clearTimeout,

        className = "autogrow-measure-"+("" + Math.random())
            .replace(/[^0-9]/g, ""),

        slice = [].slice,
        hasProp = {}.hasOwnProperty,
        setTimeout = global.setTimeout;

    var hook = (function(){
        function defineHook( hookKind, hookKey, fnType, fn ) {
            var hooks = $[hookKind],
                hook = hooks[hookKey],
                orig = null;

            if( hook ) {
                orig = hook[fnType];
            }
            else {
                hook = hooks[hookKey] = {};
            }

            if( fnType === "set" ) {
                hook[fnType] = function( elem, value, name ) {
                    var ret;
                    if( orig ) {
                        ret = orig( elem, value, name );
                    }

                    return fn( elem, value, name ) || ret;
                };
            }
            else {
                hook[fnType] = function( elem, name ) {
                    var retOrig, ret;
                    if( orig ) {
                        retOrig = orig( elem, name );
                    }
                    ret = fn( elem, name );
                    return ret === null ? retOrig : ret;
                };
            }

        }

        return {
            define: defineHook,

            GETTER: "get",
            SETTER: "set",

            ATTR: "attrHooks",
            PROP: "propHooks",
            VAL: "valHooks"
        };
    })();

    var boxSizingProp = (function(){
        var props = ["boxSizing", "mozBoxSizing", "webkitBoxSizing"],
            divStyle = document.createElement("div").style;

        for( var i = 0; i < props.length; ++i ) {
            if( props[i] in divStyle ) {
                return props[i];
            }
        }
        return props[0];
    })();

    var measureBaseCss = {
        left: -999999,
        padding: 0,
        height: 1,
        border: "none",
        overflow: "hidden",
        position: "absolute",
        mozBoxSizing: "content-box",
        webkitBoxSizing: "content-box",
        boxSizing: "content-box",
        pointerEvents: "none"
    };

    var fontProps = ("fontWeight fontFamily fontStyle fontSize wordWrap " +
        "lineHeight wordSpacing letterSpacing " +
        "textIndent textTransform").split( " " );

    /**
     * Used to determine whether a hidden measurement textarea
     * is not used by any instance and can therefore be removed
     */
    var CachedTextarea = (function() {
        var method = CachedTextarea.prototype;

        function CachedTextarea() {
            this.counter = 0;
            this.textarea = $("<textarea>", {tabIndex: -1})
                .css( measureBaseCss )
                .addClass( className )
                .appendTo( "body" );
        }

        method.isUsedBy = function( elem ) {
            return $( elem )
                .data( INSTANCE_KEY )
                ._measurement === this.textarea;
        };

        method.isValid = function() {
            return this.counter > 0;
        };

        method.useBy = function( elem ) {
            if( this.isUsedBy( elem ) ) {
                return;
            }
            this.counter++;
            $( elem )
                .data( INSTANCE_KEY )
                ._measurement = this.textarea;
        };

        //Returns true if the cachedtextarea is not used by anything
        //anymore
        method.deuseBy = function( elem ) {
            if( !this.isValid() ) {
                return true;
            }

            if( !this.isUsedBy( elem ) ) {
                return false;
            }
            this.counter--;

            $( elem )
                .data( INSTANCE_KEY )
                ._measurement = null;

            if( !this.isValid() ) {
                this.textarea.remove();
                this.textarea = null;
                return true;
            }
            return false;
        };

        return CachedTextarea;
    })();

    var measurementElement = {

        cache: {},

        //If measurements would be same, don't create another textarea
        hashFor: function ( $elem ) {
            var hash = "";
            for( var i = 0, len = fontProps.length; i < len; ++i ) {
                hash += $elem.css( fontProps[i] );
            }
            return hash;
        },

        applyTo: function( $elem ) {
            var hash = this.hashFor( $elem ),
                cache = this.cache;

            var cachedTextarea = cache[hash];

            if( !cachedTextarea || !cachedTextarea.isValid() ) {
                cache[hash] = cachedTextarea = new CachedTextarea();
            }
            cachedTextarea.useBy( $elem[0] );
        },

        removeFrom: function( $elem ) {
            var hash = this.hashFor( $elem ),
                cache = this.cache;

            var cachedTextarea = cache[hash];

            //Font properties are not changed and element can be found
            //by hash
            if( cachedTextarea && cachedTextarea.isUsedBy( $elem[0] ) ) {
                if( cachedTextarea.deuseBy( $elem[0] ) ) {
                    delete cache[hash];
                }
            }
            else {
                for( var key in cache ) {
                    if( hasProp.call( cache, key ) ) {
                        cachedTextarea = cache[key];
                        if( cachedTextarea.deuseBy( $elem[0] ) ) {
                            delete cache[key];
                        }
                    }
                }
            }
        }
    };

    function numericCss( $elem, key ) {
        return parseInt( $elem.css( key ), 10 ) || 0;
    }

    function isBorderBox( $elem ) {
        return $elem.css( boxSizingProp ) === "border-box";
    }

    function getWidth( $elem ) {
        if( isBorderBox( $elem ) ) {
            return numericCss( $elem, "width" );
        }
        else {
            return $elem[0].offsetWidth ? $elem.width() : 0;
        }
    }

    function getHeight( $elem ) {
        if( isBorderBox( $elem ) ) {
            return numericCss( $elem, "height" );
        }
        else {
            return $elem[0].offsetHeight ? $elem.height() : 0;
        }
    }

    function getHeightWithoutText( $elem ) {
        var elem = $elem[0];
        var text = elem.value;
        var height = elem.style.height;
        elem.style.height = "";
        elem.value = "";
        var ret = getHeight( $elem );
        elem.style.height = height;
        elem.value = text;
        return ret;
    }

    //Get the additional height for border-boxes
    function getAdditionalHeight( $elem ) {
        return numericCss( $elem, "paddingTop" ) +
                numericCss( $elem, "paddingBottom") +
                numericCss( $elem, "borderTopWidth" ) +
                numericCss( $elem, "borderBottomWidth" );
    }

    function debounce( fn, time, ctx ) {
        var timerId = 0;
        var ret = function() {
            clearTimeout( timerId );
            var self = ctx || this,
                args = slice.call( arguments );

            timerId = setTimeout( function() {
                fn.apply( self, args );
            }, time );
        };

        ret.cancel = function() {
            clearTimeout( timerId );
        };
        return ret;
    }

    var Autogrow = (function() {
        var method = Autogrow.prototype;

        function Autogrow( elem ) {
            this._elem = $(elem);
            this._measurement = null;
            this._baseHeight = -1;
            this._lastHeight = 0;
            this._additionalHeight = 0;
            this._oninput = debounce( this._oninput, 13, this );
            this._elem.on(
                "cut.autogrow input.autogrow paste.autogrow " +
                "mouseup.autogrow keydown.autogrow keyup.autogrow " +
                "keypress.autogrow",
                this._oninput
            );

            this._elem.on( "destroy.autogrow", $.proxy( this.destroy, this ) );
        }

        method._oninput = function() {
            if( this._baseHeight <= 0 ) {
                this._baseHeight = getHeightWithoutText( this._elem );
                if( isBorderBox( this._elem ) ) {
                    this._additionalHeight = getAdditionalHeight( this._elem );
                }
                else {
                    this._additionalHeight = 0;
                }
            }
            if( this._baseHeight > 0 ) {
                var height = this._measureHeight(),
                    maxHeight = Math.max( this._baseHeight, height ) +
                        this._additionalHeight;

                if( maxHeight !== this._lastHeight ) {
                    this._lastHeight = maxHeight;
                    this._elem.css( "height", maxHeight );
                }
            }
        };

        method._measureHeight = function() {
            this._measurement
                .css( "width", getWidth( this._elem ) )
                .val(this._elem.val() + "\uff2d\uff2d\uff2d\uff2d");

            return this._measurement.prop( "scrollHeight" ) | 0;
        };

        method._refresh = function() {
            if( this._measurement != null ) {
                measurementElement.removeFrom( this._elem );
            }
            measurementElement.applyTo( this._elem );

            for( var i = 0; i < fontProps.length; ++i ) {
                this._measurement.css(
                    fontProps[i],
                    this._elem.css( fontProps[i] )
                );
            }

            if( isBorderBox( this._elem ) ) {
                this._additionalHeight = getAdditionalHeight( this._elem );
            }
            else {
                this._additionalHeight = 0;
            }
            this._baseHeight = -1;
            this._lastHeight = getHeight( this._elem );
        };

        //If font sizes or such are changed dynamically then this needs
        //to be called by clients
        method.refresh = function() {
            this._refresh();
        };

        method.destroy = function() {
            measurementElement.removeFrom( this._elem );
            this._oninput.cancel();
            this._elem.removeData( INSTANCE_KEY );
            this._elem.off( ".autogrow" );
            this._elem = null;
        };

        var setter = function( elem, value ) {
            var instance = $.data( elem, INSTANCE_KEY );
            if( !instance ) {
                return;
            }
            elem.value = value;
            this._oninput();
            return true;
        };

        hook.define( hook.VAL, "textarea", hook.SETTER, setter );

        return Autogrow;
    })();

    var old = $.fn.autogrow;
    var plugin;
    plugin = $.fn.autogrow = function( option ) {
        var args = [].slice.call( arguments, 1 );
        return this.filter( "textarea" ).each( function() {

            var $this = $( this ),
                data = $this.data( INSTANCE_KEY );

            if( $this.hasClass( className ) ) {
                return;
            }

            if( !data ) {
                $this.data( INSTANCE_KEY, ( data = new Autogrow( this ) ) );
                data.refresh();
            }
            if( typeof option === "string" &&
                option.charAt(0) !== "_" &&
                typeof data[option] === "function" ) {
                data[option].apply( data, args );
            }
        });
    };

    plugin.Constructor = Autogrow;

    plugin.noConflict = function() {
        $.fn.autogrow = old;
        return plugin;
    };

    plugin.refresh = function() {
        $( "textarea[data-autogrow]" ).autogrow();
    };

    $( plugin.refresh );

    $.ajaxPrefilter( function( o, oo, jqxhr ) {
        (jqxhr.complete || jqxhr.always)( plugin.refresh );
    });

})(this, this.jQuery);