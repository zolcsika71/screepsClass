const goat = {
    dietType: 'herbivore',
    makeSound() {
        console.log('baaa');
    },
    diet: () => {
        console.log(this.dietType);
    }
};

goat.diet(); // Prints undefined



const robot1 = {
    energyLevel: 100,
    checkEnergy () {
        console.log(`Energy is currently at ${this.energyLevel}%.`)
    }
};

robot1.checkEnergy();


