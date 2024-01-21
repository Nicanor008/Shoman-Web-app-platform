import mongoose, { model } from 'mongoose'
// if user is registered store the user_id here 1-1 relationship

const { Schema } = mongoose

const applicationSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        // userId: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'User',
        // },
        track: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['rejected', 'accepted', 'in-review'],
            default: 'in-review',
        },
        requirements_check: {
            laptop: {
                type: Boolean,
                default: false,
            },
            internet_access: {
                type: Boolean,
                default: false,
            },
            fully_available: {
                type: Boolean,
                default: false,
            },
        },
        goal: {
            type: String,
            required: true,
        },
        previous_experience: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

export default model('Application', applicationSchema)
