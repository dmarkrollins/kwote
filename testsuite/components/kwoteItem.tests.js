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
            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />)

            expect(wrapper.find('input#kwoteTitle').get(0).props.value, 'title is empty').to.equal('')
            expect(wrapper.find('#kwoteBody').get(0).props.data, 'body is empty').to.equal('')
            expect(wrapper.find('button'), 'should be 2 buttons').to.have.length(3)

            wrapper.find('input#kwoteTitle').simulate('change', (({ target: { value: 'fake title' } })))
            wrapper.find('#kwoteBody').get(0).props.onChange(({ target: { value: 'fake body' } }))

            wrapper.find('button.btn-success').simulate('click')

            expect(
                isSaved,
                'save event handler called when button is clicked'
            ).to.have.been.called

            expect(isSaved).to.have.been.calledWith({
                _id: '', author: '', categories: [], projects: [], title: 'fake title', body: 'fake body'
            })
        })

        it('validates correctly - no title', function () {

        })

        it('validates correctly - no quote', function () {

        })

        it('invokes cancel call back', function () {
            // need to mount for 'simulate' to work

            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />)

            wrapper.find('button').last().simulate('click')

            expect(
                isCancelled,
                'cancel event handler called when button is clicked'
            ).to.have.been.called
        })
    })
}
