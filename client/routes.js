import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import { Kwote } from '../lib/kwote'

FlowRouter.route('/', {
    action: function () {
        if (Meteor.userId()) {
            FlowRouter.go('/kwotes')
        } else {
            BlazeLayout.render('layout', { content: 'start' });
        }
    },
    name: 'start'
});

FlowRouter.route('/newaccount', {
    action: function () {
        BlazeLayout.render('layout', { content: 'newAccount' });
    },
    name: 'new-account'
})

FlowRouter.route('/kwotes', {
    // subscriptions: function (params) {
    //     this.register('quotes', Meteor.subscribe('myQuotes'))
    //     this.register('projects', Meteor.subscribe('myProjects'))
    // },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        }
        BlazeLayout.render('layout', { content: 'kwotes' });
    },
    name: 'home'
})

FlowRouter.route('/categories', {
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        }
        BlazeLayout.render('layout', { content: 'categories' });
    },
    name: 'categories'
})

FlowRouter.route('/projects', {
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        }
        BlazeLayout.render('layout', { content: 'projects' });
    },
    name: 'projects'
})

FlowRouter.route('/authors', {
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        }
        BlazeLayout.render('layout', { content: 'authors' });
    },
    name: 'authors'
})
