import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Accounts } from 'meteor/accounts-base'
import { ReactiveVar } from 'meteor/reactive-var'

Template.newAccount.onCreated(function () {
    const self = this
    self.errorMessage = new ReactiveVar('')

    self.setMessage = (message) => {
        self.errorMessage.set(message)
    }
})

Template.newAccount.helpers({
    errMessage() {
        return Template.instance().errorMessage.get()
    }
})

Template.newAccount.events({
    'click #btnCancel': function (event, instance) {
        FlowRouter.go('/')
    },
    'submit #newaccount-form': function (event, instance) {
        event.preventDefault()

        instance.setMessage('')
        const doc = {}
        doc.userName = event.target.userName.value || ''
        doc.email = event.target.emailAddress.value || ''
        doc.password = event.target.password.value || ''
        doc.agreeToTerms = event.target.agreeToTerms.checked
        doc.confirmPassword = event.target.confirmPassword.value || ''

        if (doc.userName === '') {
            instance.setMessage('A user name is required')
            return
        }

        if (doc.email === '') {
            instance.setMessage('An email address is required')
            return
        }

        if (doc.password === '' || doc.password !== doc.confirmPassword) {
            instance.setMessage('Passwords do not match!')
            return
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(doc.password)) {
            instance.setMessage('Invalid password - must be >= 8 chars and contain a mix up upper and lower case letters plus at least 1 number :)')
            return
        }

        if (!doc.agreeToTerms) {
            instance.setMessage('You must agree to the Kwote terms of use.')
            return
        }

        const options = {
            username: doc.userName,
            email: doc.email,
            password: doc.password,
            preferences: { agreeToTerms: doc.agreeToTerms }
        }

        Accounts.createUser(options, function (err) {
            if (err) {
                instance.setMessage(err)
                return
            }
            FlowRouter.go('/kwotes')
        })
    }
})
