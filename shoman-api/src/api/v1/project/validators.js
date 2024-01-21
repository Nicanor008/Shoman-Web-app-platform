const Validator = require('validator')
const isEmpty = require('is-empty')

export function validateProjectInputs(data) {
    let errors = {}
    data.trackId = !isEmpty(data.trackId) ? data.trackId : ''
    data.topic = !isEmpty(data.topic) ? data.topic : ''
    data.duration = !isEmpty(data.duration) ? data.duration : ''
    data.projectDescription = !isEmpty(data.projectDescription) ? data.projectDescription : ''

    if (Validator.isEmpty(data.trackId)) {
        errors.trackId = 'trackId is required'
    }
    if (Validator.isEmpty(data.topic)) {
        errors.topic = 'topic is required'
    }
    if (Validator.isEmpty(data.duration)) {
        errors.duration = 'duration is required'
    }
    if (Validator.isEmpty(data.projectDescription)) {
        errors.projectDescription = 'projectDescription is required'
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }
}
