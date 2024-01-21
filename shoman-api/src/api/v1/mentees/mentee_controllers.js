import Application from './application_model'
import { InternalServerError } from '../../../utils/customError'
import responseHandler from '../../../utils/responseHandler'
import { sendEmail, compileEjs } from '../../../utils/email'

export async function applyForMentorship(req, res, next) {
    try {
        const { firstname, lastname, email, track, previous_experience, goal, laptop, fully_available, internet_access } = req.body
        const fullname = `${lastname} ${firstname}`
        const application = await new Application({
            fullname,
            email,
            goal,
            track,
            requirements_check: {
                laptop,
                fully_available,
                internet_access,
            },
            goal,
            previous_experience,
        }).save()
        const message = compileEjs({ template: 'general-template' })({
            header: 'Application in review',
            body: `<br> Welcome to the Shoman Mentorship Program where we help you levelup  your Tech Skills.
            Your application as a mentee is under-going review. <br>
            This may take a while as we are experiencing a larger than normal volume of mentorship requests recently
            and we are working through them as quickly as we can, in order they are received.<br>
            We would get back to you in due time. If you have other questions regarding your application, don't 
            hesitate to send us a mail.
            <br><br>
            Best Regards`,
            name: firstname,
            ctaText: 'Welcome',
            ctaLink: ``,
        })
        sendEmail({
            html: message,
            subject: 'Shoman Mentorship Application Received',
            to: email,
        })

        return responseHandler(res, 201, application, 'Application sent. Check email for more.')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export function GetAllApplicants(req, res, next) {
    Application.find(function (err, applicants) {
        if (err) {
            var err = new Error('error occured')
            return next(err)
        }
        if (applicants.length === 0) {
            return res.status(404).json({
                message: 'No Applicants found.',
            })
        }
        return res.status(200).json({
            message: 'All Applicants',
            applicants,
        })
    }).catch(error => {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Try again',
            error,
        })
    })
}
