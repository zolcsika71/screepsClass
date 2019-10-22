import Airplane from "./export default";
function displayFuelCapacity() {
    Airplane.availableAirplanes.forEach(element =>{
        console.log(`Fuel Capacity of ${element.name}:  ${element.fuelCapacity}`);
    })
}
displayFuelCapacity();