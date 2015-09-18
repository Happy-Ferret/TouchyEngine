function screen() {
    (function() {
		    var lastTime = 0;
		    var vendors = ['ms', 'moz', 'webkit', 'o'];
		    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
			    || window[vendors[x]+'CancelRequestAnimationFrame'];
		    }

		    if (!window.requestAnimationFrame)
			    window.requestAnimationFrame = function(callback, element) {
				    var currTime = new Date().getTime();
				    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				    timeToCall);
				    lastTime = currTime + timeToCall;
				    return id;
			    };

			    if (!window.cancelAnimationFrame)
				    window.cancelAnimationFrame = function(id) {
					    clearTimeout(id);
				    };
			    }());

    //private
    var cnvwidth = 640;
    var cnvheight = 480; 

    var gamearea = document.getElementById('gameArea')
    var arraycnvs = [ 'maskcanvas', 'maincanvas', 'activecanvas']
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
    var actx = document.getElementById('activecanvas').getContext('2d');
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

    function drawplayer(){
        
    }

    //public
    this.requestAnimationFrame = window.requestAnimationFrame

    this.topcanvas = cnvs[arraycnvs[arraycnvs.length -1]]

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
    };

    this.getxyfromxy = function(xx,yy){
        var offsetLeft = maskcanvas.offsetLeft;
        var offsetTop = maskcanvas.offsetTop;
        var x=Math.floor((xx-offsetLeft)/mscale);
		var y=Math.floor((yy-offsetTop)/mscale);
        return {x: x, y: y}
    }

    this.drawloop = function(p){ 
        actx.clearRect(0,0,cnvwidth,cnvheight)
        actx.fillStyle = 'black';
        actx.fillRect(p.x-p.w/2, p.y-p.h, p.w, p.h);       
    };

    this.loop = function(){};
    
    //init
    resizecanvases()
}


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

    var player = []
    var level = []
    var path = []

    var walkmatrix = []
    var distancemx = []
    var grid = []

    var finder = new PF.AStarFinder({
        allowDiagonal: true,
        dontCrossCorners: true
    });

    function Create2DArray(rows) {
        var arr = [];

        for (var i=0;i<rows;i++) {
            arr[i] = [];
        }

        return arr;
    }

    function createwalkable(){
        var cnvwidth = 640;
        var cnvheight = 480;
        var canvas = document.createElement('canvas');
        canvas.width  = cnvwidth;
        canvas.height = cnvheight;

        var ctx = canvas.getContext('2d');
        var img = new Image();
                
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            walkdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
            walkmatrix = Create2DArray(cnvheight)
            distancemx = Create2DArray(cnvheight)

            //console.log(walkdata.height)
            //console.log(walkdata.width)

            for (var j=0; j<walkdata.height; j++) {
                for (var i=0; i<walkdata.width; i++) {
                    var index=(j*4)*walkdata.width+(i*4);
                    var red=walkdata.data[index];   
                    var green=walkdata.data[index+1];
                    var blue=walkdata.data[index+2];    
                    var average=Math.floor((red+green+blue)/3);

                    walkmatrix[j][i] = (average < 32);
                    distancemx[j][i] = average/256.0;

                }
            }

            //console.log(walkmatrix)

            grid = new PF.Grid(walkmatrix);
            //console.log(grid)
        };
        img.src = level.walkimg;
    }

    function walktoxy(x,y){
        var gridBackup = grid.clone();
        var destiny = scr.getxyfromxy(x,y)
        console.log('destination: '+ destiny.x + ', '+ destiny.y )
        console.log('playerpos: '+ player.x + ', ' + player.y )
        console.log(gridBackup)

        console.log(walkmatrix[destiny.y][destiny.x])

        path = finder.findPath(player.x, player.y, destiny.x, destiny.y, gridBackup);
        console.log(path) 
        
    }

    function consumepath(){
        if(path.length){
            var cords = path.shift();
            player.x = cords[0];
            player.y = cords[1];
        }
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

    function loadlevel(){

        level = {
            bgimg: 'nasa.png',
            maskimg: 'nasamask8.png',
            walkimg: 'nasawalkmask8.png',
            cmap: {'red': 'space building',
                   'gray':'sky, final frontier',
                   'lime':'the wheel' }
        }

        player = {
            x: 400,
            y: 350,
            h: 100,
            w: 50
        }

        scr.loadlevel(level)
        createwalkable()    
    }

    var c = new colors()
    var scr = new screen()
    scr.loop = function(){
        consumepath()
        scr.drawloop(player);
        this.requestAnimationFrame.call(window,scr.loop);
    };

    var hid = new _hid(scr, walktoxy, whatsxy)

    loadlevel()
    scr.loop()

}

