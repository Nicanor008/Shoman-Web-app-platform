// validate the date to accept format "yyyy-mm-dd"
const validateDate = dateString => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/
    if (!dateString.match(regEx)) return false // Invalid format
    const d = new Date(dateString)
    var dNum = d.getTime()
    if (!dNum && dNum !== 0) return false // NaN value, Invalid date
    const today = new Date()
    if (today >= d) return false // check if the due date isnt before the current date
    return d.toISOString().slice(0, 10) === dateString
}

/* Example Use */
// console.log(isValidDate("2021-11-25")); // true

export default validateDate
