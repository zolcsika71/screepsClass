import {availableAirplanes, flightRequirements, meetsStaffRequirements} from './named export';
function displayFuelCapacity() {
    availableAirplanes.forEach(element =>{
        console.log(`Fuel Capacity of ${element.name}:  ${element.fuelCapacity}`);
    })
}

displayFuelCapacity();

function displayStaffStatus() {
    availableAirplanes.forEach(function(element){
        console.log(`${element.name} meets staff requirements: ${meetsStaffRequirements(element.availableStaff >= flightRequirements.requiredStaff)}`)

    });
}

displayStaffStatus();