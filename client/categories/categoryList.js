import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'

import { Kwote, Categories } from '../../lib/kwote'
import { ConfirmDialog } from '../common/confirmDialog'

Template.categoryList.onCreated(function () {
    const self = this

    self.editId = new ReactiveVar('')
    self.loaded = new ReactiveVar(0)
    self.getSearch = () => Session.get(Kwote.CategorySearchKey) || ''

    self.autorun(function () {
        const search = self.getSearch()
        const subscription = self.subscribe('myCategories', search)

        if (subscription.ready()) {
            self.loaded.set(Categories.find().count())
        }
    })
})

Template.categoryList.helpers({
    hasCategories() {
        return Categories.find().count() > 0
    },
    category() {
        return Categories.find()
    },
    editMode() {
        return this._id === Template.instance().editId.get()
    }
})

Template.categoryList.events({
    'click #btnDelete': function (event, instance) {
        const title = 'Delete Category?'
        const msg = `Are you sure you want to permanently delete category: <b>${this.title}</b>?`

        ConfirmDialog.showConfirmation(msg, title, 'danger', null, () => {
            // Meteor.call('deleteAuthor', event.currentTarget.dataset.id, function (err) {
            //     if (err) {
            //         console.log(err)
            //         toastr.error('Could not remove action - try again later')
            //     }
            // })
        })
    },
    'click #btnEdit': function (event, instance) {
        instance.editId.set(this._id)
    },
    'click #btnSave': function (event, instance) {
        instance.editId.set('')
    },
    'click #btnCancel': function (event, instance) {
        instance.editId.set('')
    }

})
