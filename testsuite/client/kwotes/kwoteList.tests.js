/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import StubCollections from 'meteor/hwillson:stub-collections'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../client-test-helpers';
import { Quotes } from '../../../lib/kwote'

import TestData from '../../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../client/kwotes/kwotesList.html'
    import '../../../client/kwotes/kwotesList.js'
    import '../../../client/kwotes/kwoteListItem.html'
    import '../../../client/kwotes/kwoteListItem.js'

    describe('Kwote List', function () {
        let userId;
        let sandbox
        let fakeCollection

        beforeEach(function () {
            Template.registerHelper('_', key => key);
            sandbox = sinon.createSandbox()
            StubCollections.stub([Quotes]);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));

            fakeCollection = {
                count: sandbox.stub().returns(0),
                fetch: sandbox.stub().returns([]),
            }
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            StubCollections.restore()
            sandbox.restore()
        });

        it('displays correctly - No Kwotes', function () {
            withRenderedTemplate('kwotesList', null, (el) => {
                expect($(el).find('div.kwote-list-item')).to.have.length(0)
                expect($(el).find('div.helpText')).to.have.length(1)
                expect($(el).find('div.helpText')[0].innerText).to.contain('No Kwotes found!')
            });
        })

        it('displays correctly - No Kwotes Search', function () {
            sandbox.stub(Session, 'get').returns({ limit: 10, title: 'test search' })
            withRenderedTemplate('kwotesList', null, (el) => {
                expect($(el).find('div.kwote-list-item')).to.have.length(0)
                expect($(el).find('div.helpText')).to.have.length(1)
                expect($(el).find('div.helpText')[0].innerText).to.contain('Search found no Kwotes!')
            });
        })

        it('displays correctly - Kwotes returned', async function () {
            const quotes = await TestData.TestData.fakeQuotesList({ count: 3 })
            quotes.forEach((quote) => {
                Quotes.insert(quote)
            })
            withRenderedTemplate('kwotesList', null, (el) => {
                expect($(el).find('div.kwote-list-item')).to.have.length(3)
                expect($(el).find('div.helpText')).to.have.length(0)
            });
        })
    })
}
