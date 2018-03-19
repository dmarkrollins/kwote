import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { Spacebars } from 'meteor/spacebars'
import { FlowRouter } from 'meteor/kadira:flow-router'
import moment from 'moment'
import toastr from 'toastr'

import { Authors } from '../../lib/kwote'
import { ConfirmDialog } from '../common/confirmDialog'

Template.kwoteListItem.helpers({
    lastModified() {
        const dte = this.modifiedAt || this.createdAt
        return moment(dte).format('MM/DD/YYYY')
    },
    quoteBody() {
        return Spacebars.SafeString(this.body)
    },
    hasTags() {
        if (this.categories.length > 0 || this.projects.length > 0) {
            return true
        }
        return false
    },
    hasAuthor() {
        return Authors.find(this.author).count() > 0
    },
    quoteAuthor() {
        const author = Authors.findOne(this.author)
        if (author) {
            const birthYear = author.birthDate ? moment(author.birthDate).format('YYYY') : ''
            const deathYear = author.deathDate ? moment(author.deathDate).format('YYYY') : ''
            return Spacebars.SafeString(`${author.firstName} ${author.lastName} <span style="margin-left: 7px;">${birthYear}-${deathYear}</span>`)
        }
        return ''
    }
})

Template.kwoteListItem.events({
    'click #btnCopy': function (event, instance) {
        toastr.success('Quote body text copied to clip board!')
    },
    'click #btnDelete': function (event, instance) {
        const msg = `Are you sure you want to delete quote <b>${this.title}</b>?`
        const title = 'Delete Quote?'
        ConfirmDialog.showConfirmation(msg, title, 'danger', null, function () {
            Meteor.call('deleteQuote', this._id, function (err, response) {
                if (err) {
                    toastr.error(err.reason)
                } else {
                    FlowRouter.go('/kwotes')
                }
            })
        }, 'danger')
    },
    'click #btnEdit': function (event, instance) {
        FlowRouter.go(`/kwotes/edit/${this._id}`)
    }
})
