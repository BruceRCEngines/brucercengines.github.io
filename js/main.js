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
    } else if (page == 'gasoline.html') {
        id = '#gasoline';
    } else if (page == 'rating_info.html') {
        id = '#rating';
    } else if (page == 'order_info.html') {
        id = '#ordering';
    } else if (page == 'contact.html') {
        id = '#contact';
    }

    $(id).addClass('active');
}

function insertPicturesInTable(table) {
    var columns = table.find('thead th').map(function() {
        return $(this).text();
    });

    var iSku = $.inArray('SKU', columns);

    table.find('thead tr').append($('<th>Photos</th>'));

    table.find('tbody tr').each(function(i) {
        var sku = $(this).find(':nth-child(' + (iSku + 1) + ')').text();
        //var baseUrl = 'https://dl.dropboxusercontent.com/u/76928840/Website%20Photos/resized/';
        var baseUrl = 'img/engines/';
        var $td = $('<td></td>');
        $td.append($('<a id="imgbtn_' + sku + '" href="#modal_' + sku + '" class="btn disabled btn-small" data-toggle="modal"><i class="icon-camera icon-white visible-phone"></i><span class="hidden-phone">Photos Unavailable</span></a>'));
        $(this).append($td);
        createModalCarousel(sku, baseUrl);
    });
}

function createModalCarousel(id, photoUrlPrefix) {
    //TODO change to string concatenation & one .append call
    var modal = $('<div class="modal hide fade" data-keyboard="true"></div>').attr('id', 'modal_' + id);
    var modalBody = $('<div class="modal-body"></div>');
    var carousel = $('<div class="carousel slide" data-interval="false"></div>').attr('id', 'carousel_' + id);
    var carouselInner = $('<div class="carousel-inner"></div>');
    var carouselActiveItem = $('<div class="active item"></div>');
    var img = new Image();

    modal.append($('<button type="button" class="close" data-dismiss="modal">&times;</button>'));
    modal.append(modalBody);
    modalBody.append(carousel);
    carousel.append(carouselInner);
    carousel.append($('<a class="carousel-control left" href="#carousel_' + id + '" data-slide="prev">&lsaquo;</a>'));
    carousel.append($('<a class="carousel-control right" href="#carousel_' + id + '" data-slide="next">&rsaquo;</a>'));
    carouselInner.append(carouselActiveItem);
    carouselActiveItem.append(img);

    //TODO clean up all these callbacks
    img.onload = function () {
        // show the photo button if the photo exists
        $('#hiddenContent').append(modal);
        $('#imgbtn_' + id).html('<i class="icon-camera icon-white visible-phone"></i><span class="hidden-phone">View Photos</span>').removeClass('disabled').addClass('btn-primary').show();

        var img2 = new Image();
        img2.onload = function () {
            // if image loads, add the next item to the slider
            var carouselItem = $('<div class="item"></div>');
            carouselInner.append(carouselItem);
            carouselItem.append(img2);
        };
        img2.onerror = function () {
            // if image doesn't load remove the slide event listener
            carousel.off('slide');
        };

        img2.src = photoUrlPrefix + 'sku' + id + '-' + 2 + '.jpg';
    };
    img.onerror = function () {
        // if image doesn't load remove the slide event listener
        carousel.off('slide');
    };

    carousel.on('slide', function loadNextImg(e) {
        if( typeof loadNextImg.count == 'undefined' ) {
            loadNextImg.count = 3;
        }

        var img = new Image();
        img.onload = function () {
            // if image loads, add the next item to the slider
            var carouselItem = $('<div class="item"></div>');
            carouselInner.append(carouselItem);
            carouselItem.append(img);
        };
        img.onerror = function () {
            // if image doesn't load remove the slide event listener
            carousel.off('slide');
        }

        img.src = photoUrlPrefix + 'sku' + id + '-' + loadNextImg.count + '.jpg';
        loadNextImg.count++;
    });

    img.src = photoUrlPrefix + 'sku' + id + '-' + 1 + '.jpg';
}
