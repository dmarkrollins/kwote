/* eslint-env mocha */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, simulate, configure } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';

import { Kwote } from '../../lib/kwote'

configure({ adapter: new Adapter() });

chai.use(chaiEnzyme());

if (Meteor.isClient) {
    let isSaved = null
    let isCancelled = null

    import '../../client/components/registerAll'

    describe('Action Button Component', function () {
        const fakeKwote = {
            title: 'fake title',
            body: 'fake-body'
        }

        before(function () {
            isSaved = sinon.stub()
            isCancelled = sinon.stub()
        });

        it('falls into create mode when no kwote is passed in', function () {
            // need to mount for 'simulate' to work

            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />);

            expect(wrapper.find('input#title'), 'title is empty').to.have.text('')
            expect(wrapper.find('input#body'), 'body is empty').to.have.text('')
            expect(wrapper.find('button'), 'should be 2 buttons').to.have.length(2)

            wrapper.find('input#title').text = 'fake text'
            wrapper.find('input#body').text = 'fake body'

            wrapper.find('button').first().simulate('click');

            expect(
                isSaved,
                'clickcb called when button is clicked'
            ).to.have.been.called

            expect(isSaved).to.have.been.calledWith({ title: 'fake text', body: 'fake body' })
        });
    })
}
