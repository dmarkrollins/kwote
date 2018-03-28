import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Categories } from './kwote'

const ManageCategories = (kwoteCategories) => {
    const categoryArray = []

    if (_.isArray(kwoteCategories) && kwoteCategories[0]) {
        kwoteCategories.forEach((item) => {
            if (!_.isObject(item)) {
                categoryArray.push(item)
            } else if (item.value !== 'placeholder') {
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
                                userId: Meteor.userId()
                            }
                        }
                    )
                    categoryArray.push(id)
                }
            }
        })
    }

    return categoryArray
}

module.exports = { ManageCategories }
