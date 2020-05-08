
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function copy() {
    var copyText = document.getElementById("target");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function diff(a1, a2) {
    var a = [], diff = [];
    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }
    for (var k in a) {
        diff.push(k);
    }
    return diff;
}

function isWhitespace(str) {
    return str.length === 1 && str.match(/\s/);
}

function translate() {
    var str = document.getElementById("source").value;
    var lines = str.split(/\r?\n/);


    var ok = true;

    var escapeWithDoubleQuotes = getIndicesOf("\\\"", str);
    for (var i = 0; i < escapeWithDoubleQuotes.length; ++i) {
        escapeWithDoubleQuotes[i] += 1;
    }
    var escapeWithDoubleQuotesCount = escapeWithDoubleQuotes.length
    var doubleQuotes = getIndicesOf("\"", str);
    var aloneDoubleQuotes = diff(doubleQuotes, escapeWithDoubleQuotes);
    var aloneDoubleQuotesCount = aloneDoubleQuotes.length
    ok = (aloneDoubleQuotesCount % 2) === 0

    var result = []
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        line = line.trim();
        result.push(line)
        ok = ok && (line.charAt(0) === "\"") && (line.charAt(line.length - 1) === "\"")
    }

    lines = result
    result = []
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        line = line.trim();
        line = line.slice(0, line.length - 1) + line.slice(line.length);
        line = line.slice(1);
        result.push(line);
    }

    lines = []
    for (var i = 1; i < result.length; ++i) {
        var line = result[i];
        var prevLine = result[i - 1];
        var spaces = 0
        var space = " "
        for (var j = 0; j < line.length - 1; ++j) {
            if (line.charAt(j) === ' ') { spaces += 1; }
            else { break; }
        }
        result[i] = result[i].trim()
        lines.push(prevLine + space.repeat(spaces) + "\\");
        if (i === result.length - 1) {
            lines.push(line);
        }
    }
    for (var i = 1; i < result.length; ++i) {
        lines[i] = lines[i].trim();
    }

    var str2 = "\"" + lines.join("\n") + "\"";

    document.getElementById("target").innerHTML = str2;
}
