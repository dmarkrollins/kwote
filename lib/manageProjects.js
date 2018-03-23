import { Projects } from '../lib/kwote'

const ManageProjects = (kwoteProjects) => {
    const projectArray = []

    kwoteProjects.forEach((item) => {
        if (item.value !== 'placeholder') {
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
                            userId: this.userId
                        }
                    }
                )
                projectArray.push(id)
            }
        }
    })

    return projectArray
}

module.exports = { ManageProjects }
