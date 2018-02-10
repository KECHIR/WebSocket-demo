import './index.css';
import nameGenerator from './name-generator';
import isDef from './is-def';
import mqtt from 'mqtt';




//----------------------------- classe sensor -----------------------------

class Sensor {

constructor(nom,value,typu)
{
this._nom=nom;
this._typu=typu;
this._value=value;
this._moyenne=value;
this._incr=1;
}


set value(value){
this._value= '' +value;
// si la valeur est un nombre on calcule la moyenne 
if (!isNaN(Number(this._value))){
  this._moyenne +=value;
  this._incr++;

}

}
 


imprime () {
if (!isNaN(Number(this._value))) {
return "|Name capteur =>>>> " +this._nom+ " | dernière valeur réçue =>>>>> "+this._value+"| type:=>>>>>>>"+this._typu;
}
else {
  return "|Name capteur=>>>> " +this._nom+ " | dernière valeur réçue =>>>>> "+this._value+"| type:=>>>>>>>"+this._typu;

}


}


}














//const topic="value/";
const cookies = document.cookie.split(';');
console.log(cookies)
let wsname = cookies.find(function(c) {
  if (c.match(/wsname/) !== null) return true;
  return false;
});
if (isDef(wsname)) {
  wsname = wsname.split('=')[1];
} else {
  wsname = nameGenerator();
  document.cookie = "wsname=" + encodeURIComponent(wsname);
}


document.querySelector('header>p').textContent = decodeURIComponent(wsname);








//on se connecte au serveur mqtt

 
const client=mqtt.connect('mqtt://127.0.0.1:8081');

//souscrit a tous les messages de serveur 
client.on('connect', function() { 
  client.subscribe('#');
  alert('connexion au serveur mqtt terminé avec succès cliquer sur ok pour continuer.. ') ;
});




const messages =document.querySelector('#messages');  

const messagestemp =document.querySelector('#temp');
const messageson =document.querySelector('#on');
const messagesprecent =document.querySelector('#precent');
let line,line1,line2,line3,li,liprecent,lisall11;

const moychambre = document.querySelector('#moy');
const moyprecent=document.querySelector('#precentmoy');
const moysall11=document.querySelector('#moysall11');
li =document.createElement('li');
liprecent =document.createElement('li');
line = document.createElement('li');
line1 = document.createElement('li');
line2 = document.createElement('li');
line3 = document.createElement('li');
lisall11=document.createElement('li');
 

var namcap="temperatureChambre";
var pyt="TEMPERATURE";

var capteur1 =[];
var capteur2 =[];
var capteur3= [];
client.on('message', function(topic,message){
  var val=topic.search('/');
var nam=topic.substring(val+1); // on récupère le nom de capteur temperateurchabre ect...
// on récupére les messages souscris 
var j = JSON.parse(message);
var value= j.value;
var typ= j.type;


// on crée des objets avec les valeurs récupérées  
var sensor;
var som=0,som1=0,som2=0;
var cpt=1,cpt1=1,cpt2=1;
var moy=0,moy1=0,moy2=0;
if (!isNaN(Number(value))) {   // on teste si la valeur est  un nombre 
if (typ===pyt){   
  if(namcap ===nam){ 
    capteur1.push(Number(value));
for (var i=0;i < capteur1.length;i++){
som = som + Number(capteur1[i]);
cpt++;
}
moy=som/cpt;
sensor=new Sensor (nam,value,typ);
line1.textContent = sensor.imprime();
messagestemp.appendChild(line1);

li.textContent ="valeur moyenne de '"+nam+"' = "+Number (moy);
moychambre.appendChild(li);
  }
else {
 
  capteur3.push(Number(value));
  for (var i=0;i < capteur3.length;i++){
  som2 = som2 + Number(capteur3[i]);
  cpt2++;
  }
  moy2=som2/cpt2;
  sensor= new Sensor(nam,value,typ);
  line.textContent = sensor.imprime();
  messages.appendChild(line);
  lisall11.textContent ="valeur moyenne de '"+nam+"' = "+Number (moy2);
  moysall11.appendChild(lisall11);
    
  
}


}
else {
  capteur2.push(Number(value));
  for (var j=0;j < capteur2.length;j++){
  som1 = som1 + Number(capteur2[j]);
  cpt1++;
 }
  moy1=som1/cpt1;

  sensor= new Sensor(nam,value,typ);
  line2.textContent = sensor.imprime();
  messagesprecent.appendChild(line2);
  liprecent.textContent ="valeur moyenne de '"+nam+"' = "+moy1;
 moyprecent.appendChild(liprecent);   
}

}
else {  // si la valeur n'est pas un nombre 
   
  sensor= new Sensor(nam,value,typ);
  line3.textContent = sensor.imprime();
  messageson.appendChild(line3);
   
}


});

