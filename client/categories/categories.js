import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Session } from 'meteor/session'
import { _ } from 'meteor/underscore'

import { Kwote, Authors } from '../../lib/kwote'

Template.categories.onCreated(function () {
    const self = this
})

Template.categories.helpers({
    searchValue() {
        return Session.get(Kwote.CategorySearchKey)
    }
})

Template.categories.events({
    'click #btnNewCategory': function (event, instance) {

    },
    'input #searchBox': _.debounce(function (event, instance) {
        Session.set(Kwote.CategorySearchKey, event.target.value)
    }, 500)
})
