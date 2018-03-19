import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import toastr from 'toastr'

import { Kwote, Authors } from '../../lib/kwote'

Template.authorEdit.onCreated(function () {
    const self = this

    self.updateAuthor = (author) => {
        Meteor.call('updateAuthor', author, function (err, result) {
            if (err) {
                toastr.error(err.reason)
            } else {
                FlowRouter.go('/authors')
            }
        })
    }
})

Template.authorEdit.helpers({
    authorItem() {
        return Kwote.Components.AuthorItem
    },
    author() {
        const a = Authors.findOne(FlowRouter.getParam('id'))
        return a
    },
    saveHandler() {
        const instance = Template.instance();
        return function (author) {
            instance.updateAuthor(author)
        }
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/authors')
        }
    }
})
