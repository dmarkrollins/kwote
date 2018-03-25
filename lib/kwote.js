import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Session } from 'meteor/session'
import { Schemas } from './schemas'

const Kwote = {
    defaultConfirmMsg: 'Are you sure?',
    defaultLimit: 10,
    Components: {},
    KwoteSearchKey: 'KwoteSearch',
    AuthorSearchKey: 'AuthorSearch',
    CategorySearchKey: 'CategorySearch',
    ProjectSearchKey: 'ProjectSearch',
    setKwoteSearchValue: function (val) {
        if (Meteor.isClient) {
            let search = Session.get(this.KwoteSearchKey)
            if (!search || !search.title) {
                search = { limit: this.defaultLimit, title: '' }
            }
            search.title = val
            Session.set(this.KwoteSearchKey, search)
        }
        return {}
    }
}

if (!String.prototype.toProperCase) {
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
}

const Quotes = new Mongo.Collection('quotes')
const Categories = new Mongo.Collection('categories')
const Authors = new Mongo.Collection('authors')
const Projects = new Mongo.Collection('projects')

Quotes.attachSchema(Schemas.Quotes)
Categories.attachSchema(Schemas.Categories)
Authors.attachSchema(Schemas.Authors)
Projects.attachSchema(Schemas.Projects)

const registerComponent = (name, component) => {
    Kwote.Components[name] = component
}

module.exports = {
    Kwote, Quotes, Categories, Authors, Projects, registerComponent
}
