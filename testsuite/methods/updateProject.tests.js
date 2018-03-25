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
import { Projects } from '../../lib/kwote'
import { Logger } from '../../lib/logger'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../lib/method-updateProject.js'

    describe('Update Project Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.updateProject;
        });

        afterEach(function () {
            Projects.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, TestData.fakeProject());
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be authenticated to perform this action! [not-logged-in]');
        })

        it('checks for not found', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeProject = TestData.fakeProject()
            fakeProject._id = Random.id()
            sandbox.stub(Projects, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [fakeProject]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not found error').to.be.equal('Project not found! [not-found]');
        })

        it('checks for duplicate Project', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeProject = TestData.fakeProject()
            fakeProject._id = Random.id()
            fakeProject.createdBy = userId

            const dupProject = Object.assign({}, fakeProject)
            dupProject._id = Random.id()

            sandbox.stub(Projects, 'findOne').returns(dupProject)
            sandbox.stub(Projects, 'update')

            try {
                const resultId = subject.apply(context, [fakeProject]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should check for dups').to.be.equal('This Project already exists! [duplicate-found]');
        })

        it('upates Project correctly - stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const aId = Random.id()
            let resultId = ''
            const fakeProject = TestData.fakeProject()
            fakeProject._id = aId
            sandbox.stub(Projects, 'findOne').returns(fakeProject)
            sandbox.stub(Projects, 'update')

            try {
                resultId = subject.apply(context, [fakeProject]);
            } catch (error) {
                msg = error.message;
            }

            expect(resultId).to.equal(aId)

            const params = Projects.update.args[0][1]
            expect(params.$set.title).to.equal(fakeProject.title)
        })

        it('handles update error correctly - bad doc - no id', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeProject = TestData.fakeProject()
            sandbox.stub(Projects, 'findOne').returns(fakeProject)
            sandbox.stub(Projects, 'update').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeProject]);
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
            const fakeProject = TestData.fakeProject()
            fakeProject.title = null
            fakeProject._id = Random.id()
            sandbox.stub(Projects, 'findOne').returns(fakeProject)
            sandbox.stub(Projects, 'update').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeProject]);
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
            const fakeProject = TestData.fakeProject()
            fakeProject._id = Random.id()
            sandbox.stub(Projects, 'findOne').returns(fakeProject)
            sandbox.stub(Projects, 'update').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeProject]);
            } catch (error) {
                msg = error.reason;
            }

            expect(Logger.log).to.have.been.called
            expect(msg).to.equal('Project not updated - please try again later!')
        })
    })
}
