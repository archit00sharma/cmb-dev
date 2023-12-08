
let invoiceToSearch = async (columns) => {
   
    let search = []
    if (columns[1].search.value.length > 0) {
        search.push({
            'templateName': {
                '$regex': '.*' + columns[1].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    return search
}

export default invoiceToSearch