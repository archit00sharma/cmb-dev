
let hdfcFormatSearch = async (columns) => {

    let search = []
    if (columns[1].search.value.length > 0) {
        search.push({
            'fileNo': {
                '$regex': '.*' + columns[1].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[2].search.value.length > 0) {
        search.push({
            'applicantName': {
                '$regex': '.*' + columns[2].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[3].search.value.length > 0) {
        search.push({
            'address': {
                '$regex': '.*' + columns[3].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[4].search.value.length > 0) {
        search.push({
            'fiToBeConducted': {
                '$regex': '.*' + columns[4].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[5].search.value.length > 0) {
        search.push({
            'product': {
                '$regex': '.*' + columns[5].search.value + '.*',
                '$options': 'i'
            }
        },)
    }



    if (columns[9].search.value.length > 0) {
        search.push({
            'date': {
                '$regex': '.*' + columns[9].search.value + '.*',
                '$options': 'i'
            }
        },)
    }



    if (columns[10].search.value.length > 0) {
        search.push({
            'area': {
                '$regex': '.*' + columns[10].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[11].search.value.length > 0) {
        const orConditions = [];

        orConditions.push({
            'pv.distance': {
                '$regex': '.*' + columns[11].search.value + '.*',
                '$options': 'i'
            }
        });

        orConditions.push({
            'rv.distance': {
                '$regex': '.*' + columns[11].search.value + '.*',
                '$options': 'i'
            }
        })

        const query = {
            $or: orConditions
        };
        search.push(query);
    }



    if (columns[12].search.value.length > 0) {
        search.push({
            'branch': {
                '$regex': '.*' + columns[11].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[13].search.value.length > 0) {
        search.push({
            'caseStatus': {
                '$regex': '.*' + columns[13].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[14].search.value.length > 0) {
        const searchValue = parseInt(columns[14].search.value)
        if (!isNaN(searchValue)) {
            search.push({
                'point': {
                    '$eq': searchValue
                }
            });
        }

    }

    if (columns[15].search.value.length > 0) {
        search.push({
            'bv.distance': {
                '$regex': '.*' + columns[15].search.value + '.*',
                '$options': 'i'
            }
        },)
    }


    if (columns[16].search.value.length > 0) {
        const searchValue = parseInt(columns[16].search.value);
        if (!isNaN(searchValue)) {
            search.push({
                'rate': {
                    '$eq': searchValue
                }
            });
        }
    }



    if (columns[20].search.value.length > 0) {
        search.push({
            'cpvBy': {
                '$regex': '.*' + columns[12].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    return search
}

export default hdfcFormatSearch