import { Template } from 'meteor/templating'

import { Kwotes, Authors } from '../../lib/kwote'

Template.authorList.helpers({
    hasAuthors() {
        return Authors.find().count() > 0
    },
    author() {
        return Authors.find()
    }
})
