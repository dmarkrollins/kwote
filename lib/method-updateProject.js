import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Projects } from './kwote'
import { Logger } from './logger'

Meteor.methods({
    updateProject(doc) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const Project = Projects.findOne({ _id: doc._id, createdBy: this.userId })

        if (!Project) {
            throw new Meteor.Error('not-found', 'Project not found!')
        }

        const dupProject = Projects.findOne({
            title: doc.title,
            createdBy: this.userId
        })

        if (dupProject._id !== doc._id) {
            throw new Meteor.Error('duplicate-found', 'This Project already exists!')
        }

        try {
            Projects.update(
                {
                    _id: doc._id,
                    createdBy: this.userId
                },
                {
                    $set: {
                        title: doc.title
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
            Logger.log('Project update failed', this.userId, err)
            throw new Meteor.Error('update-failed', 'Project not updated - please try again later')
        }
    }
})
