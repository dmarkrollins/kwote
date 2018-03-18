import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Kwote, Authors } from '../../lib/kwote'

Template.authors.onCreated(function () {
    const self = this
})

Template.authors.helpers({

})

Template.authors.events({
    'click #btnNewAuthor': function (event, instance) {
        FlowRouter.go('/authors/add')
    }
})
