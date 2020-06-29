const EmdService = {
    getAllCountyNames(knex) {
        return knex.select('countyname').from('county')
    },

    getAllGrids(knex) {
        return knex.raw(`
            select id, st_asText(geom) as geom            
            from grid
        `)
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
            select s.dccode, gs.id
            from sa_subdivide s
            join grid_select gs on st_intersects (s.geom, gs.geom)
            group by s.dccode, gs.id
        ), sa_group as (
            select dccode, array_agg(id order by id) as id_array
            from sa_select
            group by dccode
        )
        select md.*, s.id_array
        from member_data md
        join sa_group s on md.code = s.dccode;
        `)
    },

    getCounties(knex, countyname) {
        return knex.raw(`
        with county_select as (
            select geom
            from county
            where countyname = '${countyname}' --county dropdown result goes here
        ), grid_select as (
            select g.id, g.geom
            from grid g, county_select cs
            where st_intersects(g.geom, cs.geom)
        ), sa_select as (
            select s.dccode, gs.id
            from sa_subdivide s
            join grid_select gs on st_intersects (s.geom, gs.geom)
            group by s.dccode, gs.id
        ), sa_group as (
            select dccode, array_agg(id order by id) as id_array
            from sa_select
            group by dccode
        )
        select md.*, id_array
        from member_data md
        join sa_group s on md.code = s.dccode;
        `)
    },

    getLogin(knex, username, password) {
        return knex.raw(`
            select * 
            from creds
            where username = '${username}'
        `)
    },

    addUser(knex, firstname, lastname, email, username, password) {
        return knex.raw(`
            insert into creds (username, password, firstname, lastname, email)
            values('${username}', '${password}', '${firstname}', '${lastname}', '${email}' )
        `)
    }
}

module.exports = EmdService