import { Template } from 'meteor/templating'
import { Kwote } from '../../lib/kwote'

Template.kwotes.helpers({
    kwoteItem() {
        return Kwote.Components.KwoteItem
    },
    editCreate() {
        return false
    }
})
