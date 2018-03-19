import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { _ } from 'meteor/underscore'
import toastr from 'toastr'
import { $ } from 'meteor/jquery'

import { Kwote, Projects, Categories, Authors } from '../../lib/kwote'
import { Logger } from '../../lib/logger'

import './kwote-add.html'

Template.kwoteAdd.onCreated(function () {
    const self = this;

    self.handleCancel = () => FlowRouter.go('/kwotes')

    self.CreateKwote = (kwote) => {
        Meteor.call('createKwote', kwote, function (err, response) {
            if (err) {
                toastr.error(err.reason)
            } else {
                toastr.info('Kwote created successfully')
                FlowRouter.go('/kwotes')
            }
        })
    }
})

Template.kwoteAdd.helpers({
    pageTitle() {
        return 'Create Kwote'
    },
    kwoteItem() {
        return Kwote.Components.KwoteItem
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/kwotes')
        }
    },
    saveHandler() {
        const instance = Template.instance();
        return function (kwote) {
            instance.CreateKwote(kwote)
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
        _.map(Authors.find().fetch(), function (item) {
            const obj = {}
            obj.label = `${item.firstName} ${item.lastName}`
            obj.value = item._id
            retval.push(obj)
        })
        return retval
    }

})
