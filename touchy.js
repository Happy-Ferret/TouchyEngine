function mobilecheck () {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check; }

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

function screen(width, height) {


    //private
    var cnvwidth = width;
    var cnvheight = height; 

    var gamearea = document.getElementById('gameArea')
    var arraycnvs = [ 'maskcanvas', 'maincanvas', 'activecanvas']
    var cnvs = []

    var ccl = new cclb()

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
        for (var i=0; i<arraycnvs.length; i++){
            var canva = arraycnvs[i];
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

    function imgtomatrix(imgfile,rgbcondition, callback){
        var canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        canvas.style['image-rendering'] = "pixelated";

        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            var matrix = Create2DArray(canvas.height)

            for (var j=0; j<imgData.height; j++) {
                for (var i=0; i<imgData.width; i++) {
                    var index=(j*4)*imgData.width+(i*4);
                    var red=imgData.data[index];   
                    var green=imgData.data[index+1];
                    var blue=imgData.data[index+2];    

                    matrix[j][i] = rgbcondition(red,green,blue);

                }
            }

            callback(matrix);
        };
        img.src = imgfile;

    }

    function imgdataAlphaFromLabel(bbd, label, imgdata){
        var tf = bbd.l
        function oneDto2D(onedarr, w, x, y){
            return(onedarr[y*w+x])
        }

        for (var j=0; j<imgdata.height; j++) {
            for (var i=0; i<imgdata.width; i++) {
                var index=(j*4)*imgdata.width+(i*4);

                if( oneDto2D(label, imgdata.width, i, j) != tf){
                    //make alpha total
                    imgdata.data[index+3]=0;  
                }
            }
        }

        return imgdata
        
    }

    function objtoimg(bbd, label){
        var bgimg = document.getElementById('maincanvas')

        var tmpcanvas = document.createElement('canvas');
        tmpcanvas.width = bgimg.width
        tmpcanvas.height = bgimg.height
        var tmpctx = tmpcanvas.getContext('2d');
        tmpctx.drawImage(bgimg,0,0,tmpcanvas.width, tmpcanvas.height)

        var tmpdata = tmpctx.getImageData(0,0,tmpcanvas.width,tmpcanvas.height)

        tmpdata = imgdataAlphaFromLabel( bbd, label, tmpdata)
        tmpctx.putImageData(tmpdata, 0, 0);

        var objcanvas = document.createElement('canvas');
        objcanvas.width = bbd.x2-bbd.x1;
        objcanvas.height = bbd.y2-bbd.y1;
        var objctx = objcanvas.getContext('2d');

        objctx.drawImage(tmpcanvas,
				    bbd.x1, bbd.y1,
                    bbd.x2-bbd.x1, bbd.y2-bbd.y1,
				    0, 0, bbd.x2-bbd.x1, bbd.y2-bbd.y1);
    
        
        document.getElementById('gameArea').appendChild(objcanvas);
        
    }

    function createbgobjs(bgobjimg){
        var rgbfunction = function(r,g,b){
            if(Math.floor((r+g+b)/3) > 128){
                return 255
            } else {
                return 0
            }
        }

        var objs = function(mx){
            var width = mx[0].length;
            var height = mx.length;
            var blob = twoD2blob(mx);
            //console.log(blob)
            var tlabel = ccl.eBlobExtraction(blob,width,height);
            //var ctx = document.getElementById('topcanvas').getContext('2d')
            //var imagedata = ctx.getImageData(0,0,width,height);
            //ccl.eBlobColouring(imagedata.data, width, height, tlabel)
            //ctx.putImageData(imagedata, 0, 0)
            
            var tbounds = ccl.eBlobBounds(tlabel,width,height);
            for(var i=0; i< tbounds.length; i++){
                var bound = tbounds[i]
                if(bound.l != 0){
                    objtoimg(bound,tlabel);
                }
            }
            
        }        

        imgtomatrix(bgobjimg,rgbfunction,objs)

    }

    //public
    this.requestAnimationFrame = window.requestAnimationFrame

    this.topcanvas = cnvs[arraycnvs[arraycnvs.length -1]]

    this.loadlevel = function(level){
        var img1 = new Image();
        img1.onload = function () {
            ctx.drawImage(img1, 0, 0);
            createbgobjs(level.bgobjimg)
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

    actx.fillStyle = '#330033';

    this.drawloop = function(p){ 
        actx.clearRect(0,0,cnvwidth,cnvheight)
        actx.fillRect(p.x-Math.floor(p.w/2), p.y-p.h, p.w, p.h);       
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

    var ismobile = mobilecheck()

    var player = []
    var level = []
    var path = []

    var walkmatrix = []
    var distancemx = []
    var grid = []

    var width = 320;
    var height = 240;

    var finder = new PF.AStarFinder({
        allowDiagonal: true,
        dontCrossCorners: true
    });

    function createwalkable(){

        var canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        canvas.style['image-rendering'] = "pixelated";

        var ctx = canvas.getContext('2d');
        var img = new Image();
                
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            walkdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
            walkmatrix = Create2DArray(canvas.height)
            distancemx = Create2DArray(canvas.height)

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
                    distancemx[j][i] = average/255.0;

                }
            }

            //console.log(distancemx)

            grid = new PF.Grid(walkmatrix);
            //console.log(grid)
        };
        img.src = level.walkimg;
    }

    function walktoxy(x,y){
        var gridBackup = grid.clone();
        var destiny = scr.getxyfromxy(x,y)
        //console.log('destination: '+ destiny.x + ', '+ destiny.y )
        //console.log('playerpos: '+ player.x + ', ' + player.y )
        //console.log(gridBackup)
        //console.log(walkmatrix[destiny.y][destiny.x])

        path = finder.findPath(player.x, player.y, destiny.x, destiny.y, gridBackup);
        //console.log(path) 
        
    }

    function consumepath(){
        if(path.length){
            var consume = 2
            if(ismobile){
                consume = 3*consume
            }
            
            for(;consume>0;consume--){
                if(path.length){
                    var cords = path.shift();
                    player.x = cords[0];
                    player.y = cords[1];
                    var size = distancemx[player.y][player.x]
                    player.w = Math.floor(player.ow * size)
                    player.h = Math.floor(player.oh * size)
                }
            }

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
            bgobjimg: 'nasauppermask8.png',
            cmap: {'red': 'space building',
                   'gray':'sky, final frontier',
                   'lime':'the wheel' }
        }

        player = {
            x: 250,
            y: 200,
            h: 50,
            w: 25,
            oh: 50,
            ow: 25
        }

        scr.loadlevel(level)
        createwalkable()  


    }

    var c = new colors()
    var scr = new screen(width, height)
    scr.loop = function(){
        consumepath()
        scr.drawloop(player);
        scr.requestAnimationFrame.call(window,scr.loop);
    };

    var hid = new _hid(scr, walktoxy, whatsxy)

    loadlevel()



    scr.loop()

}

