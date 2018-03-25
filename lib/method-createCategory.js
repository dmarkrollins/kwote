import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Categories } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    createCategory(newCategory) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        if (!newCategory) {
            throw new Meteor.Error('invalid-parameter', 'You must provide a valid document!')
        }

        const category = Categories.findOne({ title: newCategory, createdBy: this.userId })

        if (category) {
            throw new Meteor.Error('duplicate-found', 'You\'ve already created a category with this name!')
        }

        try {
            const id = Categories.insert(
                {
                    title: newCategory
                },
                {
                    extendAutoValueContext:
                    {
                        isInsert: true,
                        isUpdate: false,
                        isUpsert: false,
                        isFromTrustedCode: true,
                        userId: this.userId
                    }
                }
            )
            return id
        } catch (err) {
            if (err.sanitizedError) {
                throw new Meteor.Error('insert-failed', err.sanitizedError.reason)
            } else {
                Logger.log('Category insert failed', this.userId, err)
                throw new Meteor.Error('insert-failed', 'Category not created - please try again later!')
            }
        }
    }
})
