const cipheredText = '7958401743454e1756174552475256435e59501a5c524e176f786517545e475f5245191772195019175e4317445f58425b531743565c521756174443455e595017d5b7ab5f525b5b58174058455b53d5b7aa175659531b17505e41525917435f52175c524e175e4417d5b7ab5c524ed5b7aa1b174f584517435f5217515e454443175b524343524517d5b7ab5fd5b7aa17405e435f17d5b7ab5cd5b7aa1b17435f5259174f584517d5b7ab52d5b7aa17405e435f17d5b7ab52d5b7aa1b17435f525917d5b7ab5bd5b7aa17405e435f17d5b7ab4ed5b7aa1b1756595317435f5259174f58451759524f4317545f564517d5b7ab5bd5b7aa17405e435f17d5b7ab5cd5b7aa175650565e591b17435f525917d5b7ab58d5b7aa17405e435f17d5b7ab52d5b7aa1756595317445817585919176e5842175a564e17424452175659175e5953524f1758511754585e59545e53525954521b177f565a5a5e595017535e4443565954521b177c56445e445c5e17524f565a5e5956435e58591b17444356435e44435e54565b17435244434417584517405f564352415245175a52435f5853174e5842175152525b174058425b5317445f584017435f52175552444317455244425b4319'

function main() {

    for (let i = 1; i<256; i++) {
        ///const decodedCypher = decryptq(String.fromCharCode(i), cipheredText);
        const decodedCypher = decrypt(cipheredText,String.fromCharCode(i));
        console.log(i, decodedCypher, '\n');
    }
}

main()


function decrypt(cypherString, key) {

    let plainText = '';
    const cypherArray = [];
    let i;
    // Group cypher by 2 hex char (16bits) into array
    for (i = 0; i < cypherString.length; i = i + 2) {
        cypherArray.push(cypherString[i] + cypherString[i + 1]);

    }

    // XOR Decrypt with provided cypher text and key
    for (i = 0; i < cypherArray.length; i++) {
        const hex = cypherArray[i];
        const dec = parseInt(hex, 16);
        const keyPointer = i % key.length;
        const asciiCode = dec ^ (key[keyPointer]).charCodeAt(0);
        plainText += String.fromCharCode(asciiCode);
    }
    return plainText;

}

function decryptq(key, cyphertext) {
    try {
        cyphertext = cyphertext.match(/.{1,2}/g).map(x => parseInt(x, 16));
        let plaintext = [];
        for (let i = 0; i < cyphertext.length; i++) {
            plaintext.push((cyphertext[i] ^ key.charCodeAt(Math.floor(i % key.length))).toString(16).padStart(2, '0'));
        }
        return decodeURIComponent('%' + plaintext.join('').match(/.{1,2}/g).join('%'));
    }
    catch(e) {
        return false;
    }
}