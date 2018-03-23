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
import { Authors } from '../../lib/kwote'
import { Logger } from '../../lib/logger'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../lib/method-updateAuthor.js'

    describe('Update Author Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.updateAuthor;
        });

        afterEach(function () {
            Authors.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, TestData.fakeAuthor());
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be authenticated to perform this action! [not-logged-in]');
        })

        it('checks for not found', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeAuthor = TestData.fakeAuthor()
            fakeAuthor._id = Random.id()
            sandbox.stub(Authors, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [fakeAuthor]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not found error').to.be.equal('Author not found! [not-found]');
        })

        it('checks for duplicate author', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeAuthor = TestData.fakeAuthor()
            fakeAuthor._id = Random.id()
            fakeAuthor.createdBy = userId

            const dupAuthor = Object.assign({}, fakeAuthor)
            dupAuthor._id = Random.id()

            sandbox.stub(Authors, 'findOne').returns(dupAuthor)
            sandbox.stub(Authors, 'update')

            try {
                const resultId = subject.apply(context, [fakeAuthor]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should check for dups').to.be.equal('This author already exists in your authors collection! [duplicate-found]');
        })

        it('upates author correctly - stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const aId = Random.id()
            let resultId = ''
            const fakeAuthor = TestData.fakeAuthor()
            fakeAuthor._id = aId
            sandbox.stub(Authors, 'findOne').returns(fakeAuthor)
            sandbox.stub(Authors, 'update')

            try {
                resultId = subject.apply(context, [fakeAuthor]);
            } catch (error) {
                msg = error.message;
            }

            expect(resultId).to.equal(aId)

            const params = Authors.update.args[0][1]
            expect(params.$set.firstName).to.equal(fakeAuthor.firstName)
            expect(params.$set.lastName).to.equal(fakeAuthor.lastName)
            expect(params.$set.birthDate).to.equal(fakeAuthor.birthDate)
            expect(params.$set.deathDate).to.equal(fakeAuthor.deathDate)
            expect(params.$set.comments).to.equal(fakeAuthor.comments)
            expect(params.$set.createdBy).to.equal(fakeAuthor.createdBy)
        })

        it('handles update error correctly', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeAuthor = TestData.fakeAuthor()
            sandbox.stub(Authors, 'findOne').returns(fakeAuthor)
            sandbox.stub(Authors, 'update').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeAuthor]);
            } catch (error) {
                msg = error.reason;
            }

            expect(Logger.log).to.have.been.called
            expect(msg).to.equal('Author not updated - please try again later')
        })
    })
}
