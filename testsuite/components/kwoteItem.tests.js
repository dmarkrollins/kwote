/* eslint-env mocha */
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import Adapter from 'enzyme-adapter-react-16'
import { mount, shallow, simulate, configure } from 'enzyme'
import chai, { expect } from 'chai'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'
import sinonChai from 'sinon-chai'

import { Kwote } from '../../lib/kwote'

import { TestData } from '../../testsuite/testData'

configure({ adapter: new Adapter() });

chai.use(chaiEnzyme())
chai.use(sinonChai)

if (Meteor.isClient) {
    let isSaved = null
    let isCancelled = null

    import '../../client/components/registerAll'

    describe('Kwote Item Component', function () {
        let sandbox

        const fakeKwote = {
            title: 'fake title',
            body: 'fake-body'
        }

        before(function () {
            sandbox = sinon.createSandbox()
        });

        beforeEach(() => {
            isSaved = sandbox.stub()
            isCancelled = sandbox.stub()
        })

        afterEach(() => {
            sandbox.restore()
        })

        it('renders correctly with no quote', () => {
            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />)

            expect(wrapper.find('input#kwoteTitle').get(0).props.value, 'title is empty').to.equal('')
            expect(wrapper.find('#kwoteBody').get(0).props.data, 'body is empty').to.equal('')
            expect(wrapper.find('button'), 'should be 2 buttons').to.have.length(2)
            expect(wrapper.find('#kwoteBody').get(0).props.buttons, 'button count correct').to.have.length(5)
        })

        it('renders correctly with quote data', () => {
            const id = Random.id()
            const kwote = TestData.fakeQuote({ author: { label: 'fake title', value: id } })

            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                kwote={kwote}
            />)

            expect(wrapper.find('input#kwoteTitle').get(0).props.value, 'title is empty').to.equal(kwote.title)
            expect(wrapper.find('#kwoteBody').get(0).props.data, 'body is empty').to.equal(kwote.body)
        })

        it('invokes save call back with correct values', function () {
            const id = Random.id()
            const kwote = TestData.fakeQuote({ author: { label: 'fake title', value: id } })

            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />)

            wrapper.find('input#kwoteTitle').simulate('change', (({ target: { value: 'fake title' } })))
            wrapper.find('#kwoteBody').get(0).props.onChange(({ target: { innerHTML: 'fake body' } }))
            wrapper.find('#authorSelect').get(0).props.onChange(('change', id))

            const projectId = Random.id()
            const fakeProjects = [
                { label: 'fake-project', value: 'fake-project' },
                { label: 'fake-project1', value: projectId }
            ]

            const categoryId = Random.id()
            const fakeCategories = [
                { label: 'fake-category', value: 'fake-category' },
                { label: 'fake-category1', value: categoryId }
            ]

            wrapper.find('#projectSelect').get(0).props.onChange(('change', fakeProjects))
            wrapper.find('#categorySelect').get(0).props.onChange(('change', fakeCategories))

            wrapper.find('button.btn-success').simulate('click')

            expect(
                isSaved,
                'save event handler called when button is clicked'
            ).to.have.been.called

            const args = isSaved.args[0][0]
            expect(args._id).to.equal('')
            expect(args.title).to.equal('Fake Title')
            expect(args.author).to.equal(id)
            expect(args.body).to.equal('fake body')

            expect(args.categories[0].label).to.equal('Fake-category')
            expect(args.categories[0].value).to.equal('placeholder')
            expect(args.categories[1].label).to.equal('Fake-category1')
            expect(args.categories[1].value).to.equal(categoryId)

            expect(args.projects[0].label).to.equal('Fake-project')
            expect(args.projects[0].value).to.equal('placeholder')
            expect(args.projects[1].label).to.equal('Fake-project1')
            expect(args.projects[1].value).to.equal(projectId)
        })

        it('validates correctly - no body or title', function () {
            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />)


            wrapper.find('button.btn-success').simulate('click')

            expect(
                isSaved,
                'save event handler NOT called when save is clicked'
            ).to.not.have.been.called


            expect(wrapper.find('input#kwoteTitle.form-error'), 'title input').to.have.length(1)
            // expect(div.find('#kwoteBody.form-error'), 'rich text edit').to.have.length(1)
        })

        it('validates correctly - no title', function () {
            const kwote = TestData.fakeQuote()

            kwote.title = ''

            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                kwote={kwote}
            />)


            wrapper.find('button.btn-success').simulate('click')

            expect(
                isSaved,
                'save event handler NOT called when save is clicked'
            ).to.not.have.been.called


            expect(wrapper.find('input#kwoteTitle.form-error'), 'title input').to.have.length(1)
        })


        it('validates correctly - no body', function () {
            const kwote = TestData.fakeQuote()

            kwote.body = ''

            const wrapper = mount(<Kwote.Components.KwoteItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                kwote={kwote}
            />)

            wrapper.find('button.btn-success').simulate('click')

            expect(
                isSaved,
                'save event handler NOT called when save is clicked'
            ).to.not.have.been.called

            // expect(div.find('#kwoteBody.form-error'), 'rich text edit').to.have.length(1)
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
