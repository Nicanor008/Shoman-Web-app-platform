import Team from './team_model'
const User = require('../users/users_model')
import { InternalServerError, CustomError } from '../../../utils/customError'
import responseHandler from '../../../utils/responseHandler'

export async function createTeam(req, res, next) {
    try {
        const { team_name, mentorId, trackId, menteesId } = req.body
        let teamNumber
        const lastEntry = await Team.findOne().sort({ $natural: -1 }).limit(1)
        if (lastEntry) {
            // team names starting with SH- for shoman
            teamNumber = `SHOMAN-${parseInt(lastEntry.team_number.slice(7)) + 1}` // generate team number from last entry
        } else {
            teamNumber = 'SHOMAN-101' // starting with 101 but could be changed
        }
        const newTeam = await new Team({
            team_name,
            mentorId,
            menteesId: menteesId && menteesId,
            main_trackId: trackId,
            team_number: teamNumber,
        }).save()
        if (!newTeam) {
            return next(new CustomError(400, "Team creation wasn't successful"))
        }
        const updateMentorTeamNo = await User.findByIdAndUpdate(
            mentorId,
            {
                $set: { teamNumber },
            },
            { new: true },
        )
        if (!updateMentorTeamNo) {
            return next(new CustomError(404, "Error encountered while updating mentor's team number"))
        }
        // update the mentees team number also if included during creation
        if (menteesId) {
            const updateMenteesTeamNo = await User.updateMany({ _id: { $in: menteesId } }, { $set: { teamNumber } }, { new: true })
            if (!updateMenteesTeamNo) {
                return next(new CustomError(404, "Error encountered while updating users' team numbers"))
            }
        }
        return responseHandler(res, 201, newTeam, 'Team has been created successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function getAllTeams(req, res, next) {
    try {
        const queryOptions = {}
        let { page, limit, search } = req.query
        let teams, totalCount
        page = parseInt(page, 10) || 1
        limit = parseInt(limit, 10) || 10
        // to be used later
        if (search) queryOptions['team_name'] = { $regex: search, $options: 'i', isDeleted: true }
        teams = await Team.aggregate([
            { $match: { isDeleted: false } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'mentorId',
                    foreignField: '_id',
                    as: 'mentor',
                },
            },
            {
                $lookup: {
                    from: 'tracks',
                    localField: 'main_trackId',
                    foreignField: '_id',
                    as: 'track',
                },
            },
            { $unwind: { path: '$mentor', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$track', preserveNullAndEmptyArrays: true } },
            { $sort: { createdAt: -1 } },
        ])
        // totalCount = teams && teams.length
        if (!teams && teams.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No team(s) available',
            })
        }
        return res.status(200).json({
            status: 'success',
            totalCount: teams.length,
            teams,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        })
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function getATeam(req, res, next) {
    try {
        const { teamId } = req.params
        const team = await Team.findById(teamId)
        if (!team) {
            return next(new CustomError(404, "Team doesn't exist or has been archived"))
        }
        return responseHandler(res, 200, team, 'Team found')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

/*
 * GET: the logged in user team details
 */
export async function CurrentUserTeam(req, res, next) {
    try {
        const allUsers = await Team.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'mentorId',
                    foreignField: '_id',
                    as: 'mentor',
                },
            },
            {
                $lookup: {
                    from: 'tracks',
                    localField: 'main_trackId',
                    foreignField: '_id',
                    as: 'track',
                },
            },
            { $unwind: '$mentor' },
            { $unwind: '$track' },
        ])
        const team = allUsers.filter(team => team.mentor._id.toString() === req.userData.id || team.menteesId.filter(user => user.toString() === req.userData.id))
        if (!team || team.length === 0) {
            return next(new CustomError(404, 'You not assigned to a team. Contact Admin'))
        }
        if (team[0].menteesId.length > 0) {
            const mentees = []
            for (let i = 0; i < team[0].menteesId.length; i++) {
                mentees.push(await User.findById(team[0].menteesId[i]))
            }
            return res.status(200).json({ status: 'success', message: 'Current User Details', data: team[0], mentees })
        } else {
            return responseHandler(res, 200, team[0], 'Current User Details')
        }
        // team[0].menteesId(mentees => console.log("<>>>>>>>>>....>>>>>>>..>>>..>.>..>......>......", mentees))
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function deleteTeam(req, res, next) {
    const { teamId } = req.params
    try {
        const team = await Team.findByIdAndUpdate(teamId, { isDeleted: true })
        if (!team) {
            return next(new CustomError(404, "Team with the ID doesn't exist or has already been deleted"))
        }
        return responseHandler(res, 200, team, 'Team deleted successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function addUsersToTeam(req, res, next) {
    try {
        const { menteesId, mentorId } = req.body
        const { teamId } = req.params
        const updateFields = {
            $addToSet: {
                menteesId: {
                    $each: menteesId,
                },
            },
        }
        if (mentorId) {
            updateFields['$set'] = { mentorId }
        }
        const updatedTeam = await Team.findByIdAndUpdate(teamId, updateFields)
        if (!updatedTeam) {
            return next(new CustomError(404, "Team with the ID doesn't exist or has been deleted"))
        }
        const updateMenteesTeamNo = await User.updateMany({ _id: { $in: menteesId } }, { $set: { teamNumber: updatedTeam.team_number } }, { new: true })
        if (!updateMenteesTeamNo) {
            return next(new CustomError(404, "Error encountered while updating mentees' team numbers"))
        }
        // update the mentor's team number also if included during creation
        if (mentorId) {
            const updateMentorTeamNo = await User.findByIdAndUpdate(
                mentorId,
                {
                    $set: { teamNumber: updatedTeam.team_number },
                },
                { new: true },
            )
            if (!updateMentorTeamNo) {
                return next(new CustomError(404, "Error encountered while updating mentor's team number"))
            }
        }
        return responseHandler(res, 200, updatedTeam, 'User(s) added to team successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}
