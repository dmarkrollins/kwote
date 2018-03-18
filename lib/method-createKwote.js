import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Quotes, Projects, Categories } from './kwote'
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

        const projectArray = []
        const categoryArray = []

        kwote.projects.forEach((item) => {
            if (item.value !== 'placeholder') {
                projectArray.push(item.value)
            } else {
                const p = Projects.findOne({ title: item.label })
                if (p) {
                    projectArray.push(p._id)
                } else {
                    const id = Projects.insert(
                        {
                            title: item.label,
                            notes: ''
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
                    projectArray.push(id)
                }
            }
        })

        kwote.categories.forEach((item) => {
            if (item.value !== 'placeholder') {
                categoryArray.push(item.value)
            } else {
                const c = Categories.findOne({ title: item.label })
                if (c) {
                    categoryArray.push(c._id)
                } else {
                    const id = Categories.insert(
                        {
                            title: item.label
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
                    categoryArray.push(id)
                }
            }
        })

        const authorId = kwote.author ? kwote.author.value : null

        try {
            const id = Quotes.insert(
                {
                    title: kwote.title,
                    author: authorId,
                    projects: projectArray,
                    categories: categoryArray,
                    body: kwote.body
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
            Logger.log('Kwote insert failed', this.userId, err)
            return new Meteor.Error('insert-failed', 'Kwote not created - please try again later')
        }
    }
})
