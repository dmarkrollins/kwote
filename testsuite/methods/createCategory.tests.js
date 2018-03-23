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
import { Categories } from '../../lib/kwote'
import { Logger } from '../../lib/logger'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../lib/method-createCategory.js'

    describe('Create Category Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.createCategory;
        });

        afterEach(function () {
            Categories.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, []);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be authenticated to perform this action! [not-logged-in]');
        })

        it('checks for dups', function () {
            const context = { userId: userId };
            let msg = '';
            const doc = TestData.fakeCategory()
            sandbox.stub(Categories, 'findOne').returns(doc)

            try {
                const resultId = subject.apply(context, [doc]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw dup error').to.be.equal('You\'ve already created a category with this name! [duplicate-found]');
        })

        it('inserts new category correctly - stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const doc = TestData.fakeCategory()
            sandbox.stub(Categories, 'findOne').returns(null)
            sandbox.stub(Categories, 'insert').returns(newId)

            try {
                resultId = subject.apply(context, [doc]);
            } catch (error) {
                msg = error.message;
            }

            expect(resultId).to.equal(newId)

            const params = Categories.insert.args[0][0]
            expect(params.title).to.equal(doc.title)
        })

        it('handles insert error correctly', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const doc = TestData.fakeCategory()
            sandbox.stub(Categories, 'findOne').returns(null)
            sandbox.stub(Categories, 'insert').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [doc]);
            } catch (error) {
                msg = error.reason;
            }

            expect(Logger.log).to.have.been.called
            expect(msg).to.equal('Category not created - please try again later!')
        })
    })
}
