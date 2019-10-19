let spaceship = {
    'Fuel Type' : 'Turbo Fuel',
    homePlanet : 'Earth'
};

let greenEnergy = obj => {

    obj['Fuel Type'] = 'avocado oil';

};

let remotelyDisable = obj => {

    obj.disabled = false;

};

greenEnergy(spaceship);
remotelyDisable(spaceship);

console.log(`${spaceship}`);