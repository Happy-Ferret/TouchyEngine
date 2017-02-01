var aobjs = []
var action

function touchy() {
    var ismobile = mobilecheck()
    var level = [];
    var player = {};
    var width = 320;
    var height = 240;

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

    game = init()
    player = game.player;
    level = levels[game.initlevel];
    var c = new colors()
    var scr = new screen(width, height)
    var mov = new move(width, height, player, level, scr, ismobile)
    action = new actions(mov,scr,player)

    function loadlevel(){
        aobjs.push(player);
        scr.loadlevel(level);
        mov.createwalkable();

    }

    scr.loop = function(){
        mov.consumepath()
        scr.drawloop(player);
        scr.requestAnimationFrame.call(window,scr.loop);
    };

    var hid = new _hid(scr, mov.walktoxy, whatsxy)
    loadlevel()
    scr.loop()

}
