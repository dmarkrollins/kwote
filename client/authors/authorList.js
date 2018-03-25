import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'
import { _ } from 'meteor/underscore'
import toastr from 'toastr'
import moment from 'moment'

import { Kwote, Authors } from '../../lib/kwote'
import { ConfirmDialog } from '../common/confirmDialog'

Template.authorList.onCreated(function () {
    const self = this

    self.loaded = new ReactiveVar(0)
    self.getSearch = () => Session.get(Kwote.AuthorSearchKey) || ''

    self.autorun(function () {
        const search = self.getSearch()
        const subscription = self.subscribe('myAuthors', search)

        if (subscription.ready()) {
            self.loaded.set(Authors.find().count())
        }
    })
})

Template.authorList.helpers({
    hasAuthors() {
        return Authors.find().count() > 0
    },
    author() {
        return Authors.find({}, { sort: { lastName: 1 } })
    },
    birthDateText() {
        if (!this.birthDate) {
            return ''
        }
        return moment(this.birthDate).format('YYYY')
    },
    deathDateText() {
        if (!this.deathDate) {
            return ''
        }
        return moment(this.deathDate).format('YYYY')
    },
    shortComments() {
        return this.comments.substring(0, 60)
    }
})

Template.authorList.events({
    'click #btnEdit': function (event, instance) {
        FlowRouter.go(`/authors/edit/${this._id}`)
    },
    'click #btnDelete': function (event, instance) {
        const title = 'Delete Author'
        const authorName = `${this.firstName} ${this.lastName}`
        const msg = `Are you sure you want permanently delete <b>${authorName}</b>? <br/><br/>All associated quote author references will be removed!`

        ConfirmDialog.showConfirmation(msg, title, 'danger', null, () => {
            Meteor.call('deleteAuthor', this._id, function (err) {
                if (err) {
                    toastr.error(err.reason)
                    return
                }
                toastr.info('Author removed successfully!')
            })
        })
    },
    'click #btnViewQuotes': function (event, instance) {
        Kwote.setKwoteSearchValue(this.lastName)
        FlowRouter.go('/kwotes')
    }
})
