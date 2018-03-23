import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Authors } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    deleteAuthor(id) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const Author = Authors.findOne({ _id: id, createdBy: this.userId })

        if (!Author) {
            throw new Meteor.Error('not-found', 'Author not found!')
        }

        try {
            Authors.remove({
                _id: id,
                createdBy: this.userId
            })
            return true
        } catch (err) {
            Logger.log('Author delete failed', this.userId, err)
            throw new Meteor.Error('delete-failed', 'Author not deleted - please try again later!')
        }
    }
})
