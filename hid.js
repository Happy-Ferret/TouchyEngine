function _hid(scr, whenclick, whenmove){
    //private
    function getMousePos(canvas, evt) {
        return {
            x: evt.clientX,
            y: evt.clientY
        };
    }
    function getTouchPos(canvas, evt) {
        return {
            x: evt.touches[0].pageX,
            y: evt.touches[0].pageY
        };
    }

    var canvas = scr.topcanvas
    var fwhenclick = whenclick
    var fwhenmove = whenmove
    
    canvas.addEventListener('click', function(evt) {
        var pos = getMousePos(canvas, evt);
        fwhenclick(pos.x,pos.y)
        
    }, false);

    canvas.addEventListener('mousemove', function(evt) {
        var pos = getMousePos(canvas, evt);
        fwhenmove(pos.x,pos.y)
        
    }, false);

    canvas.addEventListener('ontouchstart', function(evt) {
        var pos = getTouchPos(canvas, evt);
        fwhenmove(pos.x,pos.y)
        fwhenclick(pos.x,pos.y)

    }, false);

    //no public
}

