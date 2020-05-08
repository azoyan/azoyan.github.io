
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
    var doubleQuotes = getIndicesOf("\"", str);
    var aloneDoubleQuotes = diff(doubleQuotes, escapeWithDoubleQuotes);
    var aloneDoubleQuotesCount = aloneDoubleQuotes.length
    ok = (aloneDoubleQuotesCount % 2) === 0

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
    str2 = str2.split("%%").join('%');
    str2 = str2.split("%n").join("");
    str2 = str2.split("%x").join("{:x}");
    str2 = str2.split("%X").join("{:X}");
    str2 = str2.split("%s").join("{}");
    str2 = str2.split("%u").join("{}");
    str2 = str2.split("%p").join("{:#x}");
    str2 = str2.split("%o").join("{:o}");
    str2 = str2.split("%llu").join("{}");
    str2 = str2.split("%lli").join("{}");
    str2 = str2.split("%lld").join("{}");
    str2 = str2.split("%lu").join("{}");
    str2 = str2.split("%Lf").join("{}");
    str2 = str2.split("%lf").join("{}");
    str2 = str2.split("%l").join("{}");
    str2 = str2.split("%ld").join("{}");
    str2 = str2.split("%li").join("{}");
    str2 = str2.split("%i").join("{}");
    str2 = str2.split("%hu").join("{}");
    str2 = str2.split("%hi").join("{}");
    str2 = str2.split("%g").join("{}");
    str2 = str2.split("%G").join("{}");
    str2 = str2.split("%f").join("{}");
    str2 = str2.split("%e").join("{}");
    str2 = str2.split("%E").join("{}");
    str2 = str2.split("%d").join("{}");
    str2 = str2.split("%c").join("{}");

    document.getElementById("target").innerHTML = str2;
}
