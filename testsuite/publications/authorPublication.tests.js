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
import { Authors } from '../../lib/kwote'

const should = chai.should();

if (Meteor.isServer) {
    import '../../server/publications-authors.js'

    describe('Author Publication', function () {
        let sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
            Authors.remove({})
        });

        it('authors published correctly', function (done) {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            Authors.insert(TestData.fakeAuthor())

            const collector = new PublicationCollector()

            collector.collect('myAuthors', null, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { authors } = collections
                expect(authors).to.have.length(1)
                done();
            });
        })
    })
}
