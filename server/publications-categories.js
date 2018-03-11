import { Meteor } from 'meteor/meteor'
import { Kwote, Categories } from '../lib/kwote'
// import { Constants } from '../lib/constants'

Categories._ensureIndex('createdBy', 1)
Categories._ensureIndex('title', 1)

Meteor.publish('myCategories', function (search) {
    if (!Meteor.userId()) {
        return null
    }

    return Categories.find(
        {
            createdBy: Meteor.userId()
        },
        {
            sort: { title: 1 }
        }
    )
})
