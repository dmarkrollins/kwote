import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { _ } from 'meteor/underscore'
import toastr from 'toastr'
import { $ } from 'meteor/jquery'

import { Kwote, Authors } from '../../lib/kwote'

Template.projects.onCreated(function () {
    const self = this

    self.itemErr = new ReactiveVar('')
    self.showNewItem = new ReactiveVar(false)
})

Template.projects.helpers({
    searchValue() {
        return Session.get(Kwote.ProjectSearchKey)
    },
    showNewItem() {
        return Template.instance().showNewItem.get()
    },
    itemErr() {
        return Template.instance().itemErr.get()
    }
})

Template.projects.events({
    'keypress #newProjectField': function (event, instance) {
        $('#newProjectField').val(event.target.value.toProperCase())
    },
    'click #btnNewProject': function (event, instance) {
        instance.showNewItem.set(true)
        instance.itemErr.set('')
    },
    'click #btnCancelAdd': function (event, instance) {
        instance.showNewItem.set(false)
    },
    'click #btnAdd': function (event, instance) {
        const newValue = $('#newProjectField').val()

        if (newValue === '') {
            instance.itemErr.set('Project text is required!')
            return
        }

        Meteor.call('createProject', newValue, function (err, response) {
            if (err) {
                toastr.error(err.reason)
                return
            }
            // toastr.success('Project added successfully!')
            instance.showNewItem.set(false)
        })
    },
    'input #searchBox': _.debounce(function (event, instance) {
        Session.set(Kwote.ProjectSearchKey, event.target.value)
    }, 500)
})
