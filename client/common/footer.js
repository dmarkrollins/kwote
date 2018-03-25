import { Template } from 'meteor/templating'

Template.footer.helpers({
    currentYear() {
        return new Date().getFullYear()
    }
})
