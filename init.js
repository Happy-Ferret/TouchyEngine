levels = [];
function init(){
  player = {
      x: 250,
      y: 200,
      h: 64,
      w: 32,
      oh: 64,
      ow: 32,
      img: document.getElementById("hero")
  };



  return {player: player,
          initlevel: 'nasa'}
}
