/* eslint-env mocha */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, simulate, configure } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai'

import { Kwote } from '../../lib/kwote'

configure({ adapter: new Adapter() });

chai.use(chaiEnzyme())
chai.use(sinonChai)

if (Meteor.isClient) {
    let isSaved = null
    let isCancelled = null

    import '../../client/components/registerAll'

    describe('Kwote Item Component', function () {
        const fakeKwote = {
            title: 'fake title',
            body: 'fake-body'
        }

        before(function () {
            isSaved = sinon.stub()
            isCancelled = sinon.stub()
        });

        it('invokes save call back with correct values', function () {
            // need to mount for 'simulate' to work

            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />);

            expect(wrapper.find('input.kwote-title'), 'title is empty').to.have.text('')
            expect(wrapper.find('input.kwote-body'), 'body is empty').to.have.text('')
            expect(wrapper.find('button'), 'should be 2 buttons').to.have.length(2)

            wrapper.find('input.kwote-title').simulate('change', (({ target: { value: 'fake title' } })))
            wrapper.find('input.kwote-body').simulate('change', (({ target: { value: 'fake body' } })))

            wrapper.find('button').first().simulate('click');

            expect(
                isSaved,
                'save event handler called when button is clicked'
            ).to.have.been.called

            expect(isSaved).to.have.been.calledWith({ kwoteId: '', title: 'fake title', body: 'fake body' })
        });

        it('invokes cancel call back', function () {
            // need to mount for 'simulate' to work

            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />);

            wrapper.find('button').last().simulate('click');

            expect(
                isCancelled,
                'cancel event handler called when button is clicked'
            ).to.have.been.called
        });
    })
}
