/* global Tournaments TIU Divisions */
/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import fs from 'fs'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment'
import { $ } from 'meteor/jquery';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { TestData } from '../testData'
import { Categories } from '../../lib/kwote'

const should = chai.should();

if (Meteor.isServer) {
    import '../../server/publications-categories.js'

    describe('Publication - Categories', function () {
        let sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
            Categories.remove({})
        });

        it('categories published - no search', function () {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            Categories.insert(TestData.fakeCategory())

            const collector = new PublicationCollector()

            return collector.collect('myCategories', null, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { categories } = collections
                expect(categories).to.have.length(1)
            });
        })

        it('categories published - search', function () {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            Categories.insert(TestData.fakeCategory({ title: 'white' }))
            Categories.insert(TestData.fakeCategory({ title: 'white1' }))
            Categories.insert(TestData.fakeCategory({ title: 'white2' }))
            Categories.insert(TestData.fakeCategory({ title: 'white3' }))
            Categories.insert(TestData.fakeCategory({ title: 'white4' }))
            Categories.insert(TestData.fakeCategory({ title: 'white5' }))
            Categories.insert(TestData.fakeCategory({ title: 'red' }))
            Categories.insert(TestData.fakeCategory({ title: 'blue' }))

            const collector = new PublicationCollector()

            return collector.collect('myCategories', 'white', (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { categories } = collections
                expect(categories).to.have.length(6)
            });
        })
    })
}
