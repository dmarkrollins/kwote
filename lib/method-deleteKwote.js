import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Quotes } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    deleteKwote(id) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const Kwote = Quotes.findOne({ _id: id, createdBy: this.userId })

        if (!Kwote) {
            throw new Meteor.Error('not-found', 'Kwote not found!')
        }

        try {
            Quotes.remove({
                _id: id,
                createdBy: this.userId
            })
            return true
        } catch (err) {
            Logger.log('Kwote delete failed', this.userId, err)
            throw new Meteor.Error('delete-failed', 'Kwote not deleted - please try again later')
        }
    }
})
