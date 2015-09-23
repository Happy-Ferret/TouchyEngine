function twoD2blob(array2d){

    var blobarr = [];

    for(var i = 0; i < array2d.length; i++)
    {
        blobarr = blobarr.concat(array2d[i]);
    }

    return blobarr
}

function Create2DArray(rows) {
    var arr = [];

    for (var i=0;i<rows;i++) {
        arr[i] = [];
    }

    return arr;
}
