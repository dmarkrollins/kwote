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
import { Logger } from '../../lib/logger'
import { Quotes } from '../../lib/kwote'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../server/method-updateKwote.js'

    describe('Update Kwote Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.updateKwote;
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

        it('checks for not found', async function () {
            const context = { userId: userId };
            let msg = '';
            const fakeQuote = await TestData.fakeQuote()
            sandbox.stub(Quotes, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [fakeQuote]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not found error').to.be.equal('Kwote does not exist - cannot be updated! [not-found]');
        })

        it('updates quote correctly - stubbed', async function () {
            const context = { userId: userId };
            let msg = '';
            const qId = Random.id()
            let resultId = ''
            const fakeQuote = await TestData.fakeQuote()
            fakeQuote._id = qId
            fakeQuote.projects = [{ label: 'fake-label', value: Random.id() }]
            fakeQuote.categories = [{ label: 'fake-label', value: Random.id() }, { label: 'fake-label2', value: Random.id() }]
            sandbox.stub(Quotes, 'findOne').returns(fakeQuote)
            sandbox.stub(Quotes, 'update')

            try {
                resultId = subject.apply(context, [fakeQuote]);
            } catch (error) {
                msg = error.message;
            }

            expect(resultId).to.equal(qId)
            const params = Quotes.update.args[0][1]
            expect(params.$set.title).to.equal(fakeQuote.title)
            expect(params.$set.author).to.equal(fakeQuote.author.value)
            expect(params.$set.projects.length).to.equal(1)
            expect(params.$set.categories.length).to.equal(2)
            expect(params.$set.body).to.equal(fakeQuote.body)
        })

        it('handles update error correctly', async function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeQuote = await TestData.fakeQuote()
            sandbox.stub(Quotes, 'findOne').returns(fakeQuote)
            sandbox.stub(Quotes, 'update').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeQuote]);
            } catch (error) {
                msg = error.reason;
            }

            expect(Logger.log).to.have.been.called
            expect(msg).to.equal('Kwote not updated - please try again later!')
        })
    })
}
