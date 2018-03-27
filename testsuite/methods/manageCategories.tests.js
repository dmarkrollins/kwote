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
import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import { ManageCategories } from '../../lib/manageCategories.js'

    describe('Manage Categories', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
        });

        afterEach(function () {
            Categories.remove({})
            sandbox.restore()
        })

        it('Should handle placeholder categories correctly', function () {
            sandbox.stub(Categories, 'insert').returns(Random.id())

            const array = TestData.fakeCategoriesArray()

            const result = ManageCategories(array)

            expect(result.length).to.equal(4)
            for (let i = 0; i < result.length; i += 1) {
                expect(result[i]).to.not.be.undefined
            }
            expect(Categories.insert.callCount).to.equal(4)
        })

        it('should honor existing categories', function () {
            sandbox.stub(Categories, 'insert').returns(Random.id())

            const array = []
            for (let i = 0; i < 4; i += 1) {
                array.push(Random.id())
            }
            const result = ManageCategories(array)
            for (let i = 0; i < result.length; i += 1) {
                expect(result[i]).to.not.be.undefined
            }
            expect(result.length).to.equal(4)
            expect(Categories.insert.callCount).to.equal(0)
        })

        it('should add new and keep existing categories', function () {
            sandbox.stub(Categories, 'insert').returns(Random.id())

            const array = TestData.fakeCategoriesArray()
            array.push(Random.id())

            const result = ManageCategories(array)

            expect(result.length).to.equal(5)
            for (let i = 0; i < result.length; i += 1) {
                expect(result[i]).to.not.be.undefined
            }
            expect(Categories.insert.callCount).to.equal(4)
        })
    })
}
