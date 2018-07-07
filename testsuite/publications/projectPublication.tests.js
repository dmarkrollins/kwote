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
import { Projects } from '../../lib/kwote'

const should = chai.should();

if (Meteor.isServer) {
    import '../../server/publications-projects.js'

    describe('Publication - Projects', function () {
        let sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
            Projects.remove({})
        });

        it('Projects published - no search', async function () {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            Projects.insert(await TestData.fakeCategory())

            const collector = new PublicationCollector()

            return collector.collect('myProjects', null, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { projects } = collections
                expect(projects).to.have.length(1)
            });
        })

        it('Projects published - search', async function () {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            Projects.insert(await TestData.fakeCategory({ title: 'white' }))
            Projects.insert(await TestData.fakeCategory({ title: 'white1' }))
            Projects.insert(await TestData.fakeCategory({ title: 'white2' }))
            Projects.insert(await TestData.fakeCategory({ title: 'white3' }))
            Projects.insert(await TestData.fakeCategory({ title: 'white4' }))
            Projects.insert(await TestData.fakeCategory({ title: 'white5' }))
            Projects.insert(await TestData.fakeCategory({ title: 'red' }))
            Projects.insert(await TestData.fakeCategory({ title: 'blue' }))

            const collector = new PublicationCollector()

            return collector.collect('myProjects', 'white', (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { projects } = collections
                expect(projects).to.have.length(6)
            });
        })
    })
}
