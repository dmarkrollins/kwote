import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Session } from 'meteor/session'
import { _ } from 'meteor/underscore'

import { Kwote, Authors } from '../../lib/kwote'

Template.projects.onCreated(function () {
    const self = this
})

Template.projects.helpers({
    searchValue() {
        return Session.get(Kwote.ProjectSearchKey)
    }
})

Template.projects.events({
    'click #btnNewProject': function (event, instance) {

    },
    'input #searchBox': _.debounce(function (event, instance) {
        Session.set(Kwote.ProjectSearchKey, event.target.value)
    }, 500)
})
