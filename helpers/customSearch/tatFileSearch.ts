
let tatFilesSearch = async (columns) => {
    let search = []
    if (columns[2].search.value.length > 0) {
        search.push({
            'status': {
                '$regex': '.*' + columns[2].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[4].search.value.length > 0) {
        search.push({
            'created_at_string': {
                '$regex': '.*' + columns[4].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    return search
}

export default tatFilesSearch