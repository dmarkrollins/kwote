import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import toastr from 'toastr'
import { $ } from 'meteor/jquery'
import { Kwote, Projects } from '../../lib/kwote'
import { ConfirmDialog } from '../common/confirmDialog'

Template.projectList.onCreated(function () {
    const self = this

    self.editId = new ReactiveVar('')
    self.loaded = new ReactiveVar(0)
    self.itemErr = new ReactiveVar('')
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
    },
    itemErr() {
        return Template.instance().itemErr.get()
    }
})

Template.projectList.events({
    // 'keypress #editValue': function (event, instance) {
    //     $('#editValue').val(event.target.value.toProperCase())
    // },
    'click #btnDelete': function (event, instance) {
        const title = 'Delete Project?'
        const msg = `Are you sure you want to permanently delete project: <b>${this.title}</b>?`

        ConfirmDialog.showConfirmation(msg, title, 'danger', null, () => {
            Meteor.call('deleteProject', this._id, function (err, response) {
                if (err) {
                    toastr.error(err.reason)
                } else {
                    toastr.info('Project removed successfully!')
                }
            })
        })
    },
    'click #btnEdit': function (event, instance) {
        instance.editId.set(this._id)
        instance.itemErr.set('')
    },
    'click #btnSave': function (event, instance) {
        const value = $('#editValue').val()
        const doc = {}
        doc._id = this._id
        doc.title = value

        if (value === '') {
            instance.itemErr.set('Project text is required!')
            return
        }

        Meteor.call('updateProject', doc, function (err, result) {
            if (err) {
                toastr.error(err.reason)
                return
            }
            // toastr.success('Project updated successfully!')
            instance.editId.set('')
        })
    },
    'click #btnCancel': function (event, instance) {
        instance.editId.set('')
    },
    'click #btnViewQuotes': function (event, instance) {
        Kwote.setKwoteSearchValue(this.title)
        FlowRouter.go('/kwotes')
    }

})
