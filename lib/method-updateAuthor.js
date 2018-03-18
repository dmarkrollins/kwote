import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Authors } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    updateAuthor(author) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const dupAuthor = Authors.findOne({
            firstName: author.firstName,
            lastName: author.lastName
        })

        if (dupAuthor._id !== author._id) {
            throw new Meteor.Error('duplicate-found', 'This author already exists!')
        }

        try {
            Authors.update(
                {
                    _id: author._id
                },
                {
                    $set: {
                        firstName: author.firstName,
                        lastName: author.lastName,
                        birthDate: author.birthDate,
                        deathDate: author.deathDate,
                        comments: author.comments
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
        } catch (err) {
            Logger.log('Author update failed', this.userId, err)
            return new Meteor.Error('update-failed', 'Author not updated - please try again later')
        }
    }
})

