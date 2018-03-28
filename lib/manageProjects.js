import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Projects } from './kwote'

const ManageProjects = (kwoteProjects) => {
    const projectArray = []

    if (_.isArray(kwoteProjects) && kwoteProjects[0]) {
        kwoteProjects.forEach((item) => {
            if (!_.isObject(item)) {
                projectArray.push(item)
            } else if (item.value !== 'placeholder') {
                projectArray.push(item.value)
            } else {
                const c = Projects.findOne({ title: item.label })
                if (c) {
                    projectArray.push(c._id)
                } else {
                    const id = Projects.insert(
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
                    projectArray.push(id)
                }
            }
        })
    }

    return projectArray
}

module.exports = { ManageProjects }
