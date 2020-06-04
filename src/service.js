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
                console.log(element)
                arr.push(element.join(' ').toString())
            });
            geomType = 'MULTIPOLYGON'
            coordinates = `(((${arr.toString()})))`;
        } if (type === 'point') {
            console.log(datapoints)
            geomType = 'MULTIPOINT'
            coordinates = `((${datapoints.toString().replace(',', ' ')}))`;
        }
        
        // console.log(arr);
        // console.log(coordinates);
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
    }
}

module.exports = EmdService