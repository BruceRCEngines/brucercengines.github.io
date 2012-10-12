$(document).ready(function() {
    // make all require-js class elements shown
    $('.require-js').show();

    // make all require-no-js class elements hidden
    $('.require-no-js').hide();
});

// add a string trim function if it doesn't exist
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

// insert the information contained in message into table
function parseTableContent(message, table) {
    // turn table into a jquery object
    table = $(table);
    
    var lines = message.split(/\n|\r\n/);
    var sepIndex = 1;
    
    // find the line that separates the table header and the table body
    for(var i = 0; i < lines.length; i++) {
        if(lines[i].search('-+-') != -1) {
            sepIndex = i;
            break;
        }
    }
    
    // insert the table's caption
    // handles no caption as well as multi-line captions
    var caption = '';
    for(var i = 0; i < sepIndex-1; i++) {
        caption += lines[i] + '\n';
    }
    table.append($('<caption></caption>').html(caption));
    
    // insert the table headers
    var tableHeader = $('<thead></thead>');
    var tableRow = $('<tr></tr>');
    headers = lines[sepIndex-1].split('|');
    for(var i = 0; i < headers.length; i++) {
        tableRow.append($('<th></th>').html(headers[i].trim()));
    }
    tableHeader.append(tableRow);
    table.append(tableHeader);
    
    // insert the table data
    var tableBody = $('<tbody></tbody>');
    for(var i = sepIndex+1; i < lines.length; i++) {
        // skip blank lines
        if(lines[i].trim() == '') {
            continue;
        }
        
        // insert all the data in the row
        tableRow = $('<tr></tr>');
        var entries = lines[i].split('|');
        for(var j = 0; j < entries.length; j++) {
            tableRow.append($('<td></td>').html(entries[j].trim()));
        }
        tableBody.append(tableRow);
    }
    table.append(tableBody);
}

// receive table plaintext data from remote url
function populateTable(url, tableElement) {
    var socket = new easyXDM.Socket({
        remote: url,
        onMessage: function(message, origin) {
            parseTableContent(message, tableElement);
        },
        onReady: function() {
            socket.postMessage('send me the content');
        }
    });
}