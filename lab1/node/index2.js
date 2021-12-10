const {docopt} = require('docopt');

const cipheredTextBase64 = "G0IFOFVMLRAPI1QJbEQDbFEYOFEPJxAfI10JbEMFIUAAKRAfOVIfOFkYOUQFI15ML1kcJFUeYhA4IxAeKVQZL1VMOFgJbFMDIUAAKUgFOElMI1ZMOFgFPxADIlVMO1VMO1kAIBAZP1VMI14ANRAZPEAJPlMNP1VMIFUYOFUePxxMP19MOFgJbFsJNUMcLVMJbFkfbF8CIElMfgZNbGQDbFcJOBAYJFkfbF8CKRAeJVcEOBANOUQDIVEYJVMNIFwVbEkDORAbJVwAbEAeI1INLlwVbF4JKVRMOF9MOUMJbEMDIVVMP18eOBADKhALKV4JOFkPbFEAK18eJUQEIRBEO1gFL1hMO18eJ1UIbEQEKRAOKUMYbFwNP0RMNVUNPhlAbEMFIUUALUQJKBANIl4JLVwFIldMI0JMK0INKFkJIkRMKFUfL1UCOB5MH1UeJV8ZP1wVYBAbPlkYKRAFOBAeJVcEOBACI0dAbEkDORAbJVwAbF4JKVRMJURMOF9MKFUPJUAEKUJMOFgJbF4JNERMI14JbFEfbEcJIFxCbHIJLUJMJV5MIVkCKBxMOFgJPlWOzKkfbF4DbEMcLVMJPx5MRlgYOEAfdh9DKF8PPx4LI18LIFVCL18BY1QDL0UBKV4YY1RDfXg1e3QAYQUFOGkof3MzK1sZKXIaOnIqPGRYD1UPC2AFHgNcDkMtHlw4PGFDKVQFOA8ZP0BRP1gNPlkCKw==";
const cipheredText = Buffer.from(cipheredTextBase64, 'base64').toString('utf-8');
const key_length = 3;

const doc =
    `Usage:
    index2.js [--showPossibleLength] [--showCoincidenceRate] [--showTheKey] [--decode]
    index2.js -h | --help

    Options:
    -h --help                       Show this screen.
    --showPossibleLength            Show the possible key length
    --showCoincidenceRate           Show the coincidence rate
    --showTheKey                    Show the key
    --decode                        Show the decoded text
`;

function getPossibleKeyLength(cipheredText) {
    const keyLengths = Array.from({length: cipheredText.length - 1}, (_, i) => i + 1);

    return keyLengths.map(keyLength => {
        let coincidences = 0;

        for (let i = 0; i < cipheredText.length - 1; i++) {
            if (i + keyLength >= cipheredText.length) {
                break;
            }

            if (cipheredText[i] === cipheredText[i + keyLength]) {
                coincidences++;
            }
        }

        return [keyLength, coincidences];
    });
}

function getTextParts(text, keyLength) {
    const letters = [...text];
    return [...new Array(keyLength).keys()].map(
        (shift) => letters.filter((_, index) => !((index - shift) % keyLength)),
    );
}

function getCharsWithFrequencyOrdered(text){
    const charsFrequency = [...text]
        .reduce((acc, currentValue) => ({
            ...acc,
            [currentValue]: acc[currentValue] ? acc[currentValue] + 1 : 1,
        }), {});

    return Object
        .entries(charsFrequency)
        .sort(([, frequency1], [, frequency2]) => frequency2 - frequency1);
}


async function main(opts) {

    if (opts['--showPossibleLength']) {
        const possibleKeyLength = getPossibleKeyLength(cipheredText);
        console.log(possibleKeyLength
            .map(([keyLength, coincidences]) => `Length: ${keyLength}, Coincidences: ${coincidences}`)
            .join('\n\n'))

    }

    const textParts = getTextParts(cipheredText, key_length)
    console.log(textParts)

    const theMostFrequentChars = textParts.map((text, index) => {
        const charsWithFrequencyOrdered = getCharsWithFrequencyOrdered(text);

        if (opts['--showCoincidenceRate']) {
            console.log(
                charsWithFrequencyOrdered
                    .map(([char, frequency]) => `Code: ${char.charCodeAt()}, Frequency: ${frequency}`)
                    .join('\n\n')
            );
        }

        const [[letter]] = charsWithFrequencyOrdered;

        return letter;
    });

    const keyChars = theMostFrequentChars.map(
        (char) => String.fromCharCode(char.charCodeAt() ^ ' '.charCodeAt())
    );

    if (opts['--showTheKey']) {
        console.log(keyChars);
    }


    if (opts['--decode']) {
        const decode = [...cipheredText].reduce(
            (acc, char, index) =>
                acc + String.fromCharCode(char.charCodeAt() ^ keyChars[index % key_length].charCodeAt()),
            ''
        );

        console.log(decode);
    }
}

main(docopt(doc));
