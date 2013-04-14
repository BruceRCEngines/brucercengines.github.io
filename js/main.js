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
    } else if (page == 'shopping_cart.html') {
        id = '#cart';
    }

    $(id).addClass('active');
}

// if there was a problem with the javascript implementation,
// this will revert to using iframes
function revertToIframe() {
    // make all require-js class elements hidden
    $('.require-js').hide();
    // make all require-no-js class elements shown
    $('.require-no-js').show();
};

function textTableToArray(text) {
    var resultArr = [];
    var lines = text.split(/\r?\n/);
    var sepIndex = 1;

    // find the line that separates the table header and the table body
    for(var i = 0; i < lines.length; i++) {
        if(lines[i].search('-+-') != -1) {
            sepIndex = i;
            break;
        }
    }

    // handles no caption as well as multi-line captions
    var caption = '';
    for(var i = 0; i < sepIndex-1; i++) {
        caption += lines[i] + '\n';
    }

    // get the header
    var line = lines[sepIndex-1].split('|');
    for(var i = 0; i < line.length; i++) {
        line[i] = line[i].trim();
    }
    resultArr.push(line);

    // get the rest of the table data
    for(var i = sepIndex+1; i < lines.length; i++) {
        // skip blank lines
        if(lines[i].trim() == '') {
            continue;
        }
        line = [];
        var line = lines[i].split('|');
        for(var j = 0; j < line.length; j++) {
            line[j] = line[j].trim();
        }
        resultArr.push(line);
    }

    resultArr.caption = caption;
    return resultArr;
    //return [caption, resultArr];
};

function insertRatingTableContent(message, table) {
    // if we didn't get a response, revert to iframes
    if(!message) {
        revertToIframe();
        return;
    }

    // turn table into a jquery object
    table = $(table);

    var caption, tableData;
    //[caption, tableData] = textTableToArray(message);
    tableData = textTableToArray(message);
    caption = tableData.caption;

    table.append($('<caption></caption>').html(caption));

    // insert the table headers
    var tableHeader = $('<thead></thead>');
    var tableRow = $('<tr></tr>');
    for(var i = 0; i < tableData[0].length; i++) {
        tableRow.append($('<th></th>').html(tableData[0][i]));
    }
    tableHeader.append(tableRow);
    table.append(tableHeader);

    // insert the table body data
    var tableBody = $('<tbody></tbody>');
    for(var i = 1; i < tableData.length; i++) {
        // insert all the data in the row
        tableRow = $('<tr></tr>');
        for(var j = 0; j < tableData[i].length; j++) {
            tableRow.append($('<td></td>').html(tableData[i][j]));
        }
        tableBody.append(tableRow);
    }
    table.append(tableBody);
}

// insert the information contained in message into table
function insertEngineTableContent(message, table) {
    // if we didn't get a response, revert to iframes
    if(!message) {
        revertToIframe();
        return;
    }

    // turn table into a jquery object
    table = $(table);

    var caption, tableData;
    //[caption, tableData] = textTableToArray(message);
    tableData = textTableToArray(message);
    caption = tableData.caption;

    var iBrand, iSize, iRating, iPrice, iSku, iDesc;
    var headers = tableData[0];

    iBrand = $.inArray('BRAND', headers);
    iSize = $.inArray('SIZE', headers);
    iRating = $.inArray('RATING', headers);
    iPrice = $.inArray('PRICE', headers);
    iSku = $.inArray('SKU', headers);
    iDesc = $.inArray('DESCRIPTION', headers);

    if(iBrand < 0 || iSize < 0 || iRating < 0 || iPrice < 0 || iSku < 0 || iDesc < 0) {
        // The remote text file is not in the expected format.
        revertToIframe();
        return;
    }

    // insert the table's caption
    table.append($('<caption></caption>').html(caption));

    // insert the table headers
    var tableHeader = $('<thead></thead>');
    var tableRow = $('<tr></tr>');
    tableRow.append($('<th>NAME</th>').hide());
    tableRow.append($('<th></th>').html(headers[iBrand]));
    tableRow.append($('<th></th>').html(headers[iSize]));
    tableRow.append($('<th></th>').html(headers[iRating]));
    tableRow.append($('<th></th>').html(headers[iPrice]));
    tableRow.append($('<th></th>').html(headers[iSku]).hide());
    tableRow.append($('<th></th>').html(headers[iDesc]));
    //tableRow.append($('<th></th>'));  // "Add to Cart" button column
    if(table.is('has-photos')) {
        tableRow.append($('<th>Photos</th>'));
    }
    tableHeader.append(tableRow);
    table.append(tableHeader);

    // insert the table data
    var tableBody = $('<tbody></tbody>');
    for(var i = 1; i < tableData.length; i++) {
        var name = tableData[i][iBrand] + ' ' + tableData[i][iSize]
            + ' Rating:' + tableData[i][iRating] + ' SKU:' + tableData[i][iSku];

        tableRow = $('<tr></tr>');
        //tableRow.addClass('simpleCart_shelfItem');
        tableRow.append($('<td></td>').html(name).addClass('item_name').hide());
        tableRow.append($('<td></td>').html(tableData[i][iBrand]));
        tableRow.append($('<td></td>').html(tableData[i][iSize]));
        tableRow.append($('<td></td>').html(tableData[i][iRating]));
        tableRow.append($('<td></td>').html(tableData[i][iPrice]).addClass('item_price'));
        tableRow.append($('<td></td>').html(tableData[i][iSku]).hide());
        tableRow.append($('<td></td>').html(tableData[i][iDesc]));
        //tableRow.append($('<td><a class="item_add btn btn-small" href="javascript:;"> Add to Cart</a></td>'));

        // insert pictures
        if(table.is('.has-photos')) {
            var sku = parseInt(tableData[i][iSku]);
            var imageUrls = findEnginePhotos(sku);

            if(imageUrls.length > 0) {
                createModalCarousel(sku + '', imageUrls);
                tableRow.append($('<td><a href="#modal' + sku + '" class="btn btn-primary btn-small" data-toggle="modal">View Photos</a></td>'));
            }
        }

        tableBody.append(tableRow);
    }
    table.append(tableBody);
}

function createModalCarousel(id, photoUrls) {
    var modalCode =
        '<div id="modal' + id + '" class="modal hide fade" data-keyboard="true">' +
            //'<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
            //'</div>' +
            '<div class="modal-body">' +
                '<div id="carousel' + id + '" class="carousel slide">' +
                    '<!-- Carousel items -->' +
                    '<div class="carousel-inner">';

    modalCode += '<div class="active item"><img src="' + photoUrls[0] + '"></div>'
    for(var i = 1; i < photoUrls.length; i++) {
        modalCode += '<div class="item"><img src="' + photoUrls[i] + '"></div>';
    }

    modalCode +=    '</div>' +
                    '<!-- Carousel nav -->' +
                    '<a class="carousel-control left" href="#carousel' + id + '" data-slide="prev">&lsaquo;</a>' +
                    '<a class="carousel-control right" href="#carousel' + id + '" data-slide="next">&rsaquo;</a>' +
                '</div>' +
            '</div>' +
        '</div>';

    $('#hiddenContent').append(modalCode);
}

function findEnginePhotos(engineId) {
    var imgUrls = [];
    return imgUrls;
}

// receive table plaintext data from remote url
function populateTable(url, tableElement, insertTableContent) {
    var timeoutId = 0;
    var remoteLoader;
    if(window.DEV) {
        remoteLoader = 'https://dl.dropboxusercontent.com/u/13441553/resources/remote_loader-dev.html';
    } else {
        remoteLoader = 'https://dl.dropboxusercontent.com/u/13441553/resources/remote_loader.html';
    }
    var socket = new easyXDM.Socket({
        remote: remoteLoader,
        onMessage: function(message, origin) {
            // we received a response so cancel timer for revertToIframe
            clearTimeout(timeoutId);
            insertTableContent(message, tableElement);
            // we won't be needing this anymore...
            socket.destroy();
        },
        onReady: function() {
            // when the socket is set up, send the url we want to grab
            socket.postMessage(url);
        }
    });

    // set timer for revertToIframe after 3 seconds
    // this means the page will use the iframe version if it
    // doesn't get a response back from the remote easyXDM listener
    timeoutId = setTimeout(revertToIframe, 3000);
}
