var img_path = "../../src/img/";
var icplus = "drill_plus.png";
var icminus = "drill_minus.png";

var ic_plus = img_path + icplus;
var ic_minus = img_path + icminus;

(function ($) {

    $.fn.qtree = function ( options ) {
		
		var opts = $.extend( {}, $.fn.qtree.defaults, options);
		
        this.find("li:has(ul) > span").on("click", function () {
            $(this).parent().find("ul:first > li").toggle();
            toggleIcon($(this).parent());
        });

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
		
        this.find("li:has(ul) > span").parent().css('background-image', 'url(' + ic_plus + ')');

        this.find("li").on("click", function (e) {
            e.stopPropagation();
            var spanSelected = $(this).find("span").first();
            if (spanSelected.hasClass('selected')) {
                spanSelected.removeClass('selected');
            }
            else {
                spanSelected.addClass('selected');
            }
        });
    };

} (jQuery));

$.fn.qtree.defaults = {
	draggable: false
};

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
	
	console.log(result);
}

function toggleIcon(el) {
    if (el.css('background-image').toLowerCase().indexOf(icplus.toLowerCase()) > 0) {
        el.css('background-image', 'url(' + ic_minus + ')');
    }
    else {
        el.css('background-image', 'url(' + ic_plus + ')');
    }
}