/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { Session } from 'meteor/session'
import { Tracker } from 'meteor/tracker'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment'
import StubCollections from 'meteor/hwillson:stub-collections';
import { withRenderedTemplate } from '../client-test-helpers';

import { TestData } from '../../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../client/common/topMenu.html'
    import '../../../client/common/topMenu.js'

    describe('topMenu Menu', function () {
        let userId
        let sandbox

        const fakeRoute = {
            route: {
                name: 'Fake Route'
            }
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            Template.registerHelper('_', key => key);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
            sandbox.stub(FlowRouter, 'current').returns(fakeRoute)
        });

        afterEach(function () {
            Template.deregisterHelper('_')
            StubCollections.restore()
            sandbox.restore()
        })

        it('displays correctly authenticated', function () {
            sandbox.stub(Meteor, 'userId').returns('fake-id')
            withRenderedTemplate('topMenu', null, (el) => {
                expect($(el).find('a#menuProjects'), 'projects option').to.have.length(1)
                expect($(el).find('a#menuCategories'), 'categories option').to.have.length(1)
                expect($(el).find('a#btnKwotes'), 'kwotes button').to.have.length(1)
                expect($(el).find('a#btnAuthors'), 'authors btn').to.have.length(1)
                expect($(el).find('i.fa-thumb-tack'), 'version info').to.have.length(1)
                expect($(el).find('a#signOut'), 'signout').to.have.length(1)
                expect($(el).find('a#shareKwote'), 'share').to.have.length(1)
            });
        })

        it('displays correctly un-authenticated', function () {
            sandbox.stub(Meteor, 'userId').returns(null)
            withRenderedTemplate('topMenu', null, (el) => {
                expect($(el).find('a#menuProjects'), 'projects option').to.have.length(0)
                expect($(el).find('a#menuCategories'), 'categories option').to.have.length(0)
                expect($(el).find('a#btnKwotes'), 'kwotes button').to.have.length(0)
                expect($(el).find('a#btnAuthors'), 'authors btn').to.have.length(0)
                expect($(el).find('i.fa-thumb-tack'), 'version info').to.have.length(0)
                expect($(el).find('a#signOut'), 'signout').to.have.length(0)
                expect($(el).find('a#shareKwote'), 'share').to.have.length(0)
            });
        })
    })
}
