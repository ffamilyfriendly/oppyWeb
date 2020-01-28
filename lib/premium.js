const premiumList = []
const dbl = require("../index").dbl

module.exports = async (id) => {
    if(premiumList.includes(id)) return true
    return await dbl.hasVoted(id)
}