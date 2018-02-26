import { Template } from 'meteor/templating'
import { Kwote } from '../../lib/kwote'

Template.kwotesList.helpers({
    hasQuotes() {
        return false
    },
    kwote() {
        return []
    },
    truncedBody() {
        this.body.substring(0, 256)
    },
    addModify() {
        return false;
    },
    kwoteItem() {
        return Kwote.Components.KwoteItem;
    }
})
