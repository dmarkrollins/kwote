import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Projects } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    createProject(newProject) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        if (!newProject) {
            throw new Meteor.Error('invalid-parameter', 'You must provide a valid document!')
        }

        const project = Projects.findOne({ title: newProject })

        if (project) {
            throw new Meteor.Error('duplicate-found', 'You\'ve already created a Project with this name!')
        }

        try {
            const id = Projects.insert(
                {
                    title: newProject
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
                Logger.log('Project insert failed', this.userId, err)
                throw new Meteor.Error('insert-failed', 'Project not created - please try again later!')
            }
        }
    }
})
