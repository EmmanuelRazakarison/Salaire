const prompt = require ("prompt-sync")();

const salary = prompt("Veuillez saisir votre salaire : ");
const hours = prompt("Veuillez saisir le nombre d'heures durant lequel vous travaillez : ")

 

let salaireTotal = 0;
if(hours <= 40){
    salaireTotal = salary * hours;
}

if(41 <= hours <= 45){
    salaireTotal = salary * 40 + (hours-40) * (salary * 1.5);
}

if(46 <= hours <= 50){
    salaireTotal = salary * 40 + salary *1.5*5 +salary *1.75 *(hours -45);
}

if(hours >= 51){
    salaireTotal = salary * 40 + salary*1.5*5 + salary*1.75*5 + salary*2*(hours -50);
}

console.log("Votre salaire total est de : " +salaireTotal +" Ariary ");