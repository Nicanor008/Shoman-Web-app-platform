//@ts-check
import * as ejs from 'ejs'
import * as fs from 'fs'
import * as path from 'path'
import { createTransport } from 'nodemailer'
import { minify } from 'html-minifier'
const { google } = require('googleapis')

require('dotenv').config()

const rootPath = path.join(__dirname, '..', '..', 'templates/')

const templates = {
    'general-template': 'general-template.ejs',
}

const oauth2Client = new google.auth.OAuth2(process.env.CLIENTID, process.env.CLIENTSECRET)

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESHTOKEN,
})

const accessToken = oauth2Client.getAccessToken()

const opts = {
    pool: true,
    service: 'gmail.com',
    host: 'smtp.gmail.com',
    secure: true,
    port: 587,
    auth: {
        type: 'OAuth2',
        user: 'shomancodes@gmail.com',
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: accessToken,
    },
}

const transport = createTransport(opts)

/**
 * Send email to given email(s)
 *
 * @param {{to: string | string[], subject: string, html: string, attachments?: [{filename: string, content: fs.ReadStream}]}} options
 * @returns
 */
export const sendEmail = options => {
    const { to, subject, html, attachments } = options

    return new Promise((resolve, reject) => {
        transport.sendMail(
            {
                from: 'shomancodes@gmail.com',
                to,
                subject,
                html,
                ...(attachments && { attachments }),
            },
            (error, info) => {
                if (error) {
                    console.log('❌ ERROR SENDING EMAIL', error)
                    return reject(error)
                }
                resolve(info)
            },
        )
    })
}

/**
 * Compile ejs to plain html string. Pass template and data to use
 *
 * @param { {template: 'general-template'} } template
 * @returns
 */
export const compileEjs = template => {
    const text = fs.readFileSync(rootPath + templates[template.template], 'utf-8')

    /**
     * Closure to pass data to ejs
     * @param {*} data
     */
    const fn = data => {
        const html = ejs.compile(text)(data)

        return minify(html, { collapseWhitespace: true })
    }

    return fn
}
