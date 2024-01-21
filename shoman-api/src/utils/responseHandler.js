export default (res, status, data, message) => {
    res.status(status).json({
        status: 'success',
        message,
        data,
    })
}
