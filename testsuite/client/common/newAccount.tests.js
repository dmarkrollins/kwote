/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Accounts } from 'meteor/accounts-base'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../client-test-helpers';
import { Kwote } from '../../../lib/kwote'

import TestData from '../../testData.js'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../client/common/newAccount.html'
    import '../../../client/common/newAccount.js'

    describe('New Account Dialog', function () {
        let userId;
        let sandbox

        const fakeSettings = {
            backgroundImage: 'fakebackground.png',
            happyPlaceholder: 'happy',
            mehPlaceholder: 'meh',
            sadPlaceholder: 'sad'
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            Template.registerHelper('_', key => key);
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            sandbox.restore()
        });

        it('displays correctly', function () {
            withRenderedTemplate('newAccount', null, (el) => {
                expect($(el).find('#userName')).to.have.length(1)
                expect($(el).find('#emailAddress')).to.have.length(1)
                expect($(el).find('#password')).to.have.length(1)
                expect($(el).find('#confirmPassword')).to.have.length(1)
                expect($(el).find('#btnCancel')).to.have.length(1)
                expect($(el).find('#btnOK')).to.have.length(1)
                expect($(el).find('span.error-message')).to.have.length(1)
                // expect($(el).find('div.fullscreen')[0].style.backgroundImage).to.equal('url("fakebackground.png")')
            });
        })

        it('validates correctly', function () {
            sandbox.stub(Accounts, 'createUser')

            withRenderedTemplate('newAccount', null, (el) => {
                $(el).find('#btnOK')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('A user name is required')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#userName').val('testuser')
                Tracker.flush()

                $(el).find('#btnOK')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('An email address is required')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#emailAddress').val('fakeemail@hotmail.com')
                Tracker.flush()

                $(el).find('#btnOK')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('Passwords required!')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#password').val('fakepw12345')
                $(el).find('#confirmPassword').val('fakepw12345')
                Tracker.flush()

                $(el).find('#btnOK')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('Invalid password - must be >= 8 chars and contain a mix up upper and lower case letters plus at least 1 number :)')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#password').val('Fakepw12345')
                $(el).find('#confirmPassword').val('Fakepw12346')
                Tracker.flush()

                $(el).find('#btnOK')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('Passwords do not match!')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#password').val('Fakepw12345')
                $(el).find('#confirmPassword').val('Fakepw12345')
                Tracker.flush()

                $(el).find('#btnOK')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('You must agree to the Kwote terms of use.')
                expect(Accounts.createUser).to.not.have.been.called
            });
        })

        it('calls create account when it has the info it needs', function () {
            sandbox.stub(Accounts, 'createUser')

            withRenderedTemplate('newAccount', null, (el) => {
                $(el).find('#userName').val('testuser')
                $(el).find('#emailAddress').val('test@gmail.com')
                $(el).find('#password').val('Fakepw12345')
                $(el).find('#confirmPassword').val('Fakepw12345')
                $(el).find('#agreeToTerms').prop('checked', true);

                Tracker.flush()

                $(el).find('#btnOK')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message is not set').to.equal('')
                expect(Accounts.createUser).to.have.been.called
            });
        })
    })
}
