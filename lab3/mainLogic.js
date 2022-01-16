import {createBet} from "./actions.js";

async function getRealNumbers({id, bet, number}) {
    const realNumbers = {};

    for (let i = 0; i < 3; i++) {
        const data = await createBet({ id, bet, number });
        console.log(data);
        realNumbers[`x${i}`] = data.realNumber;
    }

    return realNumbers;
}

export {getRealNumbers}