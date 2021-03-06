import axios from "axios";
import {defaultValues} from "./config.js";

async function createAccount(id) {
    await axios.get('http://95.217.177.249/casino/createacc', { params: { id } });
}

async function createBet({id = defaultValues.ID, bet, number}) {
    const response = await axios.get('http://95.217.177.249/casino/playLcg', {
        params: { id, bet, number }
    });
    return response.data;
}

export {createAccount, createBet}