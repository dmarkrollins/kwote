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

        it('displays correctly', function () {
            // sandbox.stub(Meteor, 'user').returns(fakeUser)

            withRenderedTemplate('topMenu', null, (el) => {
                expect($(el).find('a#menuProjects'), 'view archives').to.have.length(1)
                expect($(el).find('a#menuCategories'), 'preferences').to.have.length(1)
                expect($(el).find('a#btnKwotes'), 'share sequent').to.have.length(1)
                expect($(el).find('a#btnAuthors'), 'authors btn').to.have.length(1)
                expect($(el).find('a#versionInfo'), 'version info').to.have.length(1)
                expect($(el).find('a#signOut'), 'signout').to.have.length(1)
                expect($(el).find('a#shareKwote'), 'share').to.have.length(1)
            });
        })
    })
}
