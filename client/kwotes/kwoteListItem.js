import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { Spacebars } from 'meteor/spacebars'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Session } from 'meteor/session'
import { $ } from 'meteor/jquery'
import moment from 'moment'
import toastr from 'toastr'

import { Kwote, Authors } from '../../lib/kwote'
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
    },
    itemId() {
        return this._id
    }
})

Template.kwoteListItem.events({
    'click #btnCopy': function (event, instance) {
        Clipboard.copy(this.body) // eslint-disable-line
        toastr.success('Quote body text copied to clip board!')
    },
    'click #btnDelete': function (event, instance) {
        const self = this
        const msg = `Are you sure you want to delete quote <b>${self.title}</b>?`
        const title = 'Delete Quote?'
        ConfirmDialog.showConfirmation(msg, title, 'danger', null, function () {
            Meteor.call('deleteKwote', self._id, function (err, response) {
                if (err) {
                    toastr.error(err.reason)
                } else {
                    toastr.info('Kwote removed successfully!')
                    FlowRouter.go('/kwotes')
                }
            })
        }, 'danger')
    },
    'click #btnEdit': function (event, instance) {
        const elemID = `div#${this._id}`
        const scrollValue = $(elemID).offset().top - 21
        Session.set(Kwote.ListScrollValue, scrollValue)
        FlowRouter.go(`/kwotes/edit/${this._id}`)
    }
})
