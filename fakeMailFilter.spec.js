'use strict'

const fakeEmailFinder = require('./fakeMailFilter')
const expect = require('chai').expect
const assert = require('chai').assert


describe('Fake Email Finder module', () => {

    describe('"emailValidator" ', () => {
        it('should export a function', () => {
            expect(fakeEmailFinder.emailValidator).to.be.a('function')
        })

        it('should validate the email and return true', () => {
            let goodEmail = "amulyakashyap09@gmail.com";
            let goodOutput = fakeEmailFinder.emailValidator(goodEmail)
            expect(goodOutput).to.be.true;
        })

        it('should validate the email and return false', () => {
            let badEmail = "amulyakashyap09gmail.com";
            let badOutput = fakeEmailFinder.emailValidator(badEmail)
            expect(badOutput).to.be.false;
        })
    })

    describe('"mailExchaneResolve" ', () => {
        it('should export a function', () => {
            expect(fakeEmailFinder.mailExchaneResolve).to.be.a('function')
        })

        it('should return error', async () => {
            let email = "";
            assert.throws(async function () {
                await fakeEmailFinder.mailExchaneResolve(email)
            }, /Invalid email!/);
        })

        it('should return the non empty array', async () => {
            let email = "amulyakashyap09@gmail.com";
            let emailOutput = await fakeEmailFinder.mailExchaneResolve(email)
            expect(emailOutput).to.be.an('array').that.is.not.empty;
        })
    })

    describe('"validate" ', () => {
        it('should export a function', () => {
            expect(fakeEmailFinder.validate).to.be.a('function')
        })

        it('should return boolean true', async () => {
            let sender = "amulyakashyap09@gmail.com";
            let reciever = "amulya9292@gmail.com";
            let addresses = await fakeEmailFinder.mailExchaneResolve(reciever)
            let emailOutput = await fakeEmailFinder.validate(addresses, sender, reciever)
            expect(emailOutput).to.be.true;
        })

        it('should return boolean false', async () => {
            let sender = "amulyakashyap09@gmail.com";
            let reciever = "amulya9292XXxxXXxxXX@gmail.com";
            let addresses = await fakeEmailFinder.mailExchaneResolve(reciever)
            let emailOutput = await fakeEmailFinder.validate(addresses, sender, reciever)
            expect(emailOutput).to.be.false;
        })
    })

    describe('"checkIfEmailIsValid" ', () => {
        it('should export a function', () => {
            expect(fakeEmailFinder.checkIfEmailIsValid).to.be.a('function')
        })

        it('should return an object', async () => {
            let sender = "amulyakashyap09@gmail.com";
            let reciever = "amulya9292@gmail.com";
            let emailOutput = await fakeEmailFinder.checkIfEmailIsValid(sender, reciever)
            expect(emailOutput).to.be.an('object');
            expect(emailOutput).to.have.all.keys('email', 'status', 'error');
        })
    })

    describe('"checkIfAllEmailsAreValid" ', () => {
        it('should export a function', () => {
            expect(fakeEmailFinder.checkIfAllEmailsAreValid).to.be.a('function')
        })

        it('should return an object', async () => {
            let sender = "amulyakashyap09@gmail.com";
            let reciever = "[amulya9292@gmail.com]";
            let emailOutput = await fakeEmailFinder.checkIfAllEmailsAreValid(sender, reciever)
            expect(emailOutput).to.be.an('object');
            expect(emailOutput).to.have.all.keys('email', 'status', 'error');
        })
    })
})