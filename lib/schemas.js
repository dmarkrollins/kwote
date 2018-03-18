import SimpleSchema from 'simpl-schema'

const Schemas = {}

Schemas.Quotes = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function () {
            if (this.isInsert) {
                return this.userId;
            }
            this.unset()
        },
        denyUpdate: true,
        optional: true
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
            this.unset()
        },
        denyUpdate: true,
        optional: true
    },
    modifiedAt: {
        type: Date,
        autoValue: function () {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    },
    title: {
        type: String,
        max: 255
    },
    body: {
        type: String,
        max: 8192
    },
    author: {
        type: String,
        optional: true
    },
    categories: [String],
    projects: [String]
})

Schemas.Categories = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function () {
            if (this.isInsert) {
                return this.userId;
            }
            this.unset()
        },
        denyUpdate: true,
        optional: true
    },
    title: {
        type: String,
        max: 255
    }
})

Schemas.Projects = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function () {
            if (this.isInsert) {
                return this.userId;
            }
            this.unset()
        },
        denyUpdate: true,
        optional: true
    },
    title: {
        type: String,
        max: 255
    },
    notes: {
        type: String,
        max: 2048,
        optional: true
    }
})

Schemas.Authors = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function () {
            if (this.isInsert) {
                return this.userId;
            }
            this.unset()
        },
        denyUpdate: true,
        optional: true
    },
    firstName: {
        type: String,
        max: 100
    },
    lastName: {
        type: String,
        max: 100
    },
    birthDate: {
        type: Date,
        optional: true
    },
    deathDate: {
        type: Date,
        optional: true
    },
    comments: {
        type: String,
        optional: true,
        max: 2048
    }
})

module.exports = { Schemas }
