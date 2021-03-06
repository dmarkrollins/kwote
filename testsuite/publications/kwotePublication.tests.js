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
import { Quotes } from '../../lib/kwote'

const should = chai.should();

if (Meteor.isServer) {
    import '../../server/publications-quotes.js'

    describe('Publication - Quotes', function () {
        let sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
            Quotes.remove({})
        });

        it('Quotes published - no search', async function (done) {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            Quotes.insert(await TestData.fakeQuote())

            const collector = new PublicationCollector()

            collector.collect('myQuotes', null, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { quotes } = collections
                expect(quotes).to.have.length(1)
                done();
            });
        })

        it('Quotes published - search by title', async function (done) {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            const search = { limit: 10, title: 'white' }

            Quotes.insert(await TestData.fakeQuote({ title: 'White' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'Whitely' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'Red' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'Blue' }))

            const collector = new PublicationCollector()

            collector.collect('myQuotes', search, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { quotes } = collections
                expect(quotes).to.have.length(2)
                done();
            });
        })

        it('Quotes published - limit enforced', async function (done) {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            const search = { limit: 7, title: 'white' }

            Quotes.insert(await TestData.fakeQuote({ title: 'White' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'White' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'White' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'White' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'White' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'White' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'White' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'White' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'Purple' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'Orange' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'Green' }))
            Quotes.insert(await TestData.fakeQuote({ title: 'Blue' }))

            const collector = new PublicationCollector()

            collector.collect('myQuotes', search, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { quotes } = collections
                expect(quotes).to.have.length(7)
                done();
            });
        })
    })
}
