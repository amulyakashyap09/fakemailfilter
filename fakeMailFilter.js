"use strict";

const net = require('net');
const dns = require('dns');

/**
 * @desc checks if the input email is valid in format
 * @param string $email - the email to be verified
 * @return bool - true or false
 */
const emailValidator = (email) => {
    let result = true;

    if (email.length <= 0 || !/^\S+@\S+$/.test(email)) {
        result = false;
    }
    return result;
}

/**
 * @desc gets/fetches mail server of the recipient address
 * @param string $email - the email to be verified
 * @return array of string
 */
const mailExchaneResolve = async (email) => {

    if (!email || email.length <= 0) {
        throw new Error("Invalid email!")
    } else {
        let emailDomain = email.split('@')[1];
        let task = new Promise((resolve, reject) => {
            dns.resolveMx(emailDomain, function (err, addresses) {
                if (err || addresses.length === 0) {
                    reject(err)
                } else {
                    resolve(addresses)
                }
            });
        });

        let result = await task;
        return result;
    }
}


/**
 * @desc validates the recipient address if it valid or not
 * @param arraystring $addresses - mail server of the recipient email
 * @param string $senderAddress - source email address
 * @param string $recipientAddress - destination email address (to be validated)
 * @return bool  -  true or false
 */

const validate = async (addresses, senderAddress, recipientAddress) => {

    let task = new Promise((resolve, reject) => {
        let client = net.createConnection(25, addresses[0].exchange);
        let commands = ["helo " + addresses[0].exchange, "mail from: <" + senderAddress + ">", "rcpt to: <" + recipientAddress + ">"];
        let i = 0;
        client.setEncoding('ascii');
        client.setTimeout(5000);

        client.on('error', function (err) {
            client.emit('false', err);
        });

        client.on('false', function (data) {
            client.end();
            reject(false);
        });

        client.on('connect', function () {
            client.on('prompt', function (data) {
                if (i < 3) {
                    client.write(commands[i]);
                    client.write('\r\n');
                    i++;
                } else {
                    client.end();
                    client.destroy(); //destroy socket manually
                    resolve(true);
                }
            });
            client.on('undetermined', function (data) {
                client.end();
                client.destroy(); //destroy socket manually
                reject(false);
            });
            client.on('timeout', function () {
                client.end();
                client.destroy();
                reject(false)
            });
        });

        client.on('data', function (data) {
            if (data.indexOf("220") == 0 || data.indexOf("250") == 0 || data.indexOf("\n220") != -1 || data.indexOf("\n250") != -1) {
                client.emit('prompt', data);
            } else if (data.indexOf("\n550") != -1 || data.indexOf("550") == 0) {
                client.emit('false', data);
            } else {
                client.emit('undetermined', data);
            }
        });
    });

    let result = await task;
    return result;

}

/**
 * @desc validates the recipient address if it valid or not
 * @param string $senderAddress - source email address
 * @param string $recipientAddress - destination email address (to be validated)
 * @return object with keys {email, status, error}
 */
const checkIfEmailIsValid = async (senderAddress, recipientAddress) => {
    if (recipientAddress === null || recipientAddress === undefined || recipientAddress.length <= 0) {
        return {
            email: recipientAddress,
            status: false,
            error: new Error('Please enter valid recipient email address')
        }
    } else if (senderAddress === null || senderAddress === undefined || senderAddress.length <= 0) {
        senderAddress = recipientAddress;
    } else if (!emailValidator(senderAddress) || !emailValidator(recipientAddress)) {
        return {
            email: recipientAddress,
            status: false,
            error: new Error('Email format invalid')
        }
    } else {
        try {
            let addresses = await mailExchaneResolve(recipientAddress)
            let output = await validate(addresses, senderAddress, recipientAddress)
            return {
                email: recipientAddress,
                status: output,
                error: null
            }
        } catch (e) {
            return {
                email: recipientAddress,
                status: false,
                error: e
            }
        }
    }
}

/**
 * @desc validates the recipient address if it valid or not
 * @param string $senderAddress - source email address
 * @param string [$recipientAddress] - array of destination email address (to be validated)
 * @return [array of object] with keys [{email, status, error}]
 */
const checkIfAllEmailsAreValid = async (senderAddress, recipientAddress) => {

    if (!Array.isArray(recipientAddress) || recipientAddress.length <= 0) {
        return {
            email: recipientAddress,
            status: false,
            error: new Error('Please enter valid array of recipient email address')
        }
    } else if (Array.isArray(senderAddress)) {
        return {
            email: null,
            status: false,
            error: new Error('Sender Address cannot be array. Please enter valid email address')
        }
    }

    const promises = recipientAddress.map(async rcpt => {
        if (!emailValidator(senderAddress)) {
            return {
                email: senderAddress,
                status: false,
                error: new Error('Email format invalid')
            }
        } else if (!emailValidator(rcpt)) {
            return {
                email: rcpt,
                status: false,
                error: new Error('Email format invalid')
            }
        } else {
            const response = await module.exports.checkIfEmailIsValid(senderAddress, rcpt);
            return response
        }
    });
    const results = await Promise.all(promises);
    return results;

}

module.exports = {
    emailValidator,
    mailExchaneResolve,
    validate,
    checkIfEmailIsValid,
    checkIfAllEmailsAreValid
}