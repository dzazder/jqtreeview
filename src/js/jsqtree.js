(function ($) {

    $.fn.qtree = function ( options ) {
		// read default options
		var opts = $.extend( {}, $.fn.qtree.defaults, options);
		
		// set plus icon within sublists
		var faiconplus = 'fa-plus';
		if (opts.faicon.length > 0) {
			faiconplus += '-' + opts.faicon;
		}
		this.find('li:has(ul) > span').before('<i class="fa ' + faiconplus + ' qtree-drill" aria-hidden="true"></i>');
		this.find('li:not(:has(ul)) > span').before('<i class="fa fa-circle invisible" aria-hidden="true"></i>');
		
		// click action on drill icon
		this.find('li:has(ul) > i.qtree-drill').on('click', function(e) {
			e.stopPropagation();
			$(this).parent().find('ul:first > li').toggle();
			toggleIcon($(this), opts.faicon);
		});
		
		// click action if option is enabled
		if (opts.clickaction) {
			switch (opts.clickaction) {
				case 'select': 	// element will be mark as selected
					this.find('li').on('click', function (e) {
						e.stopPropagation();
						var liselected = $(this);
						if (liselected.hasClass('selected')) {
							liselected.removeClass('selected');
							liselected.find('li').each(function() {
								$(this).removeClass('selected');
							});
						}
						else {
							liselected.addClass('selected');
							liselected.find('li').each(function() {
								$(this).addClass('selected');
							});
						}
					});
					break;
				case 'drill':	// sublist will be show/hide
					this.find('li').on('click', function (e) {
						e.stopPropagation();
						$(this).find('ul:first > li').toggle();
						toggleIcon($(this).find('i.qtree-drill').first(), opts.faicon);
					});
					break;
			}
			
		}
		
		// draggable options if enabled
		if (opts.draggable) {
			this.find("li").draggable({ revert: true, helper: "clone" });
			this.parent().droppable({
				accept: "li",
				classes: {
					"ui-droppable-active": "ui-state-active",
					"ui-droppable-hover": "ui-state-hover"
				},
				drop: function(event, ui) {
					createList(ui.draggable);
					$(this).find('ul.qtree').append(ui.draggable.clone(true));
				}
			});
		}
		
		// li class option is enabled
		if (opts.liclass) {
			this.find('li').addClass(opts.liclass);
		}
    };

} (jQuery));

// default values
$.fn.qtree.defaults = {
	draggable: false,
	clickaction: 'nothing',	// available values: nothing, select, drill
	faicon: '',
	drillIcons: '',
	liclass: 'default'
};

// create list function after drop of draggable element
function createList(el) {
	var newList = [];
	el.parents('li').each(function() {
		if ($(this).is('.qtree')) {
			return;
		}
		newList.push(this);
	});
	
	var result;
	if (newList.length > 0) {
		result = newList[newList.length - 1];
		console.log(result);
		for (var i = newList.length - 2; i >= 0; i--) {
			result.find('ul').last().append(newList[i]);
		}
		result.find('ul').last().append(el);
	}
	else {
		result = el;
	}
}

// toggle drill icon function
function toggleIcon(el, faicon) {
	var icplus = 'fa-plus';
	var icminus = 'fa-minus';
	if (faicon.length > 0) {
		icplus += '-' + faicon;
		icminus += '-' + faicon;
	}
	
	if (el.hasClass(icplus)) {
		el.removeClass(icplus);
		el.addClass(icminus);
	}
	else {
		el.removeClass(icminus);
		el.addClass(icplus);
	}
}