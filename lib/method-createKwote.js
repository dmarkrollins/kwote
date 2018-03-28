import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Quotes, Projects, Categories } from '../lib/kwote'
import { Logger } from '../lib/logger'
import { ManageProjects } from './manageProjects'
import { ManageCategories } from './manageCategories'

Meteor.methods({
    createKwote(kwote) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const quote = Quotes.findOne({
            title: kwote.title,
        })

        if (quote) {
            throw new Meteor.Error('duplicate-found', 'You\'ve already created a Kwote with this title!')
        }

        const projectArray = ManageProjects(kwote.projects)
        const categoryArray = ManageCategories(kwote.categories)
        const authorId = kwote.author ? kwote.author.value : null

        const newQuote = {
            title: kwote.title,
            author: authorId,
            projects: projectArray,
            categories: categoryArray,
            body: kwote.body
        }

        try {
            const id = Quotes.insert(
                newQuote,
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
                Logger.log('Kwote insert failed', this.userId, err)
                throw new Meteor.Error('insert-failed', 'Kwote not created - please try again later!')
            }
        }
    }
})
