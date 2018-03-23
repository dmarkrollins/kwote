import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Projects } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    deleteProject(id) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const Project = Projects.findOne({ _id: id, createdBy: this.userId })

        if (!Project) {
            throw new Meteor.Error('not-found', 'Project not found!')
        }

        try {
            Projects.remove(
                {
                    _id: id,
                    createdBy: this.userId
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
            return true
        } catch (err) {
            Logger.log('Project delete failed', this.userId, err)
            throw new Meteor.Error('delete-failed', 'Project not deleted - please try again later')
        }
    }
})
