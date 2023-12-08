import { Response, Router } from "express";
import moment = require("moment");
let viewDuplicateCaseSearch = async (columns) => {
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
            'mobileNumber': {
                '$regex': '.*' + columns[3].search.value + '.*',
                '$options': 'i'
            }
        },)
    }


    return search
}

export default viewDuplicateCaseSearch