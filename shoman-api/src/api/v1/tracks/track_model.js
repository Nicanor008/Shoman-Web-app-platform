import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

// e.g.
// name - Frontend Development
// languages - ["HTML", "CSS", "JavaScript"]
// application_areas - ["Web Development", "Web Design"]
// careers - ["Frontend Developer", "Web Designer", "Games Designer"]

const TrackSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    languages: [
        {
            type: String,
        },
    ],
    application_areas: [
        {
            type: String,
        },
    ],
})

export default model('tracks', TrackSchema)
