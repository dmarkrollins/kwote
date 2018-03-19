import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'

import { Kwote, Projects } from '../../lib/kwote'
import { ConfirmDialog } from '../common/confirmDialog'

Template.projectList.onCreated(function () {
    const self = this

    self.editId = new ReactiveVar('')
    self.loaded = new ReactiveVar(0)
    self.getSearch = () => Session.get(Kwote.ProjectSearchKey) || ''

    self.autorun(function () {
        const search = self.getSearch()
        const subscription = self.subscribe('myProjects', search)

        if (subscription.ready()) {
            self.loaded.set(Projects.find().count())
        }
    })
})

Template.projectList.helpers({
    hasProjects() {
        return Projects.find().count() > 0
    },
    project() {
        return Projects.find()
    },
    editMode() {
        return this._id === Template.instance().editId.get()
    }
})

Template.projectList.events({
    'click #btnDelete': function (event, instance) {
        const title = 'Delete Project?'
        const msg = `Are you sure you want to permanently delete project: <b>${this.title}</b>?`

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
