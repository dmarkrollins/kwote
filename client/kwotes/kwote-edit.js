import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactiveVar } from 'meteor/reactive-var'
import { _ } from 'meteor/underscore'
import toastr from 'toastr'
import { $ } from 'meteor/jquery'

import { Kwote, Quotes, Projects, Categories, Authors } from '../../lib/kwote'
import { Logger } from '../../lib/logger'

import './kwote-edit.html'

Template.kwoteEdit.onCreated(function () {
    const self = this;

    self.handleCancel = () => FlowRouter.go('/kwotes')

    self.UpdateKwote = (kwote) => {
        Meteor.call('updateKwote', kwote, function (err, response) {
            if (err) {
                toastr.error(err.reason)
            } else {
                // toastr.success('Kwote updated successfully')
                FlowRouter.go('/kwotes')
            }
        })
    }
    self.autorun(function () {
        console.log('subs are ready', FlowRouter.subsReady())
    })
})

Template.kwoteEdit.helpers({
    pageTitle() {
        return 'Create Kwote'
    },
    kwoteItem() {
        return Kwote.Components.KwoteItem
    },
    kwoteObj() {
        return Quotes.findOne(FlowRouter.getParam('id'))
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/kwotes')
        }
    },
    saveHandler() {
        const instance = Template.instance();
        return function (kwote) {
            instance.UpdateKwote(kwote)
        }
    },
    kwoteBodyErrorHandler() {
        const instance = Template.instance();
        return function (isError) {
            // custom react component does not have built in way to set class
            if (isError) {
                $('#kwote').addClass('form-error')
            } else {
                $('#kwote').removeClass('form-error')
            }
        }
    },
    projectItems() {
        const retval = []
        _.map(Projects.find().fetch(), function (item) {
            const obj = {}
            obj.label = item.title
            obj.value = item._id
            retval.push(obj)
        })
        return retval
    },
    categoryItems() {
        const retval = []
        _.map(Categories.find().fetch(), function (item) {
            const obj = {}
            obj.label = item.title
            obj.value = item._id
            retval.push(obj)
        })
        return retval
    },
    authorItems() {
        const retval = []
        retval.push({ label: 'Anonymous', value: '' })
        _.map(Authors.find().fetch(), function (item) {
            const obj = {}
            obj.label = `${item.firstName} ${item.lastName}`
            obj.value = item._id
            retval.push(obj)
        })
        return retval
    },
    isReady() {
        console.log('kwotes', FlowRouter.subsReady('singlequote'))
        console.log('projects', FlowRouter.subsReady('projects'))
        console.log('authors', FlowRouter.subsReady('authors'))
        console.log('categories', FlowRouter.subsReady('categories'))
        return FlowRouter.subsReady()
    }

})
