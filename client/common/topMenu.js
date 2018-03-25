import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

Template.topMenu.onCreated(function () {

})

Template.topMenu.helpers({
    quoteImg() {
        return Meteor.userId() ? '/quote-w.png' : '/quote-b.png'
    },
    categoryImg() {
        return Meteor.userId() ? '/category-b.png' : '/category-b.png'
    },
    projectImg() {
        return Meteor.userId() ? '/project-b.png' : '/project-b.png'
    },
    authorImg() {
        return Meteor.userId() ? '/author-w.png' : '/author-b.png'
    },
    cogImg() {
        return Meteor.userId() ? '/cog-w.png' : '/cog-b.png'
    },
    isAuthenticated() {
        return Meteor.userId() !== null
    }
})

Template.topMenu.events({
    'click #signOut': function (event, instance) {
        Meteor.logout((err) => {
            if (!err) {
                FlowRouter.go('/')
            }
        })
    },
    'click #btnKwotes': function (event, instance) {
        FlowRouter.go('/kwotes')
    },
    'click #btnCategories': function (event, instance) {
        FlowRouter.go('/categories')
    },
    'click #btnProjects': function (event, instance) {
        FlowRouter.go('/projects')
    },
    'click #btnAuthors': function (event, instance) {
        FlowRouter.go('/authors')
    }
})
