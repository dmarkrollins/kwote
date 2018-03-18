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

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../lib/method-createAuthor.js'

    describe('Create Author Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.createAuthor;
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

        it('checks for dups', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeAuthor = TestData.fakeAuthor()
            // console.log(fakeAuthor)
            sandbox.stub(Authors, 'findOne').returns(fakeAuthor)

            try {
                const resultId = subject.apply(context, [fakeAuthor]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw dup error').to.be.equal('You\'ve already created an author with this name! [duplicate-found]');
        })

        it('inserts new author correctly - stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeAuthor = TestData.fakeAuthor()
            sandbox.stub(Authors, 'findOne').returns(null)
            sandbox.stub(Authors, 'insert').returns(newId)

            try {
                resultId = subject.apply(context, [fakeAuthor]);
            } catch (error) {
                msg = error.message;
            }

            expect(resultId).to.equal(newId)

            const params = Authors.insert.args[0][0]
            expect(params.firstName).to.equal(fakeAuthor.firstName)
            expect(params.lastName).to.equal(fakeAuthor.lastName)
            expect(params.birthDate).to.equal(fakeAuthor.birthDate)
            expect(params.deathDate).to.equal(fakeAuthor.deathDate)
            expect(params.comments).to.equal(fakeAuthor.comments)
            expect(params.createdBy).to.equal(fakeAuthor.createdBy)
        })
    })
}
