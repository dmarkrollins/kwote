import { Meteor } from 'meteor/meteor'

Meteor.methods({
    termsOfService() {
        const textValue = Assets.getText('termsOfService.md') // eslint-disable-line
        const html = parseMarkdown(textValue) // eslint-disable-line
        return html
    }
})
