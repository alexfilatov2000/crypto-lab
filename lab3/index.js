import {createAccount} from "./actions.js";
import {getRealNumbers, get_a_and_c, winGame,} from "./mainLogic.js";
import {defaultValues} from "./config.js";

async function main(){
    // const account = await createAccount(defaultValues.ID);
    const realNumbers = await getRealNumbers({
        bet: 1,
        number: 1
    });
    const solution = get_a_and_c(realNumbers);
    console.log(solution);

    const result = await winGame({
        solution,
        betToWin: 100
    })

    console.log(result);
}

main();