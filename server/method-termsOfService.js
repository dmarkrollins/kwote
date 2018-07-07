/* global parseMarkdown Assets */
import { Meteor } from 'meteor/meteor'

Meteor.methods({
    termsOfService() {
        const textValue = Assets.getText('termsOfService.md')
        const html = parseMarkdown(textValue)
        return html
    }
})
