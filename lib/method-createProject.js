import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Projects } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    createProject(doc) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const project = Projects.findOne({ title: doc.title })

        if (project) {
            throw new Meteor.Error('duplicate-found', 'You\'ve already created a Project with this name!')
        }

        try {
            const id = Projects.insert(
                {
                    title: doc.title
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
            Logger.log('Project insert failed', this.userId, err)
            throw new Meteor.Error('insert-failed', 'Project not created - please try again later!')
        }
    }
})
