import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import toastr from 'toastr'

import { Kwote } from '../../lib/kwote'

Template.authorAdd.onCreated(function () {
    const self = this

    self.createAuthor = (author) => {
        if (author._id === '') {
            Meteor.call('createAuthor', author, function (err, result) {
                if (err) {
                    toastr.error(err.reason)
                }
            })
        } else {
            Meteor.call('updateAuthor', author, function (err, result) {
                if (err) {
                    toastr.error(err.reason)
                }
            })
        }
    }
})

Template.authorAdd.helpers({
    authorItem() {
        return Kwote.Components.AuthorItem
    },
    saveHandler() {
        const instance = Template.instance();
        return function (author) {
            instance.createAuthor(author)
        }
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/authors')
        }
    }
})
