import { Template } from 'meteor/templating'
import { _ } from 'meteor/underscore'

import { Quotes, Projects, Categories } from '../../lib/kwote'

Template.kwoteTags.helpers({

    tag() {
        const plist = Projects.find({ _id: { $in: this.projects } }).fetch()
        plist.forEach((element) => { element.tagClass = 'projectTag' })
        const clist = Categories.find({ _id: { $in: this.categories } }).fetch()
        clist.forEach((element) => { element.tagClass = 'categoryTag' })
        return _.union(plist, clist)
    },
    tagClass() {
        return this.tagClass
    },
    tagLabel() {
        return this.title
    }

})
