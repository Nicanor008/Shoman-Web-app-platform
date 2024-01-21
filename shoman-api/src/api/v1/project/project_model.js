import { Schema, model } from 'mongoose'

const ProjectSchema = new Schema(
    {
        trackId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'tracks',
        },
        topic: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        team: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'team',
        },
        showmanAccess: {
            type: Boolean,
            default: false,
        },
        projectDescription: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            index: true,
            default: false,
        },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'users',
        },
    },
    {
        timestamps: true,
    },
)

export default model('project', ProjectSchema)
