import Roadmap from './roadmap_model'
import { InternalServerError } from '../../../utils/customError'
import responseHandler from '../../../utils/responseHandler'
const mongo = require('mongodb')

/**
 * API POST Roadmap
 * Technique - Create Once, update several times
 */
export async function CreateRoadmap(req, res, next) {
    try {
        const userId = req.userData.id
        const { accessLevel, roadmap } = req.body
        const payload = {
            userId,
            accessLevel,
            roadmap,
        }
        await Roadmap.findOneAndUpdate({ userId: new mongo.ObjectId(userId) }, payload).then(async roadmap => {
            // roadmap doesn't exists, create new
            if (!roadmap || roadmap === null) {
                return new Roadmap(payload)
                    .save()
                    .then(savedRoadmap => {
                        return responseHandler(res, 201, savedRoadmap, 'Team has been created successfully')
                    })
                    .catch(err => {
                        next(new InternalServerError(err))
                    })
            }
            // if exists, roadmap has been updated, return new updated data
            roadmap &&
                (await Roadmap.findById(roadmap._id)
                    .then(updatedRoadmap => {
                        return responseHandler(res, 200, updatedRoadmap, 'Roadmap has been updated successfully')
                    })
                    .catch(err => {
                        next(new InternalServerError(err))
                    }))
        })
    } catch (error) {
        next(new InternalServerError(error))
    }
}

/**
 * API GET all Roadmaps - For admin use only
 */
export async function getAllRoadmap(req, res, next) {
    try {
        await Roadmap.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'createdBy',
                },
            },
            // {
            //     $lookup: {
            //         from: 'tracks',
            //         localField: 'roadmap.trackId',
            //         foreignField: '_id',
            //         as: 'track',
            //     },
            // },
            { $unwind: '$createdBy' },
            // { $unwind: '$track' },
            // TODO: Show all _id details
            // {
            //     $project: { _id: '$id', accessLevel: '$accessLevel', roadmm:
            //         "$roadmap"
            //     },
            // },
        ]).then(roadmap => {
            if (!roadmap) {
                return res.status(404).json({
                    message: 'No Roadmap(s) has been created.',
                })
            }
            return res.status(200).json({
                status: 'success',
                message: 'All Roadmaps',
                total: roadmap.length,
                data: roadmap,
            })
        })
    } catch (error) {
        next(new InternalServerError(error))
    }
}

/**
 * API GET Roadmap suitable for the logged in user
 * Default - Show Shoman Roadmap
 * if the user belongs to a team where a mentor has created a roadmap, then display that roadmap
 * Technique - Create Once, update several times
 */
export async function DisplayRoadmap(req, res, next) {
    try {
        // await Roadmap.find({ userId: new mongo.ObjectId(userId)  })
    } catch (error) {
        next(new InternalServerError(error))
    }
}

/**
 * API Update a Roadmap - user who created the roadmap
 */
export async function UpdateRoadmap(req, res, next) {
    try {
        // await Roadmap.find({ userId: new mongo.ObjectId(userId)  })
    } catch (error) {
        next(new InternalServerError(error))
    }
}

/**
 * API update a Roadmaps - For admin use only
 * An admin can decide to update the roadmap to suite the team use
 * userId and accessLevel should not be update here, only roadmap
 */
export async function AdminUpdateRoadmap(req, res, next) {
    try {
        // await Roadmap.find({ userId: new mongo.ObjectId(userId)  })
    } catch (error) {
        next(new InternalServerError(error))
    }
}

/**
 * API soft DELETE a Roadmap - For user who created use only(ADMIN/MENTOR)
 * assign to shoman, but don't display publicly
 */
export async function DeleteRoadmap(req, res, next) {
    try {
        // await Roadmap.find({ userId: new mongo.ObjectId(userId)  })
    } catch (error) {
        next(new InternalServerError(error))
    }
}

/**
 * API UPDATE A soft deleted a Roadmap - ADMIN
 * remove from the deleted items
 * Can decide to give access to shoman or any other team
 */
export async function UpdateDeletedRoadmap(req, res, next) {
    try {
        // await Roadmap.find({ userId: new mongo.ObjectId(userId)  })
    } catch (error) {
        next(new InternalServerError(error))
    }
}
