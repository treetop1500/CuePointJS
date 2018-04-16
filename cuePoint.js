// JavaScript Document
// modified from:
// https://raw.githubusercontent.com/brown339/CuePointJS/master/cuePoint.js


(function ( $ ) {
    $.fn.cuePoint = function (div, options) {
        // defaults
        var settings = $.extend ({
        }, options);

        var video = $(this).get(0);

        // Append divs for time, text
        var points = options["points"];
        for (var i = 0; i < points.length; i++) {
            var startTime = points[i]["time"]["start"];
            var endTime = points[i]["time"]["end"];
            var text = points[i]["text"];
            var playback = (points[i]["playback"]) ? points[i]["playback"] : "play";
            $(div).append("<div data-time-start='"+startTime+"' data-time-end='"+endTime+"' data-text='"+text+"' data-playback='"+playback+"'>" + points[i]["text"] + "</div>");
        }

        console.log(points);

        // Click functionality
        $(div + " div").click(function () {
            // Jump to cue point
            video.currentTime = timeToSeconds ($(this).data("time"));

            // Play/pause
            if ($(this).data("playback") === "play") {
                video.play();
            }

            else if ($(this).data("playback") === "pause") {
                video.pause();
            }

            // Default
            else {
                video.play();
            }

            // Active css
            $(this).addClass(options.active);
            $(this).removeClass(options.inactive);
        });


        function init() {
            $(div + " div").each (function () {
                $(this).addClass(options.inactive);
                $(this).removeClass(options.active);
            });
            if(options.loop) {
                video.play();
            }
        }

        video.addEventListener("ended", function() {
            init();
        }, true);

        // Highlight current card
        video.ontimeupdate = function () {
            $(div + " div").each (function () {

                if (video.currentTime >= timeToSeconds($(this).data("time-start")) && video.currentTime < timeToSeconds($(this).data("time-end")) ) {
                    $(this).addClass(options.active);
                    $(this).removeClass(options.inactive);
                } else {
                    $(this).addClass(options.inactive);
                    $(this).removeClass(options.active);
                }

            });
        };

        // Hover
        $(div + " div").hover(
            function () {$(this).addClass(options.hover);}, 			// ON
            function () {$(this).removeClass(options.hover);}			// OFF
        );
        init();
    }
}(jQuery));


// Convert time into seconds. eg: 0:04 => 4.000
function timeToSeconds (time) {
    // Break into array by ':'
    time = time.split (":");

    var seconds = 0;

    // Add seconds
    seconds += parseInt (time[time.length-1]);

    // Multiply minutes
    seconds += parseInt (time[time.length-2] * 60);

    // Multiply hours if they exist
    if (time[time.length-3] !== undefined) {
        seconds += parseInt (time[time.length-3] * 3600);
    }

    return seconds;
}
