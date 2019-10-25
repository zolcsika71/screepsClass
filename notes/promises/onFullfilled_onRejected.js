const {checkInventory} = require('./library.js');

const order = [['sunglasses', 1], ['bags', 2]];

let handleSuccess = resolveValue => {
    console.log(resolveValue);
};

let handleFailure = rejectValue => {
    console.log(rejectValue);
};

checkInventory(order).then(handleSuccess, handleFailure);

