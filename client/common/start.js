import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery'

Template.start.onCreated(function () {
    this.message = new ReactiveVar('')

    this.setMessage = (msg) => {
        this.message.set(msg)
    }
})

Template.start.helpers({
    errMessage() {
        return Template.instance().message.get()
    }
})

Template.start.events({

    'submit #start-form': function (event, instance) {
        event.preventDefault()

        instance.message.set('')
        const name = event.target.userName.value || '';
        const password = event.target.password.value || '';

        if (name === '' || password === '') {
            instance.message.set('Invalid user name and password combination!')
            return
        }

        $('#start-fs').prop('disabled', true);

        Meteor.loginWithPassword(name, password, function (err) {
            $('#start-fs').prop('disabled', false);
            if (err) {
                instance.setMessage('Invalid user name and password combination!')
                return
            }
            FlowRouter.go('/kwotes')
        })
    }

})
