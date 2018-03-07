import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Kwote } from '../../lib/kwote'
import { Logger } from '../../lib/logger'

import './kwote-add.html'

Template.kwoteAdd.onCreated(function () {
    const self = this;

    self.handleCancel = () => FlowRouter.go('/kwotes')
})

Template.kwoteAdd.helpers({
    pageTitle() {
        return 'Create Kwote'
    },
    kwoteItem() {
        return Kwote.Components.KwoteItem
    },
    saveHandler() {
        const instance = Template.instance();

        return function (kwote) {
            Logger.log('I got a kwote', JSON.stringify(kwote))
        };
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/kwotes')
        }
    }
})
