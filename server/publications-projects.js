import { Meteor } from 'meteor/meteor'
import { Kwote, Quotes, Projects } from '../lib/kwote'
// import { Constants } from '../lib/constants'

Quotes._ensureIndex('createdBy', 1)
Quotes._ensureIndex('title', 1)

Meteor.publish('myProjects', function (search) {
    if (!Meteor.userId()) {
        return null
    }

    return Projects.find(
        {
            createdBy: Meteor.userId()
        },
        {
            sort: { title: 1 }
        }
    )
})
