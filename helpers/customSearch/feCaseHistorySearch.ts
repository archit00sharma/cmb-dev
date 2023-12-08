
let feCaseHistorySearch = async (columns) => {
    let search = []

    if (columns[5].search.value.length > 0) {
        search.push({
            'submittedDate_string': {
                '$regex': '.*' + columns[5].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[7].search.value.length > 0) {
        search.push({
            'submittedCases.fileNo': {
                '$regex': '.*' + columns[7].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    return search
}

export default feCaseHistorySearch