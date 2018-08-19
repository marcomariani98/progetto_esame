//Server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const five = require("johnny-five");
const raspi = require("raspi-io");
const util = require("util");
const spawn = require('child_process').spawn;


app.use(express.static("public"));
app.get('/', function(req, res, next) {
    res.sendFile('index.html');
});

setInterval(function calcola_distanza() {
  
var distanza = spawn('python',["./python/distanza.py"]);

distanza.stdout.on('data',function(data){

    console.log("--- DISTANZA ---");
    var testoConvertito = data.toString('utf8');

    console.log(testoConvertito);
    
    socket.emit('distanza',{distanza: testoConvertito});
    
});
 distanza.stderr.on('data',function(data){

    console.log("errore");
});
  
},2000);


var board = new five.Board({
    io: new raspi()
});

var motori = null;


board.on('ready', function() {
    
   motori = new five.Motors([
    { pins: { pwm: "P1-12",dir: "P1-15" },invertPWM: true },
    { pins: { pwm: "P1-35",dir: "P1-18" },invertPWM: true }
    ]);
    
});

class gestoreMoto {
    
    constructor() {}

    sinistra() {
        motori[0].forward(255);
        motori[1].reverse(255);
        
        console.log("OUT: Movimento a Sinistra.");

    }
    destra() {
    
        motori[0].reverse(255);
	motori[1].forward(255);
        
        console.log("OUT: Movimento a Destra.");

    }
    avanti() {

        motori[0].forward(255);
        motori[1].forward(255);
        
        console.log("OUT: Movimento in Avanti.");

    }
    indietro() {
        
        motori[0].reverse(255);
        motori[1].reverse(255);
        
        console.log("OUT: Movimento in Indietro.");


    }
    stop() {
        
        motori.stop();
        
        console.log("OUT: Motori Fermi.");
    }
}

var eseguiMoto = new gestoreMoto();

class gestoreServo {
     
     constructor() {}
     
     sinistra(){
     
     var movSerSin = spawn('python',["./python/servo_sinistra.py"]);
     
     console.log("OUT: Movimento del Servomotore a Sinistra");
     
     }
     
     destra(){
     
     var movSerDes = spawn('python',["./python/servo_destra.py"]);
     
     console.log("OUT: Movimento del Servomotore a Destra");
     
     }
     
     centro(){
     
     var movSerCen = spawn('python',["./python/servo_centro.py"]);
     
     console.log("OUT: Movimento del Servomotore al Centro");
     
     }
}

var movServo = new gestoreServo();

socket.on('connection', function(client) {
    console.log("client connesso");

    client.on('movimento', function(data) {
        console.log(data.direzione);
        switch (data.direzione) {
            case "sinistra":
                console.log("IN: Sinistra");
                eseguiMoto.sinistra();
                break;
            case "destra":
                eseguiMoto.destra();
                console.log("IN: Destra");
                break;
            case "avanti":
                eseguiMoto.avanti();
                console.log("IN: Avanti");
                break;
            case "indietro":
                console.log("IN: Indietro");
                eseguiMoto.indietro();
                break;
            default:

        }

    });

    client.on('stop', function() {
        
        eseguiMoto.stop();
        console.log("IN: Stop");

    });
    
    client.on('s_sin', function() {
      
      console.log("IN: Servo a Sinistra");
      movServo.sinistra();
      
     });
     
     client.on('s_des', function() {
      
      console.log("IN: Servo a Destra");
      movServo.destra();
      
     });
     
     client.on('s_cen', function() {
     
     console.log("In: Servo Centro");
     movServo.centro();
     
     });
     
	 client.on('spegni', function() {
        
        var Spegnimento = spawn('sudo', ['shutdown', 'now']);
        
    });


});



const port = process.env.PORT || 3000;
const ip = "127.0.0.1";
server.listen(port);
console.log(`Server listening on http://${ip}:${port}`);
