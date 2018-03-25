import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Session } from 'meteor/session'
import { _ } from 'meteor/underscore'
import { Kwote } from '../../lib/kwote'

Template.kwotes.helpers({
    kwoteItem() {
        return Kwote.Components.KwoteItem
    },
    editCreate() {
        return false
    },
    searchValue() {
        const search = Session.get(Kwote.KwoteSearchKey)
        if (search) {
            return search.title || ''
        }
    }
})

Template.kwotes.events({
    'click #btnNewKwote': function (event, instance) {
        FlowRouter.go('/kwotes/add')
    },
    'input #searchBox': _.debounce(function (event, instance) {
        let search = Session.get(Kwote.KwoteSearchKey) || { limit: Kwote.defaultLimit, title: '' }
        if (!_.isObject(search)) {
            search = { limit: Kwote.defaultLimit, title: '' }
        }
        search.title = event.target.value
        search.limit = Kwote.defaultLimit
        Session.set(Kwote.KwoteSearchKey, search)
    }, 500)

})
