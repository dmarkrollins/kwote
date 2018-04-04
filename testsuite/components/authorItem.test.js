/* eslint-env mocha */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, simulate, configure } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai'

import { Kwote, Authors } from '../../lib/kwote'

configure({ adapter: new Adapter() });

chai.use(chaiEnzyme())
chai.use(sinonChai)

if (Meteor.isClient) {
    import '../../client/components/registerAll'

    describe('Author Item Component', function () {
        let isSaved
        let isCancelled
        let sandbox

        const fakeKwote = {
            title: 'fake title',
            body: 'fake-body'
        }

        before(function () {
            sandbox = sinon.createSandbox()
        })

        before(function () {
            isSaved = sandbox.stub()
            isCancelled = sandbox.stub()
        })

        afterEach(function () {
            sandbox.restore()
        })

        it('displays correctly no author', function () {
            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />)

            expect(wrapper.find('input#firstName'), 'first name found').to.have.length(1)
            expect(wrapper.find('input#lastName'), 'first name found').to.have.length(1)
            expect(wrapper.find('input#birthDate'), 'first name found').to.have.length(1)
            expect(wrapper.find('input#deathDate'), 'first name found').to.have.length(1)
            expect(wrapper.find('textarea#comments'), 'first name found').to.have.length(1)
            expect(wrapper.find('input#firstName').get(0).props.value).to.equal('')
            expect(wrapper.find('input#lastName').get(0).props.value).to.equal('')
            expect(wrapper.find('textarea#comments').get(0).props.value).to.equal('')
            expect(wrapper.find('input#birthDate').get(0).props.value).to.equal('')
            expect(wrapper.find('input#deathDate').get(0).props.value).to.equal('')

            expect(wrapper.find('button'), 'should have 2 buttons').to.have.length(2)
        })

        it('displays authoro object correctly with valid dates', function () {
            const fakeAuthor = {
                _id: '',
                firstName: 'fake first name',
                lastName: 'fake last name',
                birthDate: new Date('12/01/2000'),
                deathDate: new Date('12/01/2010'),
                comments: 'fake comments'
            }

            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                author={fakeAuthor}
            />)

            expect(wrapper.find('input#firstName').get(0).props.value).to.equal('fake first name')
            expect(wrapper.find('input#lastName').get(0).props.value).to.equal('fake last name')
            expect(wrapper.find('textarea#comments').get(0).props.value).to.equal('fake comments')
            expect(wrapper.find('input#birthDate').get(0).props.value).to.equal('2000-12-01')
            expect(wrapper.find('input#deathDate').get(0).props.value).to.equal('2010-12-01')
        })

        it('displays author object correctly with null dates', function () {
            const fakeAuthor = {
                _id: '',
                firstName: 'fake first name',
                lastName: 'fake last name',
                birthDate: null,
                deathDate: null,
                comments: 'fake comments'
            }

            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                author={fakeAuthor}
            />)

            expect(wrapper.find('input#firstName').get(0).props.value).to.equal('fake first name')
            expect(wrapper.find('input#lastName').get(0).props.value).to.equal('fake last name')
            expect(wrapper.find('textarea#comments').get(0).props.value).to.equal('fake comments')
            expect(wrapper.find('input#birthDate').get(0).props.value).to.equal('')
            expect(wrapper.find('input#deathDate').get(0).props.value).to.equal('')
        })

        it('displays author object correctly with no dates', function () {
            const fakeAuthor = {
                _id: '',
                firstName: 'fake first name',
                lastName: 'fake last name',
                comments: 'fake comments'
            }

            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                author={fakeAuthor}
            />)

            expect(wrapper.find('input#firstName').get(0).props.value).to.equal('fake first name')
            expect(wrapper.find('input#lastName').get(0).props.value).to.equal('fake last name')
            expect(wrapper.find('textarea#comments').get(0).props.value).to.equal('fake comments')
            expect(wrapper.find('input#birthDate').get(0).props.value).to.equal('')
            expect(wrapper.find('input#deathDate').get(0).props.value).to.equal('')
        })

        it('calls save handler correctly - no dates', function () {
            const fakeAuthor = {
                _id: '',
                firstName: 'fake first name',
                lastName: 'fake last name',
                comments: 'fake comments'
            }

            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                author={fakeAuthor}
            />)

            wrapper.find('button.btn-success').simulate('click')

            expect(isSaved).to.have.been.calledWith({
                _id: '',
                comments: 'fake comments',
                lastName: 'fake last name',
                firstName: 'fake first name'
            })
        })

        it('calls save handler correctly - null dates', function () {
            const fakeAuthor = {
                _id: '',
                firstName: 'fake first name',
                lastName: 'fake last name',
                comments: 'fake comments',
                birthDate: null,
                deathDate: null
            }

            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                author={fakeAuthor}
            />)

            wrapper.find('button.btn-success').simulate('click')

            expect(isSaved).to.have.been.calledWith({
                _id: '',
                comments: 'fake comments',
                lastName: 'fake last name',
                firstName: 'fake first name'
            })
        })

        it('calls save handler correctly - valid dates', function () {
            const fakeAuthor = {
                _id: 'fakeid',
                firstName: 'fake first name',
                lastName: 'fake last name',
                comments: 'fake comments',
                birthDate: new Date('12/01/2000'),
                deathDate: new Date('12/01/2010')
            }

            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                author={fakeAuthor}
            />)

            wrapper.find('button.btn-success').simulate('click')

            expect(isSaved).to.have.been.calledWith({
                _id: 'fakeid',
                comments: 'fake comments',
                lastName: 'fake last name',
                firstName: 'fake first name',
                birthDate: '2000-12-01',
                deathDate: '2010-12-01'
            })
        })

        it('validates correctly - no author', function () {
            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />)

            wrapper.find('button.btn-success').simulate('click')

            expect(wrapper.state().errorMessage).to.equal('Author last name is required!')
        })


        it('validates correctly - no first name', function () {
            const fakeAuthor = {
                _id: '',
                firstName: '',
                lastName: 'fake last name',
                comments: 'fake comments',
                birthDate: new Date('12/01/2000'),
                deathDate: new Date('12/01/2010')
            }

            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                author={fakeAuthor}
            />)

            wrapper.find('button.btn-success').simulate('click')

            expect(wrapper.state().errorMessage).to.equal('Author first name is required!')
            expect(wrapper.find('input#firstName').hasClass('form-error')).to.be.true
        })

        it('validates correctly - no last name', function () {
            const fakeAuthor = {
                _id: '',
                firstName: 'fake first name',
                lastName: '',
                comments: 'fake comments',
                birthDate: new Date('12/01/2000'),
                deathDate: new Date('12/01/2010')
            }

            const wrapper = mount(<Kwote.Components.AuthorItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                author={fakeAuthor}
            />)

            wrapper.find('button.btn-success').simulate('click')

            expect(wrapper.state().errorMessage).to.equal('Author last name is required!')
            expect(wrapper.find('input#lastName').hasClass('form-error')).to.be.true
        })

        it('invokes cancel call back', function () {
            // need to mount for 'simulate' to work

            const wrapper = mount(<Kwote.Components.AuthorItem
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
