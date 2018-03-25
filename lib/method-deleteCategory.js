import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Categories } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    deleteCategory(id) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const Category = Categories.findOne({ _id: id, createdBy: this.userId })

        if (!Category) {
            throw new Meteor.Error('not-found', 'Category not found!')
        }

        try {
            Categories.remove({
                _id: id,
                createdBy: this.userId
            })
            return true
        } catch (err) {
            Logger.log('Category delete failed', this.userId, err)
            throw new Meteor.Error('delete-failed', 'Category not deleted - please try again later')
        }
    }
})
