const fs = require('fs').promises;
const md5 = require('md5');
const argon2 = require('argon2');
const ExcelJS = require('exceljs');

const LENGTH = 100_000;

async function main() {
    const top100All = (await fs.readFile('top100.txt', 'utf8')).split('\n')
    const top100 = getRandomItemsFromList(top100All, 10)

    const top100kAll = (await fs.readFile('top100.txt', 'utf8')).split('\n')
    const top100k = getRandomItemsFromList(top100kAll, 90000)

    const randomPasswords = generateRandomPassword(1000);

    const otherPasswords = generateOtherPassword(8990);

    const allPasswords = [...top100, ...top100k, ...randomPasswords, ...otherPasswords];
    const md5Password = [...allPasswords].map(password => md5(password))
    const argon2Passwords = await Promise.all([...allPasswords].map(async password => await argon2.hash(password)))

    await createExcel(md5Password, argon2Passwords);
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]\\:;?></-=";
    const passwords = Array.from({length: length}, (_, i) => i + 1);

    return passwords.map(_ => {
        const length = randomInteger(6, 12);
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    })
}

function getRandomItemsFromList(list, length) {
    const passwords = Array.from({length: length}, (_, i) => i + 1);
    return passwords.map(_ => list[Math.floor(Math.random()*list.length)])
}

function generateOtherPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const passwords = Array.from({length: length}, (_, i) => i + 1);

    return passwords.map(_ => {
        const length = 8;
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    })
}

async function createExcel(md5, argon2) {
    const workbook_md5 = new ExcelJS.Workbook();
    const workbook_argon2 = new ExcelJS.Workbook();

    const md5Sheet = workbook_md5.addWorksheet('md5');
    const argon2Sheet = workbook_argon2.addWorksheet('argon2');

    md5Sheet.getColumn(1).values = [...md5];
    argon2Sheet.getColumn(1).values = [...argon2];

    await workbook_md5.csv.writeFile('md5.csv');
    await workbook_argon2.csv.writeFile('argon2.csv');
}

main();