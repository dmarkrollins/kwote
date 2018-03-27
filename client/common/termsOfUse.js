import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { $ } from 'meteor/jquery'

Template.termsOfUse.onCreated(function () {
    this.working = new ReactiveVar(false)
})

Template.termsOfUse.events({
    'click #btnBack': function (event, instance) {
        event.preventDefault()
        history.go(-1) // eslint-disable-line
    }
})

Template.termsOfUse.onRendered(function () {
    const instance = Template.instance()

    instance.working.set(true)

    Meteor.call('termsOfService', null, function (err, result) {
        instance.working.set(false)

        if (err) {
            $('#markDown').html('No policy found.')
        } else {
            $('#markDown').html(result)
        }
    })
})
