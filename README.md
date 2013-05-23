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
	
Markup/Data-API
--------

You can use the autogrow plugin without extra javascript by specifying data attributes on the textarea element:


	<textarea data-autogrow rows="3">
	
The mere presence of the attribute `data-autogrow` is enough for it to be picked up. There is no need to specify a value.

**Note:** dynamically created elements need to be called manually with javascript, the data-api is only picked up once on DOM-ready event.


See [the demo page](http://petkaantonov.github.io/jQuery-autogrow/) for better overview