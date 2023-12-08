import { Response, Router } from "express";
import moment = require("moment");
let viewUploadedCaseSearch = async (columns, role) => {
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
            'mobileNumber': {
                '$regex': '.*' + columns[2].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[3].search.value.length > 0) {
        search.push({
            'applicantName': {
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
            'address': {
                '$regex': '.*' + columns[5].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (role === "admin") {
        if (columns[6].search.value.length > 0) {
            search.push({
                'manager.name': {
                    '$regex': '.*' + columns[6].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[7].search.value.length > 0) {
            search.push({
                'seniorSupervisor.name': {
                    '$regex': '.*' + columns[7].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[8].search.value.length > 0) {
            search.push({
                'supervisor.name': {
                    '$regex': '.*' + columns[8].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[9].search.value.length > 0) {
            search.push({
                'fieldExecutive.name': {
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
                'area': {
                    '$regex': '.*' + columns[11].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[12].search.value.length > 0) {
            search.push({
                'bank': {
                    '$regex': '.*' + columns[12].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[13].search.value.length > 0) {
            search.push({
                "caseUploadedDate": {
                    '$regex': '.*' + columns[13].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[14].search.value.length > 0) {
            search.push({
                "caseUploadedDate": {
                    '$regex': '.*' + columns[14].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
    }

    if (role === "manager") {

        if (columns[6].search.value.length > 0) {
            search.push({
                'seniorSupervisor.name': {
                    '$regex': '.*' + columns[6].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[7].search.value.length > 0) {
            search.push({
                'supervisor.name': {
                    '$regex': '.*' + columns[7].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[8].search.value.length > 0) {
            search.push({
                'fieldExecutive.name': {
                    '$regex': '.*' + columns[8].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[9].search.value.length > 0) {
            search.push({
                'product': {
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
            search.push({
                'bank': {
                    '$regex': '.*' + columns[11].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[12].search.value.length > 0) {
            let date1 = moment(columns[12].search.value).format('YYYY/MM/DD')
            let date2 = moment(moment(columns[12].search.value).format('YYYY/MM/DD')).add(1, 'days').format('YYYY/MM/DD');
            search.push({
                "caseUploadedDate": {
                    '$regex': '.*' + columns[12].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[13].search.value.length > 0) {
            search.push({
                "caseUploadedDate": {
                    '$regex': '.*' + columns[13].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

    }

    if (role === "senior-supervisor") {

        if (columns[6].search.value.length > 0) {
            search.push({
                'supervisor.name': {
                    '$regex': '.*' + columns[6].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[7].search.value.length > 0) {
            search.push({
                'fieldExecutive.name': {
                    '$regex': '.*' + columns[7].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[8].search.value.length > 0) {
            search.push({
                'product': {
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
                'bank': {
                    '$regex': '.*' + columns[10].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[11].search.value.length > 0) {
            let date1 = moment(columns[11].search.value).format('YYYY/MM/DD')
            let date2 = moment(moment(columns[11].search.value).format('YYYY/MM/DD')).add(1, 'days').format('YYYY/MM/DD');
            search.push({
                "caseUploadedDate": {
                    '$regex': '.*' + columns[11].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[12].search.value.length > 0) {
            search.push({
                "caseUploadedDate": {
                    '$regex': '.*' + columns[12].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

    }

    if (role === "supervisor") {

        if (columns[6].search.value.length > 0) {
            search.push({
                'fieldExecutive.name': {
                    '$regex': '.*' + columns[6].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[7].search.value.length > 0) {
            search.push({
                'product': {
                    '$regex': '.*' + columns[7].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[8].search.value.length > 0) {
            search.push({
                'area': {
                    '$regex': '.*' + columns[8].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[9].search.value.length > 0) {
            search.push({
                'bank': {
                    '$regex': '.*' + columns[9].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[10].search.value.length > 0) {
            let date1 = moment(columns[10].search.value).format('YYYY/MM/DD')
            let date2 = moment(moment(columns[10].search.value).format('YYYY/MM/DD')).add(1, 'days').format('YYYY/MM/DD');
            search.push({
                "caseUploadedDate": {
                    '$regex': '.*' + columns[10].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[11].search.value.length > 0) {
            search.push({
                "caseUploadedDate": {
                    '$regex': '.*' + columns[11].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

    }



    return search
}

export default viewUploadedCaseSearch