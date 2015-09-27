function screen(width, height) {

    function setpixelated(context){
        context['imageSmoothingEnabled'] = false;
        context['mozImageSmoothingEnabled'] = false;
        context['oImageSmoothingEnabled'] = false;
        context['webkitImageSmoothingEnabled'] = false;
        context['msImageSmoothingEnabled'] = false;
    }

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

        canvas.style['image-rendering'] = "crisp-edges";
        setpixelated(canvas.getContext('2d'))
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

    function compareAobjs(a,b) {
        if(a.x == b.y){
            return (a.x < b.x) ? -1 : (a.x > b.x) ? 1 : 0;
        } else {
            return (a.y < b.y) ? -1 : 1;
        }
    }


    function drawaobj(actx,p){
        actx.drawImage(p.img, p.x-Math.floor(p.w/2), p.y-p.h, p.w, p.h)
    }

    function drawaobjs( actx){
        aobjs.sort(compareAobjs)
        for(var i = 0; i < aobjs.length; i++) {
            drawaobj(actx,aobjs[i])
        }
    }

    function imgtomatrix(imgfile,rgbcondition, callback){
        var canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        canvas.style['image-rendering'] = "crisp-edges";

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
        objcanvas.style['image-rendering'] = "crisp-edges";
        var objctx = objcanvas.getContext('2d');

        objctx.drawImage(tmpcanvas,
				    bbd.x1, bbd.y1,
                    bbd.x2-bbd.x1, bbd.y2-bbd.y1,
				    0, 0, bbd.x2-bbd.x1, bbd.y2-bbd.y1);

        function activeobj(bbd,objc) {
            this['x'] = bbd.x1+Math.floor((bbd.x2-bbd.x1)/2)
            this['y'] = bbd.y2
            this['ow'] = bbd.x2-bbd.x1
            this['oh'] = bbd.y2-bbd.y1
            this['w'] = bbd.x2-bbd.x1
            this['h'] = bbd.y2-bbd.y1
            this['img'] = objc
        }
    
        aobjs.push(new activeobj(bbd,objcanvas))
        
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
        drawaobjs(actx)      
    };

    this.loop = function(){};
    
    //init
    resizecanvases()
}

