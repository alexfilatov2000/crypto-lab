import {createBet} from "./actions.js";
import {defaultValues} from "./config.js";

async function winGame({ solution, betToWin }) {
    let data = await createBet({
        bet : 1,
        number : 1
    });

    const realNumber = BigInt(data.realNumber);
    const number = (solution.a * realNumber + solution.c) % defaultValues.M;
    const bigIntNumber = BigInt(BigInt.asIntN(32, number));

    return createBet({
        bet: betToWin,
        number: bigIntNumber
    });
}

async function getRealNumbers({bet, number}) {
    const realNumbers = [];

    for (let i = 0; i < 3; i++) {
        const data = await createBet({ bet, number });
        realNumbers.push(BigInt(data.realNumber));
    }

    return realNumbers;
}

function get_a_and_c(realNumbers) {
    let a = ((realNumbers[2] - realNumbers[1]) * modInverse(realNumbers[1] - realNumbers[0], defaultValues.M)) % defaultValues.M;
    a = BigInt.asIntN(32, a);
    let c = (realNumbers[1] - a * realNumbers[0]) % defaultValues.M;
    c = BigInt.asIntN(32, c);

    return { a, c };
}

function modInverse(number, mod) {
    [number, mod] = [Number(number), Number(mod)]
    number = ((number % mod) + mod) % mod;

    const s = [];
    let b = mod;
    while (b) {
        [number, b] = [b, number % b];
        s.push({ number, b });
    }
    if (number !== 1) {
        throw new Error("inverse does not exists");
    }

    let x = 1;
    let y = 0;
    for (let i = s.length - 2; i >= 0; --i) {
        [x, y] = [y, x - y * Math.floor(s[i].number / s[i].b)];
    }
    return BigInt(((y % mod) + mod) % mod);
}

export {getRealNumbers, get_a_and_c, winGame}