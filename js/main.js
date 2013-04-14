// Visual indicator of DEV site
if(window.DEV) {
    window.document.title = 'DEV:' + window.document.title;
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
