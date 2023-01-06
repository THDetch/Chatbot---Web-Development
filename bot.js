'use strict'

var WebSocketClient = require('websocket').client

/**
 * bot ist ein einfacher Websocket Chat Client
 */

class bot {

  /**
   * Konstruktor baut den client auf. Er erstellt einen Websocket und verbindet sich zum Server
   * Bitte beachten Sie, dass die Server IP hardcodiert ist. Sie müssen sie umsetzten
   */
  constructor() {
    this.bestellung = []




    /** Die Websocketverbindung
      */
    this.client = new WebSocketClient()
    /**
     * Wenn der Websocket verbunden ist, dann setzten wir ihn auf true
     */
    this.connected = false

    /**
     * Wenn die Verbindung nicht zustande kommt, dann läuft der Aufruf hier hinein
     */
    this.client.on('connectFailed', function (error) {
      console.log('Connect Error: ' + error.toString())
    })

    /** 
     * Wenn der Client sich mit dem Server verbindet sind wir hier 
    */
    this.client.on('connect', function (connection) {
      this.con = connection
      console.log('WebSocket Client Connected')
      connection.on('error', function (error) {
        console.log('Connection Error: ' + error.toString())
      })

      /** 
       * Es kann immer sein, dass sich der Client disconnected 
       * (typischer Weise, wenn der Server nicht mehr da ist)
      */
      connection.on('close', function () {
        console.log('echo-protocol Connection Closed')
      })

      /** 
       *    Hier ist der Kern, wenn immmer eine Nachricht empfangen wird, kommt hier die 
       *    Nachricht an. 
      */
      connection.on('message', function (message) {
        if (message.type === 'utf8') {
          var data = JSON.parse(message.utf8Data)
          console.log('Received: ' + data.msg + ' ' + data.name)
        }
      })

      /** 
       * Hier senden wir unsere Kennung damit der Server uns erkennt.
       * Wir formatieren die Kennung als JSON
      */
      function joinGesp() {
        if (connection.connected) {
          connection.sendUTF('{"type": "join", "name":"MegaBot"}')
        }
      }
      joinGesp()
    })
  }

  /**
   * Methode um sich mit dem Server zu verbinden. Achtung wir nutzen localhost
   * 
   */
  connect() {
    this.client.connect('ws://localhost:8181/', 'chat')
    this.connected = true
  }

  /** 
   * Hier muss ihre Verarbeitungslogik integriert werden.
   * Diese Funktion wird automatisch im Server aufgerufen, wenn etwas ankommt, das wir 
   * nicht geschrieben haben
   * @param nachricht auf die der bot reagieren soll
  */
  // "nachricht" muss klein geschrieben serden.

  /*post (nachricht) {
  
    nachricht = nachricht.toLowerCase()
    var name = 'MegaBot'
    var inhalt = 'Ich habe dich nicht verstanden, habe leider Hunger :('

    for ( var i in this.dict) {
      console.log(i)
      console.log(this.dict[i])
    }
    //searching for inhalt.
    for ( var j in this.dict) {
      if (nachricht.includes(j)) {
        inhalt = this.dict[j]
      }
    }
    
    var msg = '{"type": "msg", "name": "' + name + '", "msg":"' + inhalt + '"}'
    console.log('Send: ' + msg)
    this.client.con.sendUTF(msg)
  }*/
  post(nachricht) {
    nachricht = nachricht.toLowerCase()
    var name = 'MegaBot'
    var inhalt = 'Sorry ich habe dich leider nicht verstanden. Was willst du nochmal bestellen?'
    var intents = require('./public/assets/js/answers.json')
    var karte = require("./public/assets/js/menu.json")


    for (var j = 0; j < intents.answers.length; j++) {
      if (nachricht.includes((intents.answers[j]).intent)) {
        inhalt = intents.answers[j].answer
        if (intents.answers[j].product == true) {
          this.bestellung.push(intents.answers[j].id)
        
        }
      }
    }
    if (nachricht.includes("rechnung")) {
      inhalt = ""
      let gesamtpreis = 0
      for (let i = 0; i < this.bestellung.length; i++) {
        this.bestellung[i] = parseInt(this.bestellung[i])
        let id = this.bestellung[i]; //the ID
        inhalt += karte.speisekarte[id].produkt_name + ": " +karte.speisekarte[id].preis + "€" + "<br>";
        gesamtpreis += karte.speisekarte[id].preis;

      }
      //console.log(this.bestellung);
      inhalt += "GesamtPreis : " + '<b>' + parseFloat(gesamtpreis) + " Eur" + '</b>'
    }
    var msg = '{"type": "msg", "name": "' + name + '", "msg":"' + inhalt + '"}'
    console.log('Send: ' + msg)
    this.client.con.sendUTF(msg)
  }
}

module.exports = bot

/*
post (nachricht) {
    var name = 'MegaBot'
    var inhalt = 'Ich habe dich nicht verstanden wir wollten über was nettes reden'
    var intents = require('./test.json')
   //nachricht = 'ich will Bestellen'
   nachricht = nachricht.toLowerCase()
   for (var j = 0 ;j<intents.answers.length ;j++) {
   if (nachricht.includes(intents.answers[j].intent)) {
   
   }
   }
    /*
     * Verarbeitung
    */
/*
    var msg = '{"type": "msg", "name": "' + name + '", "msg":"' + inhalt + '"}'
    console.log('Send: ' + msg)
    this.client.con.sendUTF(msg)
  }*/