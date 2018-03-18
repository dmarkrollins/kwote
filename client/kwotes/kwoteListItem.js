import { Template } from 'meteor/templating'
import { Spacebars } from 'meteor/spacebars'
import moment from 'moment'
import toastr from 'toastr'

import { Projects } from '../../lib/kwote'
import { ConfirmDialog } from '../common/confirmDialog'

Template.kwoteListItem.helpers({
    lastProject() {
        if (this.projects.length > 0) {
            const pid = this.projects[this.projects.length - 1]
            if (pid) {
                const p = Projects.findOne(pid)
                if (p) {
                    return p.title
                }
            }
        }
    },
    lastModified() {
        const dte = this.modifiedAt || this.createdAt
        return moment(dte).format('MM/DD/YYYY')
    },
    quoteBody() {
        return Spacebars.SafeString(this.body)
    }
})

Template.kwoteListItem.events({
    'click #btnCopy': function (event, instance) {
        toastr.success("Quote body text copied to clip board!")
    },
    'click #btnDelete': function (event, instance) {
        ConfirmDialog.showConfirmation(`Are you sure you want to delete quote '{$this.title}'`, 'Delete Quote?', function (){
            // do delete
        }, "danger")
    }
})
