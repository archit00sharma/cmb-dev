

let bankAllocationSearch = async (columns) => {
    let search = []
    if (columns[1].search.value.length > 0) {
        search.push({
            'product': {
                '$regex': '.*' + columns[1].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[2].search.value.length > 0) {
        search.push({
            'bank': {
                '$regex': '.*' + columns[2].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    return search
}

export default bankAllocationSearch