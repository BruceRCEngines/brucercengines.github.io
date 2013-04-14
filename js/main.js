// Visual indicator of DEV site
if(window.DEV) {
    window.document.title = 'DEV:' + window.document.title;
}

// add a string trim function if it doesn't exist
if(typeof(String.prototype.trim) === "undefined") {
    String.prototype.trim = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

$(document).ready(function() {
    // make all require-js class elements shown
    $('.require-js').show();
    // make all require-no-js class elements hidden
    $('.require-no-js').hide();

    // activate the correct navbar Button
    activateNavbarButton();
});

// activate the navbar button depending on which page is loaded
function activateNavbarButton() {
    // get the webpage filename
    var page = document.URL.split('/').pop().toLowerCase();
    var id;

    if (page == 'index.html') {
        id = '#home';
    } else if (page == 'two_stroke.html') {
        id = '#2-stroke';
    } else if (page == 'four_stroke.html') {
        id = '#4-stroke';
    } else if (page == 'rating_info.html') {
        id = '#rating';
    } else if (page == 'order_info.html') {
        id = '#ordering';
    }

    $(id).addClass('active');
}
