import { validateTrackInputs } from './track_validation'
import Tracks from './track_model'

// register/create a new track/stack
export const CreateTrackController = (req, res) => {
    const domain = req.protocol + '://' + req.get('host')
    req.body.domain = domain
    const { errors, isValid } = validateTrackInputs(req.body)
    if (!isValid) {
        return res.status(400).json({ status: 'error', errors })
    }
    Tracks.findOne({ name: req.body.name }).then(user => {
        if (user) {
            return res.status(409).json({ name: 'Track already exists' })
        } else {
            const newTrack = new Tracks(req.body)
            newTrack
                .save()
                .then(track => {
                    return res.status(201).json({
                        message: 'Track successfully created',
                        track,
                    })
                })
                .catch(error => {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Something went wrong. Try again',
                        error,
                    })
                })
        }
    })
}

// Get all tracks
export const GetTrackController = (req, res, next) => {
    Tracks.find(function (err, tracks) {
        if (err) {
            var err = new Error('error occured')
            return next(err)
        }
        if (tracks.length === 0) {
            return res.status(404).json({
                message: 'No tracks available.',
            })
        }
        return res.status(200).json({
            message: 'All Tracks',
            tracks,
        })
    }).catch(error => {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Try again',
            error,
        })
    })
}
