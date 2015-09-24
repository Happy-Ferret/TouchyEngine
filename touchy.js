var aobjs = []

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
            bgimg: 'img/nasa.png',
            maskimg: 'img/nasamask8.png',
            walkimg: 'img/nasawalkmask8.png',
            bgobjimg: 'img/nasauppermask8.png',
            cmap: {'red': 'space building',
                   'gray':'sky, final frontier',
                   'lime':'the wheel' }
        }

        player = {
            x: 250,
            y: 200,
            h: 64,
            w: 32,
            oh: 64,
            ow: 32,
            img: document.getElementById("hero")
        }
        aobjs.push(player)

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

