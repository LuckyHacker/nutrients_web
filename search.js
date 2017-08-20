function clear_obj(obj)
{
    obj.value = '';
}

// From stackoverflow: https://stackoverflow.com/a/14991797
function parseCSV(str) {
    var arr = [];
    var quote = false;
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';

        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        arr[row][col] += cc;
    }
    return arr;
}

var file_path = "data/nutrients.csv";
var carbIndex = 7;
var nameIndex = 1;
var field_list = [];

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        resp = this.responseText;
        field_list = parseCSV(resp);
    }
};
xhttp.open("GET", file_path, true);
xhttp.send();

window.onload = function() {

    document.getElementById("data_button").onclick = function () {
        var searchMatch = false;
        var resultTable = "<table><tr><th>LABEL</th><th>CARB/100g</th></tr>";
        var searchTerms = document.getElementsByName('data_input')[0].value.split(" ");

        for (i = 1; i < field_list.length; i++) {
            if (field_list[i].length > carbIndex + 1) {
                searchMatch = false;
                for (j = 0; j < searchTerms.length; j++) {
                    if (field_list[i][nameIndex].indexOf(searchTerms[j].toUpperCase()) == -1) {
                        searchMatch = false;
                        break;
                    } else {
                        searchMatch = true;
                    }
                }
                if (searchMatch) {
                    resultTable += "<tr><td>" + field_list[i][nameIndex] + "</td><td>" + field_list[i][carbIndex] + "</td></tr>";
                }
            }
        }
        resultTable += "</table>";
        document.getElementById('resultContainer').innerHTML = resultTable;
    }
}
