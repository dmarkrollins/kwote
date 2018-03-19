import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Session } from 'meteor/session'
import { _ } from 'meteor/underscore'

import { Kwote, Authors } from '../../lib/kwote'

Template.authors.onCreated(function () {
    const self = this
})

Template.authors.helpers({
    searchValue() {
        return Session.get(Kwote.AuthorSearchKey)
    }
})

Template.authors.events({
    'click #btnNewAuthor': function (event, instance) {
        FlowRouter.go('/authors/add')
    },
    'input #searchBox': _.debounce(function (event, instance) {
        Session.set(Kwote.AuthorSearchKey, event.target.value)
    }, 500)
})
