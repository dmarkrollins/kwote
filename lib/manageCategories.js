import { Categories } from '../lib/kwote'

const ManageCategories = (kwoteCategories) => {
    const categoryArray = []

    kwoteCategories.forEach((item) => {
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

    return categoryArray
}

module.exports = { ManageCategories }
