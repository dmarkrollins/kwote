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
    import '../../lib/method-updateCategory.js'

    describe('Update Category Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.updateCategory;
        });

        afterEach(function () {
            Categories.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, TestData.fakeCategory());
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be authenticated to perform this action! [not-logged-in]');
        })

        it('checks for not found', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeCategory = TestData.fakeCategory()
            fakeCategory._id = Random.id()
            sandbox.stub(Categories, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [fakeCategory]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not found error').to.be.equal('Category not found! [not-found]');
        })

        it('checks for duplicate Category', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeCategory = TestData.fakeCategory()
            fakeCategory._id = Random.id()
            fakeCategory.createdBy = userId

            const dupCategory = Object.assign({}, fakeCategory)
            dupCategory._id = Random.id()

            sandbox.stub(Categories, 'findOne').returns(dupCategory)
            sandbox.stub(Categories, 'update')

            try {
                const resultId = subject.apply(context, [fakeCategory]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should check for dups').to.be.equal('This Category already exists! [duplicate-found]');
        })

        it('upates Category correctly - stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const aId = Random.id()
            let resultId = ''
            const fakeCategory = TestData.fakeCategory()
            fakeCategory._id = aId
            sandbox.stub(Categories, 'findOne').returns(fakeCategory)
            sandbox.stub(Categories, 'update')

            try {
                resultId = subject.apply(context, [fakeCategory]);
            } catch (error) {
                msg = error.message;
            }

            expect(resultId).to.equal(aId)

            const params = Categories.update.args[0][1]
            expect(params.$set.title).to.equal(fakeCategory.title)
        })

        it('handles update error correctly - bad doc - no id', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeCategory = TestData.fakeCategory()
            sandbox.stub(Categories, 'findOne').returns(fakeCategory)
            sandbox.stub(Categories, 'update').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeCategory]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg).to.equal('You must provide a valid document!')
        })

        it('handles update error correctly - bad doc - no title', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeCategory = TestData.fakeCategory()
            fakeCategory.title = null
            fakeCategory._id = Random.id()
            sandbox.stub(Categories, 'findOne').returns(fakeCategory)
            sandbox.stub(Categories, 'update').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeCategory]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg).to.equal('You must provide a valid document!')
        })

        it('handles update error correctly', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeCategory = TestData.fakeCategory()
            fakeCategory._id = Random.id()
            sandbox.stub(Categories, 'findOne').returns(fakeCategory)
            sandbox.stub(Categories, 'update').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeCategory]);
            } catch (error) {
                msg = error.reason;
            }

            expect(Logger.log).to.have.been.called
            expect(msg).to.equal('Category not updated - please try again later!')
        })
    })
}
