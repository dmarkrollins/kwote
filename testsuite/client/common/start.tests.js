/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../client-test-helpers';

import TestData from '../../testData.js'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../client/common/start.html'
    import '../../../client/common/start.js'

    describe('Start Dialog', function () {
        let userId;
        let sandbox

        const fakeSettings = {
            backgroundImage: 'fakebackground.png',
            happyPlaceholder: 'happy',
            mehPlaceholder: 'meh',
            sadPlaceholder: 'sad'
        }

        beforeEach(function () {
            Template.registerHelper('_', key => key);
            sandbox = sinon.createSandbox()
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            sandbox.restore()
        });

        it('displays correctly', function () {
            withRenderedTemplate('start', null, (el) => {
                expect($(el).find('#userName')).to.have.length(1)
                expect($(el).find('#password')).to.have.length(1)
                expect($(el).find('#btnNext')).to.have.length(1)
                expect($(el).find('#btnNewAccount')).to.have.length(1)
                expect($(el).find('span#errorMessage')).to.have.length(1)
                expect($(el).find('#learnMore')).to.have.length(1)
                expect($(el).find('span.error-message')).to.have.length(1)
                expect($(el).find('div.header')).to.have.length(1)
            });
        })

        it('validates input', function () {
            sandbox.stub(Meteor, 'loginWithPassword')

            withRenderedTemplate('start', null, (el) => {
                expect($(el).find('#btnNext'), 'should have next button').to.have.length(1)

                $(el).find('#btnNext')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('Invalid user name and password combination!')
                expect(Meteor.loginWithPassword).to.not.have.been.called
            });
        })

        it('with valid input calls login', function () {
            sandbox.stub(Meteor, 'loginWithPassword')

            withRenderedTemplate('start', null, (el) => {
                expect($(el).find('#btnNext'), 'should have next button').to.have.length(1)

                $(el).find('#userName').val('testuser')
                $(el).find('#password').val('testpw')
                Tracker.flush()

                $(el).find('#btnNext')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('')
                expect(Meteor.loginWithPassword).to.have.been.called
            });
        })
    })
}
