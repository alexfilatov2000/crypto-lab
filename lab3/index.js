import {createAccount} from "./actions.js";
import {getRealNumbers} from "./mainLogic.js";

const ID = 7465;


async function main(){
    // const account = await createAccount(ID);
    const realNumbers = await getRealNumbers({
        id: ID,
        bet: 1,
        number: 1
    });
    console.log(realNumbers);

}

main();