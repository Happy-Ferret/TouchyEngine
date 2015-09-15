function touchy() {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(rgba) {
        return "#" + componentToHex(rgba[0]) + componentToHex(rgba[1]) + componentToHex(rgba[2]);
    }

    var ctx = document.getElementById('maincanvas').getContext('2d');
    var ctxm = document.getElementById('maskcanvas').getContext('2d');
    var maskdata = []
   
    //Loading of the home test image - img1
    var img1 = new Image();
    //drawing of the test image - img1
    img1.onload = function () {
        //draw background image
        ctx.drawImage(img1, 0, 0);
    };
    img1.src = 'nasa.png';

    //Loading of the home test image - img1
    var img2 = new Image();
    //drawing of the test image - img1
    img2.onload = function () {
        //draw background image
        ctxm.drawImage(img2, 0, 0);
        maskdata = ctxm.getImageData(0, 0, canvas.width, canvas.height);
    };
    img2.src = 'nasamask8.png';

    function writeMessage(canvas, message, bgcolor) {
        var context = canvas.getContext('2d');
        context.fillStyle = bgcolor;
        context.fillRect(0, 0, 600, 30);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function getpixel(x,y){
        var imgW = maskdata.width
        
        var red = maskdata.data[((imgW * y) + x) * 4];
        var green = maskdata.data[((imgW * y) + x) * 4 + 1];
        var blue = maskdata.data[((imgW * y) + x) * 4 + 2];
        var alpha = maskdata.data[((imgW * y) + x) * 4 + 3];

        return [red,green,blue]
    }

    function writecxymessage(canvas, x,y){
        var pixel = getpixel(x, y);
        var message = 'position: ' + x + ',' + y +', ' + getmsgcolor(pixel) ;
        writeMessage(canvas, message, rgbToHex(pixel));
    }

    var canvas = document.getElementById('maincanvas')
    var scale = 1;
    var mscale = 1;

    function resizecanvases(){
        var canvas = document.getElementById('maincanvas')
        var maskcanvas = document.getElementById('maskcanvas')

        if(window.innerHeight > window.innerWidth){
            scale = window.innerWidth/canvas.width
            mscale = window.innerWidth/maskcanvas.width            
        } else { 
            scale = window.innerHeight/canvas.height
            mscale = window.innerHeight/maskcanvas.height
        }

        canvas.style.height = scale*canvas.height + 'px';
        canvas.style.width = scale*canvas.width + 'px';
        maskcanvas.style.height = mscale*maskcanvas.height + 'px';
        maskcanvas.style.width = mscale*maskcanvas.width + 'px';


    }
   
    resizecanvases()

    canvas.addEventListener('click', function(evt) {
        var canvas = document.getElementById('maincanvas');
        var mousePos = getMousePos(canvas, evt);
        writecxymessage(canvas, Math.floor(mousePos.x/mscale), Math.floor(mousePos.y/mscale));
    }, false);

    canvas.addEventListener('ontouchstart', function(evt) {
        var canvas = document.getElementById('maincanvas');
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;
        var x=Math.floor((evt.touches[0].pageX-offsetLeft)/mscale);
		var y=Math.floor((evt.touches[0].pageY-offsetTop)/mscale);
        writecxymessage(canvas, x, y);
    }, false);

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

    var cmap = {'red': 'space building',
               'gray':'sky, final frontier',
               'lime':'the wheel' }

    function normalcolor(argb){
        console.log(argb)
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

        console.log(ncolor)
        for (var color in colors){
            if(colors[color][1][0]==ncolor[0] &&
               colors[color][1][1]==ncolor[1] &&
               colors[color][1][2]==ncolor[2] ){
                console.log(color)
                return color
            }
        }
    }

    function getmsgcolor(argb){
        var color = normalcolor(argb)
        if(color in cmap){
            return cmap[color]
        }
    }


}

