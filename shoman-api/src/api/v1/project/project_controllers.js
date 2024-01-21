import { validateProjectInputs } from './validators'
import Project from './project_model'
import Team from '../teams/team_model'
import { InternalServerError } from '../../../utils/customError'

const mongodb = require('mongodb')

export const CreateProjectController = (req, res) => {
    const body = Object.assign({}, { author: req.userData.id }, req.body)
    const newProject = new Project(body)
    const { errors, isValid } = validateProjectInputs(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    newProject
        .save()
        .then(project => {
            return res.status(201).json({
                message: 'Project created successfully',
                project,
            })
        })
        .catch(error => {
            return res.status(400).json({
                status: 'error',
                message: 'Something went wrong. Please try again',
                error,
            })
        })
}

/*
 * GET Projects
 * Display projects only to the team users and publicly allowed by shoman access
 */
export async function GetTeamProjectsController(req, res, next) {
    const userId = req.userData.id
    const teams = await Team.find()
    if (teams) {
        teams.map(team => {
            if (team.mentorId.toString() === req.userData.id || (team.menteesId && team.menteesId.includes(userId))) {
                Project.aggregate([
                    {
                        $match: {
                            isDeleted: false,
                            $or: [{ team: team._id }, { showmanAccess: true }],
                        },
                    },
                    {
                        $lookup: {
                            from: 'tracks',
                            localField: 'trackId',
                            foreignField: '_id',
                            as: 'track',
                        },
                    },
                    {
                        $lookup: {
                            from: 'teams',
                            localField: 'team',
                            foreignField: '_id',
                            as: 'team',
                        },
                    },
                    { $unwind: { path: '$track', preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
                    { $sort: { createdAt: -1 } },
                ])
                    .then(projects => {
                        if (projects.length === 0) {
                            return res.status(404).json({
                                status: 'success',
                                message: 'No Project available',
                            })
                        }
                        return res.status(200).json({
                            status: 'success',
                            message: 'All projects',
                            total: projects.length,
                            projects,
                        })
                    })
                    .catch(error => {
                        return next(new InternalServerError(error))
                    })
            } else if (req.userData.role === 'admin') {
                Project.aggregate([
                    {
                        $match: {
                            isDeleted: false,
                        },
                    },
                    {
                        $lookup: {
                            from: 'tracks',
                            localField: 'trackId',
                            foreignField: '_id',
                            as: 'track',
                        },
                    },
                    {
                        $lookup: {
                            from: 'teams',
                            localField: 'team',
                            foreignField: '_id',
                            as: 'team',
                        },
                    },
                    { $unwind: { path: '$track', preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
                    { $sort: { createdAt: -1 } },
                ])
                    .then(projects => {
                        if (projects.length === 0) {
                            return res.status(404).json({
                                status: 'success',
                                message: 'No Project available',
                            })
                        }
                        return res.status(200).json({
                            status: 'success',
                            message: 'All projects',
                            total: projects.length,
                            projects,
                        })
                    })
                    .catch(error => {
                        return next(new InternalServerError(error))
                    })
            }
        })
    }
}

/*
 * GET all Projects - admin
 */
export const GetAllProjectsController = (req, res, next) => {
    Project.aggregate([
        { $match: { isDeleted: false } },
        {
            $lookup: {
                from: 'tracks',
                localField: 'trackId',
                foreignField: '_id',
                as: 'track',
            },
        },
        {
            $lookup: {
                from: 'teams',
                localField: 'team',
                foreignField: '_id',
                as: 'team',
            },
        },
        { $unwind: { path: '$track', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
    ])
        .then(projects => {
            if (projects.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No Project available',
                })
            }
            return res.status(200).json({
                status: 'success',
                message: 'All projects',
                total: projects.length,
                projects,
            })
        })
        .catch(error => {
            return next(new InternalServerError(error))
        })
}

/*
 * GET one Project - all users
 */
export const FilterProjectsController = (req, res, next) => {
    let { status } = req.params
    status = status === 'true' ? true : false
    Project.aggregate([
        { $match: { isDeleted: status } },
        {
            $lookup: {
                from: 'tracks',
                localField: 'trackId',
                foreignField: '_id',
                as: 'track',
            },
        },
        {
            $lookup: {
                from: 'teams',
                localField: 'team',
                foreignField: '_id',
                as: 'team',
            },
        },
        { $unwind: '$track' },
        { $unwind: '$team' },
    ])
        .then(projects => {
            if (projects.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No Project available',
                })
            }
            return res.status(200).json({
                status: 'success',
                message: 'All projects',
                total: projects.length,
                projects,
            })
        })
        .catch(error => {
            return next(new InternalServerError(error))
        })
}

/*
 * GET one Project - all users
 */
export const GetProjectController = (req, res, next) => {
    const { projectId } = req.params
    const query = { _id: new mongodb.ObjectId(projectId), isDeleted: false }
    Project.aggregate([
        { $match: query },
        {
            $lookup: {
                from: 'tracks',
                localField: 'trackId',
                foreignField: '_id',
                as: 'track',
            },
        },
        {
            $lookup: {
                from: 'teams',
                localField: 'team',
                foreignField: '_id',
                as: 'team',
            },
        },
        { $unwind: { path: '$track', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
    ])
        .then(project => {
            if (!project) {
                return res.status(404).json({
                    message: 'Project doest not exists',
                })
            }
            return res.status(200).json({
                status: 'success',
                message: 'Project retrieved successfully',
                project: project[0],
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

export const UpdateProjectController = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'Data to update can not be empty!',
        })
    }
    const { projectId } = req.params
    const query = { _id: new mongodb.ObjectId(projectId), isDeleted: false }

    Project.findOneAndUpdate(query, req.body, { useFindAndModify: false })
        .then(project => {
            if (!project) {
                res.status(404).json({ message: 'Project does not exist' })
            } else {
                res.status(201).json({
                    status: 'success',
                    message: 'Project updated successfully.',
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error when updating project with id=' + projectId,
            })
        })
}

export const DeleteProjectController = (req, res) => {
    const { projectId } = req.params
    const query = { _id: new mongodb.ObjectId(projectId), isDeleted: false }

    Project.findOneAndUpdate(query, { isDeleted: true, showmanAccess: true })
        .then(project => {
            if (!project) {
                return res.status(404).json({ message: 'Project does not exist or is already archived' })
            } else {
                return res.status(201).json({
                    status: 'success',
                    message: 'Project has been archived successfully',
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error when deleting project with id=' + projectId,
            })
        })
}
