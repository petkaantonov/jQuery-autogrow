Textarea autogrow plugin for jQuery, automatically grows and shrinks textareas according to content size. View [demo page](http://petkaantonov.github.io/jQuery-autogrow/).
Minimal configuration jQuery plugin with data api.

Usage
-----

The autogrow can only be called on textarea elements

    $('textarea').autogrow()
    
Methods
-------

__.autogrow("destroy")__
Destroy the autogrow enhancement from a textarea element. Needs to be called
when you are about to remove the target textarea, otherwise memory will be leaked.

    $("#comment-textarea").autogrow("destroy");

You can also just trigger the event `"destroy"` on the target element

    $("#comment-textarea").trigger("destroy")
    
This way you don't have to remember which plugins to destroy when you remove the element.
    
Markup/Data-API
--------

You can use the autogrow plugin without extra javascript by specifying data attributes on the textarea element:


    <textarea data-autogrow rows="3">
    
The mere presence of the attribute `data-autogrow` is enough for it to be picked up. There is no need to specify a value.

**Note**: dynamically created elements need to be called manually with js. You may also call `$.fn.autogrow.refresh()` at any point to instantiate any
uninitialized `data-autogrow` inputs. It is automatically called once on DOM ready event which makes the data API work.


See [the demo page](http://petkaantonov.github.io/jQuery-autogrow/demo.html) for better overview

Building
----------

Building requires [Closure Compiler](http://dl.google.com/closure-compiler/compiler-latest.zip) to be placed
one directory up from the project in `closure_compiler` directory.

The setting is in `Gruntfile.js`, expressed as `closurePath: '../closure_compiler'`

Clone or download the repository, and while in the project root, run:

    npm install
    grunt
    
Builds will appear in the `/js` folder. The source code cannot be ran directly without building.