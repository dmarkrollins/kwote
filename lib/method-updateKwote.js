import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Quotes, Projects, Categories } from './kwote'
import { Logger } from './logger'
import { ManageProjects } from './manageProjects'
import { ManageCategories } from './manageCategories'

Meteor.methods({
    updateKwote(kwote) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const quote = Quotes.findOne({ _id: kwote._id, createdBy: this.userId })

        if (!quote) {
            throw new Meteor.Error('not-found', 'Kwote does not exist - cannot be updated!')
        }

        const projectArray = ManageProjects(kwote.projects)
        const categoryArray = ManageCategories(kwote.categories)
        const authorId = kwote.author ? kwote.author.value : null

        try {
            Quotes.update(
                {
                    _id: kwote._id,
                    createdBy: this.userId
                },
                {
                    $set: {
                        title: kwote.title,
                        author: authorId,
                        projects: projectArray,
                        categories: categoryArray,
                        body: kwote.body
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

            return kwote._id
        } catch (err) {
            if (err.sanitizedError) {
                throw new Meteor.Error('update-failed', err.sanitizedError.reason)
            } else {
                Logger.log('Kwote update failed', this.userId, err)
                throw new Meteor.Error('update-failed', 'Kwote not updated - please try again later!')
            }
        }
    }
})
