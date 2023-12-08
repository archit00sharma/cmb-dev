
let bandhanFormatSearch = async (columns) => {
   
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
            'addressType': {
                '$regex': '.*' + columns[4].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[5].search.value.length > 0) {
        search.push({
            'caseStatus': {
                '$regex': '.*' + columns[5].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[8].search.value.length > 0) {
        search.push({
            'agencyName': {
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
        search.push({
            'product': {
                '$regex': '.*' + columns[10].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[11].search.value.length > 0) {
        search.push({
            'state': {
                '$regex': '.*' + columns[11].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[12].search.value.length > 0) {
        search.push({
            'branchId': {
                '$regex': '.*' + columns[12].search.value + '.*',
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
            'distance': {
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

    if (columns[18].search.value.length > 0) {
        search.push({
            'tat': {
                '$regex': '.*' + columns[18].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    
    
    return search
}

export default bandhanFormatSearch