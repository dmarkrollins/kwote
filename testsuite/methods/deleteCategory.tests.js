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
    import '../../lib/method-deleteCategory.js'

    describe('Delete Category Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.deleteCategory;
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

        it('Category must exist', function () {
            const context = { userId: userId };
            let msg = '';
            const id = Random.id()
            sandbox.stub(Categories, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [id]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'throws not found').to.be.equal('Category not found! [not-found]');
        })

        it('removes Category correctly - stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            let resultId = ''
            const id = Random.id()
            const doc = TestData.fakeCategory()
            sandbox.stub(Categories, 'findOne').returns(doc)
            sandbox.stub(Categories, 'remove')

            try {
                resultId = subject.apply(context, [id]);
            } catch (error) {
                msg = error.message;
            }

            expect(resultId).to.be.true

            const params = Categories.remove.args[0][0]
            expect(params._id).to.equal(id)
        })

        // it('handles remove error correctly', function () {
        //     const context = { userId: userId };
        //     let msg = '';
        //     const newId = Random.id()
        //     let resultId = ''
        //     const doc = TestData.fakeCategory()
        //     sandbox.stub(Categories, 'findOne').returns(doc)
        //     // does not like throwing from remove
        //     sandbox.stub(Categories, 'remove').throws(TestData.fakeError())
        //     sandbox.stub(Logger, 'log')

        //     try {
        //         resultId = subject.apply(context, [doc]);
        //     } catch (error) {
        //         msg = error.reason;
        //     }

        //     expect(Logger.log).to.have.been.called
        //     expect(msg).to.equal('Category not deleted - please try again later!')
        // })
    })
}
