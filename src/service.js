const EmdService = {
    getAllCountyNames(knex) {
        return knex.select('countyname').from('county')
    }
}

module.exports = BookmarksService