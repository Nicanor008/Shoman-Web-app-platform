import mongoose, { model } from 'mongoose'
const { Schema } = mongoose
const stringRequired = {
    type: String,
    required: true,
}

const contentSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        focusGroup: {
            type: String,
            default: 'shoman',
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Track',
            required: true,
        },
        topic: stringRequired,
        estimatedDuration: stringRequired,
        deadline: {
            type: Date,
            required: true,
        },
        content: stringRequired,
        isDeleted: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

export default model('content', contentSchema)
