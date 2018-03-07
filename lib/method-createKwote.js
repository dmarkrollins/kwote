import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Quotes } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    createKwote(kwote) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        // look for duplicates by title
        const quote = Quotes.findOne({
            title: kwote.title,
        })

        // need to see if there is
        if (quote) {
            throw new Meteor.Error('duplicate-found', 'You\'ve already created a Kwote with this title!')
        }

        const projectArray = _.pluck(kwote.projects, 'value')

        const categoryArray = _.pluck(kwote.categories, 'value')

        const authorId = kwote.author ? kwote.author.value : ''

        try {
            Quotes.insert(
                {
                    $set:
                    {
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
                        isInsert: true,
                        isUpdate: false,
                        isUpsert: false,
                        isFromTrustedCode: true,
                        userId: this.userId
                    }
                }
            )
        } catch (err) {
            Logger.log(err)
            return new Meteor.Error('insert-failed', 'We could not create Kwote - please try again later')
        }
    }
})
