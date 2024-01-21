import mongoose, { model } from 'mongoose'
const { Schema } = mongoose

const roadmapSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        accessLevel: {
            type: [],
            required: true,
            default: ['shoman'],
        },
        roadmap: [
            {
                title: {
                    type: String,
                    required: true,
                },
                trackId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Track',
                    required: true,
                },
                teamId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Team',
                    required: false,
                },
                icon: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
)

export default model('Roadmap', roadmapSchema)
