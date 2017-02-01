function move(width, height, player, level, scr, ismobile){
  var path = []
  player.reached = false;

  var walkmatrix = []
  var distancemx = []
  var grid = []
  var width = width;
  var height = height;

  var finder = new PF.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true
  });

  this.createwalkable = function(){

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
      img.src = 'levels/' + level.name + '/' + level.walkimg;
  };

  this.walktoxy = function (x,y,truexy){
    if(typeof truexy === 'undefined' || truexy === null || truexy == false){
      truexy = false;
    } else {
      truexy = true;
    }
    var gridBackup = grid.clone();
    if(truexy){
      var destiny = {x:x, y:y}
    } else {
      var destiny = scr.getxyfromxy(x, y)
    }
    console.log('destination: ' + destiny.x + ', ' + destiny.y)
    console.log('playerpos: ' + player.x + ', ' + player.y)
        //console.log(gridBackup)
        //console.log(walkmatrix[destiny.y][destiny.x])

    path = finder.findPath(player.x, player.y, destiny.x, destiny.y, gridBackup);
  };

  this.consumepath = function (){
    if(path.length){
        player.reached = false;

        var consume = 2;
        if(ismobile){
            consume = 3*consume;
        }

        for(;consume>0;consume--){
            if(path.length){
                var cords = path.shift();
                player.x = cords[0];
                player.y = cords[1];
                var size = distancemx[player.y][player.x];
                player.w = Math.floor(player.ow * size);
                player.h = Math.floor(player.oh * size);
            }
        }

    } else {
      if(player.reached == false){
        player.reached = true;
        var event = new Event('player_arrived');
        document.dispatchEvent(event);
      }
    }
  };

}
