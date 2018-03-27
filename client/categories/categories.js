import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import toastr from 'toastr'
import { _ } from 'meteor/underscore'
import { $ } from 'meteor/jquery'

import { Kwote, Authors } from '../../lib/kwote'

Template.categories.onCreated(function () {
    const self = this
    self.itemErr = new ReactiveVar('')
    self.showNewItem = new ReactiveVar(false)
})

Template.categories.helpers({
    searchValue() {
        return Session.get(Kwote.CategorySearchKey)
    },
    showNewItem() {
        return Template.instance().showNewItem.get()
    },
    itemErr() {
        return Template.instance().itemErr.get()
    }

})

Template.categories.events({
    'keypress #newCategoryField': function (event, instance) {
        $('#newCategoryField').val(event.target.value.toProperCase())
    },
    'click #btnNewCategory': function (event, instance) {
        instance.showNewItem.set(true)
        instance.itemErr.set('')
    },
    'input #searchBox': _.debounce(function (event, instance) {
        Session.set(Kwote.CategorySearchKey, event.target.value)
    }, 500),
    'click #btnAdd': function (event, instance) {
        const newCategory = $('#newCategoryField').val()

        if (newCategory === '') {
            instance.itemErr.set('Category text is required!')
            return
        }

        Meteor.call('createCategory', newCategory, function (err, response) {
            if (err) {
                toastr.error(err.reason)
                return
            }
            toastr.success('Category added successfully!')
            instance.showNewItem.set(false)
        })
    },
    'click #btnCancelAdd': function (event, instance) {
        instance.showNewItem.set(false)
    }
})
