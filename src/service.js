const EmdService = {
    getAllCountyNames(knex) {
        return knex.select('countyname').from('county')
    },

    getIntersects(knex, type, datapoints) {
        let geomType
        let arr = []
        let coordinates
        if (type === 'draw') {
            datapoints.forEach(element => {
                // console.log(element)
                arr.push(element.join(' ').toString())
            });
            geomType = 'MULTIPOLYGON'
            coordinates = `(((${arr.toString()})))`;
        } if (type === 'point') {
            // console.log(datapoints)
            geomType = 'MULTIPOINT'
            coordinates = `((${datapoints.toString().replace(',', ' ')}))`;
        }
        
        return knex.raw(`
        with grid_select as (
            select g.id, g.geom
            from grid g
            where st_intersects('SRID=4326;${geomType} ${coordinates}', g.geom)
        ), sa_select as (
            select s.dccode
            from sa_subdivide s
            join grid_select gs on st_intersects (s.geom, gs.geom)
            group by s.dccode
        )
        select md.*
        from member_data md
        join sa_select s on md.code = s.dccode;
        `)
    },

    getCounties(knex, countyname) {
        return knex.raw(`
        with county_select as (
            select geom
            from county
            where countyname = '${countyname}'
        ), grid_select as (
            select g.id, g.geom
            from grid g, county_select cs
            where st_intersects(g.geom, cs.geom)
        ), sa_select as (
            select s.dccode
            from sa_subdivide s
            join grid_select gs on st_intersects (s.geom, gs.geom)
            group by s.dccode
        )
        select md.*
        from member_data md
        join sa_select s on md.code = s.dccode
        where md.contacttype = 'Member Contact';
        `)
    },

    getLogin(knex, username, password) {
        return knex.raw(`
            select * 
            from creds
            where username = '${username}'
        `)
    },

    addUser(knex, username, password) {
        return knex.raw(`
            insert into creds (username, password)
            values('${username}', '${password}')
        `)
    }
}

module.exports = EmdService