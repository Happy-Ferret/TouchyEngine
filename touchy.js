function screen() {
    //private
    var cnvwidth = 640;
    var cnvheight = 480; 

    var gamearea = document.getElementById('gameArea')
    var arraycnvs = [ 'maskcanvas', 'maincanvas']
    var cnvs = []

    for (var i=0; i<arraycnvs.length; i++){
        var canvas = document.createElement('canvas')
        canvas.id     = arraycnvs[i];
        canvas.width  = cnvwidth;
        canvas.height = cnvheight;
        canvas.style.display= 'block';
        canvas.style.zIndex   = i+1;
        canvas.style.position = "absolute"; //required by zIndex

        canvas.style.left = 0; //this 
        canvas.style.right = 0; //this
        canvas.style.marginLeft = "auto"; //this and
        canvas.style.marginRight = "auto" //this makes all canvas centered

        canvas.style['image-rendering'] = "pixelated";
        gamearea.appendChild(canvas);
        cnvs[arraycnvs[i]] = canvas
    }

    var maincanvas = document.getElementById('maincanvas')
    var maskcanvas = document.getElementById('maskcanvas')
    var ctx = maincanvas.getContext('2d');
    var ctxm = maskcanvas.getContext('2d');
    var maskdata = []

    var mscale = 1;

    function getpixel(x,y){
        var imgW = maskdata.width
        
        var red = maskdata.data[((imgW * y) + x) * 4];
        var green = maskdata.data[((imgW * y) + x) * 4 + 1];
        var blue = maskdata.data[((imgW * y) + x) * 4 + 2];
        var alpha = maskdata.data[((imgW * y) + x) * 4 + 3];

        return [red,green,blue]
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(rgba) {
        return "#" + componentToHex(rgba[0]) + componentToHex(rgba[1]) + componentToHex(rgba[2]);
    }

    function resizecanvases(){
        var scale = 1
        for(var canva in cnvs){
            if(window.innerHeight > window.innerWidth){
                scale = window.innerWidth/cnvs[canva].width       
            } else { 
                scale = window.innerHeight/cnvs[canva].height
            }
            cnvs[canva].style.height = scale*cnvs[canva].height + 'px';
            cnvs[canva].style.width = scale*cnvs[canva].width + 'px';
            if(canva = 'maskcanvas'){
                mscale = scale
            }
        }
        
    }

    //public
    this.canvas = maincanvas

    this.loadlevel = function(level){
        var img1 = new Image();
        img1.onload = function () {
            ctx.drawImage(img1, 0, 0);
        };
        img1.src = level.bgimg;

        var img2 = new Image();
        img2.onload = function () {
            ctxm.drawImage(img2, 0, 0);
            maskdata = ctxm.getImageData(0, 0, maskcanvas.width, maskcanvas.height);
        };
        img2.src = level.maskimg;

        
    }

    this.writeMessage = function(message,bgcolor) {
        ctx.fillStyle = rgbToHex(bgcolor);
        ctx.fillRect(0, 0, 300, 30);
        ctx.font = '18pt Calibri';
        ctx.fillStyle = 'black';
        ctx.fillText(message, 10, 25);
    }

    this.getxycolor = function(xx,yy){

        var offsetLeft = maskcanvas.offsetLeft;
        var offsetTop = maskcanvas.offsetTop;
        var x=Math.floor((xx-offsetLeft)/mscale);
		var y=Math.floor((yy-offsetTop)/mscale);
        var pixel = getpixel(x, y);
        return pixel
    }

    //init
    resizecanvases()
}

function _hid(scr, whatsxy){
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

    var canvas = scr.canvas
    var testxy = whatsxy
    
    canvas.addEventListener('mousemove', function(evt) {
        var pos = getMousePos(canvas, evt);
        testxy(pos.x,pos.y)
        
    }, false);

    canvas.addEventListener('ontouchstart', function(evt) {
        var pos = getTouchPos(canvas, evt);
        testxy(pos.x,pos.y)

    }, false);

    //no public
}

function colors(){
    //private
    var colors = { 'white'  : ['#FFFFFF', [4,4,4]],
                   'silver' : ['#C0C0C0', [3,3,3]],
                   'gray'   : ['#808080', [2,2,2]],
                   'black'  : ['#000000', [0,0,0]],
                   'red'    : ['#FF0000', [4,0,0]],
                   'maroon' : ['#800000', [2,0,0]],
                   'yellow' : ['#FFFF00', [4,4,0]],
                   'olive'  : ['#808000', [2,2,0]],
                   'lime'   : ['#00FF00', [0,4,0]],
                   'green'  : ['#008000', [0,2,0]],
                   'aqua'   : ['#00FFFF', [0,4,4]],
                   'teal'   : ['#008080', [0,2,2]],
                   'blue'   : ['#0000FF', [0,0,4]],
                   'navy'   : ['#000080', [0,0,2]],
                   'fuchsia': ['#FF00FF', [4,0,4]],
                   'purple' : ['#800080', [2,0,2]] }

    //public
    this.normalcolor = function(argb){
        var ncolor = [Math.round(argb[0]/64), Math.round(argb[1]/64), Math.round(argb[2]/64)]
        for (var i=0; i<3; i++){
            if(ncolor[i]==4){
                for (var k=0; k<3; k++){
                    if(ncolor[k]==1){
                        ncolor[k]=0;
                    }
                }
            }
        }

        for (var color in colors){
            if(colors[color][1][0]==ncolor[0] &&
               colors[color][1][1]==ncolor[1] &&
               colors[color][1][2]==ncolor[2] ){
                return color
            }
        }
    }
}

function touchy() {
    var level = {
        bgimg: 'nasa.png',
        maskimg: 'nasamask8.png',
        cmap: {'red': 'space building',
               'gray':'sky, final frontier',
               'lime':'the wheel' }
    }

    function whatsxy(x,y){
        var pixel = scr.getxycolor(x,y);
        var message = getmsgcolor(pixel)
        scr.writeMessage(message, pixel);
    }

    function getmsgcolor(argb){
        var cmap = level.cmap
        var color = c.normalcolor(argb)
        if(color in cmap){
            return cmap[color]
        } else {
            return ""
        }
    }

    var c = new colors()
    var scr = new screen()
    var hid = new _hid(scr, whatsxy)

    scr.loadlevel(level)
}

