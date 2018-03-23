import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Authors } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    createAuthor(author) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const dupAuthor = Authors.findOne({
            firstName: author.firstName,
            lastName: author.lastName
        })

        if (dupAuthor) {
            throw new Meteor.Error('duplicate-found', 'You\'ve already created an author with this name!')
        }

        try {
            const id = Authors.insert(
                {
                    firstName: author.firstName,
                    lastName: author.lastName,
                    birthDate: author.birthDate,
                    deathDate: author.deathDate,
                    comments: author.comments
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
            Logger.log('Author insert failed', this.userId, err)
            throw new Meteor.Error('insert-failed', 'Author not created - please try again later!')
        }
    }
})
