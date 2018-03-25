import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Authors } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    updateAuthor(doc) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const author = Authors.findOne({ _id: doc._id, createdBy: this.userId })

        if (!author) {
            throw new Meteor.Error('not-found', 'Author not found!')
        }

        const dupAuthor = Authors.findOne({
            firstName: doc.firstName,
            lastName: doc.lastName,
            createdBy: this.userId
        })

        if (dupAuthor) {
            if (dupAuthor._id !== doc._id) {
                throw new Meteor.Error('duplicate-found', 'This author already exists in your authors collection!')
            }
        }

        try {
            Authors.update(
                {
                    _id: doc._id,
                    createdBy: this.userId
                },
                {
                    $set: {
                        firstName: doc.firstName,
                        lastName: doc.lastName,
                        birthDate: doc.birthDate,
                        deathDate: doc.deathDate,
                        comments: doc.comments
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
            if (err.sanitizedError) {
                throw new Meteor.Error('update-failed', err.sanitizedError.reason)
            } else {
                Logger.log('Author update failed', this.userId, err)
                throw new Meteor.Error('update-failed', 'Author not updated - please try again later')
            }
        }
    }
})

