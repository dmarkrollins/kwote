import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { toastr } from 'meteor/chrismbeckett:toastr'
import { $ } from 'meteor/jquery'

import { Kwote } from '../../lib/kwote'
import { Logger } from '../../lib/logger'

import './kwote-add.html'

Template.kwoteAdd.onCreated(function () {
    const self = this;

    self.handleCancel = () => FlowRouter.go('/kwotes')

    self.CreateKwote = (kwote) => {
        console.log(JSON.stringify(kwote))
        Meteor.call('createKwote', kwote, function (err, response) {
            if (err) {
                toastr.error(err.message)
            } else {
                toastr.info('Kwote created successfully')
                FlowRouter.go('/kwotes')
            }
        })
    }
})

Template.kwoteAdd.helpers({
    pageTitle() {
        return 'Create Kwote'
    },
    kwoteItem() {
        return Kwote.Components.KwoteItem
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/kwotes')
        }
    },
    saveHandler() {
        const instance = Template.instance();
        return function (kwote) {
            instance.CreateKwote(kwote)
        }
    },
    kwoteBodyErrorHandler() {
        const instance = Template.instance();
        return function (isError) {
            if (isError) {
                $('#kwote').addClass('form-error');
            } else {
                $('#kwote').removeClass('form-error')
            }
        }
    },
    projectItems() {
        return []
    },
    cagtegoryItems() {
        return []
    },
    authorItems() {
        return []
    }

})
