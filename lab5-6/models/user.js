const pool = require('../db');

class User{
    constructor() {
        this.pool = pool;
        this.table = 'userInfo';
    }
    async findById(id){
        let x = await this.pool.query(`SELECT * FROM ${this.table} WHERE id=${id}`);
        console.log(x);
    }
    async findByEmail(email){
        let x = await this.pool.query(`SELECT * FROM userInfo WHERE email="${email}" LIMIT 1`);
        return x[0];
    }
    async findByLogin(login){
        let x = await this.pool.query(`SELECT * FROM userInfo WHERE login="${login}" LIMIT 1`);
        return x[0];
    }

    async setActiveStatusByLogin(login){
        await this.pool.query(`UPDATE ${this.table} SET status=1 WHERE login="${login}"`);
    }
    async setInactiveStatusByLogin(login){
        await this.pool.query(`UPDATE ${this.table} SET status=0 WHERE login="${login}"`);
    }
    async updatePswByEmail(email, psw){
        await this.pool.query(`UPDATE ${this.table} SET password="${psw}" WHERE email="${email}"`);
    }

    async deleteById(id){
        await this.pool.query(`DELETE FROM ${this.table} WHERE id=${id}`)
    }
    async save(obj){
        try {
            await this.pool.query(`INSERT INTO ${this.table} (name, login, email, password, phone)
            VALUES("${obj.name}", "${obj.login}", "${obj.email}", "${obj.password}", "${obj.phone}")`);
        } catch (e) {
            console.log(e);
        }

    }

}

module.exports.User = User;