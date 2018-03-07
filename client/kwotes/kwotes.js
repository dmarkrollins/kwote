import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Kwote } from '../../lib/kwote'

Template.kwotes.helpers({
    kwoteItem() {
        return Kwote.Components.KwoteItem
    },
    editCreate() {
        return false
    }
})

Template.kwotes.events({
    'click #btnNewKwote': function (event, instance) {
        FlowRouter.go('/kwotes/add')
    }
})
