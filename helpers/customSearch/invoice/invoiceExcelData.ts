
let invoiceExcelDataStatusSearch = async (columns) => {
   
    let search = []
    if (columns[1].search.value.length > 0) {
        search.push({
            'name': {
                '$regex': '.*' + columns[1].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[3].search.value.length > 0) {
        search.push({
            'invoiceExcelFormat': {
                '$regex': '.*' + columns[3].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[4].search.value.length > 0) {
        search.push({
            'invoiceFormat': {
                '$regex': '.*' + columns[4].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    return search
}

export default invoiceExcelDataStatusSearch