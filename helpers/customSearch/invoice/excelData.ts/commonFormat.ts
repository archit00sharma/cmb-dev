
let commonFormatSearch = async (columns) => {

    let search = []
    if (columns[1].search.value.length > 0) {
        search.push({
            'date': {
                '$regex': '.*' + columns[1].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[2].search.value.length > 0) {
        search.push({
            'fileNo': {
                '$regex': '.*' + columns[2].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[3].search.value.length > 0) {
        search.push({
            'barCode': {
                '$regex': '.*' + columns[3].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[4].search.value.length > 0) {
        search.push({
            'applicantName': {
                '$regex': '.*' + columns[4].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[5].search.value.length > 0) {
        search.push({
            'addressType': {
                '$regex': '.*' + columns[5].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[6].search.value.length > 0) {
        search.push({
            'product': {
                '$regex': '.*' + columns[6].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[7].search.value.length > 0) {
        search.push({
            'address': {
                '$regex': '.*' + columns[7].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[8].search.value.length > 0) {
        search.push({
            'branch': {
                '$regex': '.*' + columns[8].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[9].search.value.length > 0) {
        search.push({
            'area': {
                '$regex': '.*' + columns[9].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[10].search.value.length > 0) {
        const searchValue = parseInt(columns[10].search.value)
        if (!isNaN(searchValue)) {
            search.push({
                'mobileNo': {
                    '$eq': searchValue
                }
            });
        }

    }

    if (columns[11].search.value.length > 0) {
        search.push({
            'caseStatus': {
                '$regex': '.*' + columns[11].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[12].search.value.length > 0) {
        const searchValue = parseInt(columns[12].search.value);
        if (!isNaN(searchValue)) {
            search.push({
                'point': {
                    '$eq': searchValue
                }
            });
        }
    }
    if (columns[13].search.value.length > 0) {
        search.push({
            'distance': {
                '$regex': '.*' + columns[13].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[14].search.value.length > 0) {
        const searchValue = parseInt(columns[14].search.value);
        if (!isNaN(searchValue)) {
            search.push({
                'rate': {
                    '$eq': searchValue
                }
            });
        }
    }
    return search
}

export default commonFormatSearch