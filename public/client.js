var socket = io(location.href);

socket.on('connect', function(){});
socket.on('disconnect', function(){});


function servo_sinistra(){
 socket.emit('s_sin');
 console.log('Servo Sinistra');
};

function servo_destra(){
 socket.emit('s_des');
 console.log('Servo Destra');
};
function servo_centro(){
 socket.emit('s_cen');
 console.log('Servo Centro');
};


function uscita(){
	if (confirm('Sei sicuro di voler spegnere il Robot?')) {
    console.log('Spegnimento');
	socket.emit('spegni');
     } else {
       console.log('Spegnimento Annullato');
      }
	
}

var direzioni = {
  Sinistra: "sinistra",
  Avanti: "avanti",
  Destra: "destra",
  Indietro: "indietro"
}

function touchSin(){
 
 inviaMovimento.movimento(direzioni.Sinistra);
};
function touchAva(){
 
 inviaMovimento.movimento(direzioni.Avanti);
};
function touchDes(){
 
 inviaMovimento.movimento(direzioni.Destra);
};
function touchInd(){
 
 inviaMovimento.movimento(direzioni.Indietro);
};
function touchStop(){
inviaMovimento.stop();
};

$("document").ready(function() {

socket.on('connection', function(server) {
 consolo.log("connessione web socket attiva")
});

socket.on('distanza', function(data) {
  document.getElementById("distanza").innerHTML = data.distanza + " cm";
});

  $(document).keydown(function(e) {
    e.preventDefault();
    switch(e.which) {
        case 37: // sinistra
          inviaMovimento.movimento(direzioni.Sinistra);
        break;

        case 38: // avanti
          inviaMovimento.movimento(direzioni.Avanti);
        break;

        case 39: // destra
          inviaMovimento.movimento(direzioni.Destra);
        break;

        case 40: // indietro
          inviaMovimento.movimento(direzioni.Indietro);
        break;

        default: return; 
    }
});

$(document).keyup(function(e) {
  e.preventDefault();
  switch(e.which) {
      case 37: 
        inviaMovimento.stop();
      break;

      case 38: 
        inviaMovimento.stop();
      break;

      case 39: 
        inviaMovimento.stop();
      break;

      case 40: 
        inviaMovimento.stop();
      break;

      default: return; 
  }
});

});

class InviaMovimento {
  constructor() {
  }
  movimento(direzione) {
    socket.emit('movimento', {direzione: direzione});
    console.log(direzione);
    $("#" + direzione).addClass("button-h");
    $("#" + direzione+" :first-child").addClass("color-span");
  }
  stop() {
    socket.emit('stop');
    let selector = `#${direzioni.Sinistra},#${direzioni.Avanti},#${direzioni.Destra},#${direzioni.Indietro}`;
     $("button").removeClass("button-h");
     $("button :first-child").removeClass("color-span");
    console.log("stop");
  }
}

var inviaMovimento = new InviaMovimento();


