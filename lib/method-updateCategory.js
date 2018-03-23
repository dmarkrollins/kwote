import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Categories } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    updateCategory(doc) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const category = Categories.findOne({ _id: doc._id, createdBy: this.userId })

        if (!category) {
            throw new Meteor.Error('not-found', 'Category not found!')
        }

        const dupCategory = Categories.findOne({
            title: doc.title,
            createdBy: this.userId
        })

        if (dupCategory._id !== doc._id) {
            throw new Meteor.Error('duplicate-found', 'This Category already exists!')
        }

        try {
            Categories.update(
                {
                    _id: doc._id,
                    createdBy: this.userId
                },
                {
                    $set: {
                        title: doc.title
                    }
                },
                {
                    extendAutoValueContext:
                    {
                        isInsert: false,
                        isUpdate: true,
                        isUpsert: false,
                        isFromTrustedCode: true,
                        userId: this.userId
                    }
                }
            )
            return doc._id
        } catch (err) {
            Logger.log('Category update failed', this.userId, err)
            throw new Meteor.Error('update-failed', 'Category not updated - please try again later')
        }
    }
})

