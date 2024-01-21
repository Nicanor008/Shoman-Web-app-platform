import mongoose, { model } from 'mongoose'
const { Schema } = mongoose

const teamSchema = new Schema(
    {
        team_number: {
            type: String,
            required: true,
            unique: true,
        },
        team_name: {
            type: String,
            required: true,
        },
        mentorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        menteesId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        main_trackId: {
            type: Schema.Types.ObjectId,
            ref: 'Track',
            required: true,
        },
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

export default model('Team', teamSchema)
