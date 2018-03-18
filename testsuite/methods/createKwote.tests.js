/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import moment from 'moment'
import { Quotes } from '../../lib/kwote'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../lib/method-createKwote.js'

    describe('Create Kwote Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.createKwote;
        });

        afterEach(function () {
            Quotes.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, TestData.fakeQuote());
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be authenticated to perform this action! [not-logged-in]');
        })

        it('checks for dups', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeQuote = TestData.fakeQuote()
            sandbox.stub(Quotes, 'findOne').returns(fakeQuote)

            try {
                const resultId = subject.apply(context, [fakeQuote]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw dup error').to.be.equal('You\'ve already created a Kwote with this title! [duplicate-found]');
        })

        it('inserts new quote correctly - stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeQuote = TestData.fakeQuote()
            sandbox.stub(Quotes, 'findOne').returns(null)
            sandbox.stub(Quotes, 'insert').returns(newId)

            try {
                resultId = subject.apply(context, [fakeQuote]);
            } catch (error) {
                msg = error.message;
            }

            expect(resultId).to.equal(newId)
            const params = Quotes.insert.args[0][0]
            expect(params.title).to.equal(fakeQuote.title)
            expect(params.author).to.equal(fakeQuote.author.value)
            expect(params.projects.length).to.equal(0)
            expect(params.categories.length).to.equal(0)
            expect(params.body).to.equal(fakeQuote.body)
        })
    })
}
