$(document).ready(function() {
	injectSignupForms();
	injectAllFeatures();
	injectHoverStates();
})


function injectSignupForms() {
	$("#join-alpha-top,#join-alpha-bottom").html($("[data-templateName='signup-form']").html());
}

//this is TEMPORARY! 
function injectAllFeatures() {


	var features = {

		"Test across multiple browsers (30+)": true,
		"Browser Developer Tools": true,
		"Automated Layout Testing": false,
		"Automated Interactive Testing": false,

		"No Installation Required": true,
		"Browser extensions & bookmarklet": true,
		"Localhost Support": true,
		"Android Testing": false,

		"1-Click Testing": true,
		"History Support (back & forward)": false,
		"iPhone Testing": false,

		"Clipboard Support (copy & paste)": true,
		"Real IE browsers (not IETester)": false,
		"Mac Testing (of Mac browsers)": false,

		"Drag & drop file support": false,
		"Keyboard Shortcuts": true,
		"PC Testing (of PC browsers)": true,

		"Sceenshot Testing": false,
		"Responsive Testing": true,
		"Linux Testing (of Linux browsers)": false,
		
		"Parallel Testing": true,
		"Audio Support": false,
		"Natural Scrolling": false,
		"Emulator API": false,
		"Live Browser Reloads": false,
		"Screensharing & Team Collaboration": false,
		"Web Camera Support": false
	};

	$allFeatures = $("#all-features");

	for(var name in features) {
		var implemented = features[name];

		$allFeatures.append(
			'<div class="bt-extra-feature">\
				<span class="fextra-' + (Number(implemented)) + '">&#' + (implemented ? "10004" : "10007") + ';</span>\
				' + name + '\
			</div>'
		);
	}

}

function injectHoverStates() {
	var $current, 
	ignoreTimer, 
	$btMidIcons = $(".bt-mid-icon"), 
	n = $btMidIcons.length,
	$selector = $("#bt-icon-selector"),
	$midBg = $("#bt-mid-bg");

	function select($c) {
		if($current) $current.removeClass("bt-mid-icon-selected");
		$current = $c;
		$selector.css({"visibility":"visible"}).transit({ left: $c.position().left + 25 }, 200);
		$c.addClass("bt-mid-icon-selected");

		loadImage($c.attr("data-shot"), function(img) {
			$midBg.find("img").remove();
			$midBg.append(img);
		});
	}


	$btMidIcons.hover(_.throttle(function() {
		select($(this));
	}, 100));

	$("#bt-mid-hud").mouseover(function() {
		ignoreTimer = true;
	});

	$("#bt-mid-hud").mouseout(function() {
		ignoreTimer = false;
	});

	setInterval(function() {
		if(ignoreTimer) return;
		var ci = ($current.index() + 1) % n;
		select($($btMidIcons[ci]));
	}, 3000);

	select($($(".bt-mid-icon")[0]));
}

function loadImage(url, cb) {
	$("<img src=\""+url+"\" />").load(function() {
		cb($(this));
	})
}