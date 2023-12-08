import { Response, Router } from "express";
import moment = require("moment");

let customSearchReview = async (columns, role) => {
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
        let date1 = moment(columns[2].search.value).format('YYYY/MM/DD')
        let date2 = moment(moment(columns[2].search.value).format("YYYY/MM/DD")).add(1, 'days').format('YYYY/MM/DD');
        search.push({
            caseUploadedDate: {
                '$regex': '.*' + columns[2].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[3].search.value.length > 0) {
        search.push({
            'caseUploadedDate': {
                '$regex': '.*' + columns[3].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (role == "admin") {
        if (columns[4].search.value.length > 0) {
            search.push({
                'manager.name': {
                    '$regex': '.*' + columns[4].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[5].search.value.length > 0) {
            search.push({
                'manager.assignedDateS': {
                    '$regex': '.*' + columns[5].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[6].search.value.length > 0) {
            search.push({
                'manager.assignedDateS': {
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
                'seniorSupervisor.assignedDateS': {
                    '$regex': '.*' + columns[8].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[9].search.value.length > 0) {
            search.push({
                'seniorSupervisor.assignedDateS': {
                    '$regex': '.*' + columns[9].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }




        if (columns[10].search.value.length > 0) {
            search.push({
                'supervisor.name': {
                    '$regex': '.*' + columns[10].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[11].search.value.length > 0) {
            search.push({
                'supervisor.assignedDateS': {
                    '$regex': '.*' + columns[11].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[12].search.value.length > 0) {
            search.push({
                'supervisor.assignedDateS': {
                    '$regex': '.*' + columns[12].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[13].search.value.length > 0) {
            search.push({
                'supervisor.submittedDateS': {
                    '$regex': '.*' + columns[13].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[14].search.value.length > 0) {
            search.push({
                'supervisor.submittedDateS': {
                    '$regex': '.*' + columns[14].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[15].search.value.length > 0) {
            search.push({
                'fieldExecutive.name': {
                    '$regex': '.*' + columns[15].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[16].search.value.length > 0) {
            search.push({
                'fieldExecutive.assignedDateS': {
                    '$regex': '.*' + columns[16].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[17].search.value.length > 0) {
            search.push({
                'fieldExecutive.assignedDateS': {
                    '$regex': '.*' + columns[17].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[18].search.value.length > 0) {
            search.push({
                'fieldExecutive.acceptedDateS': {
                    '$regex': '.*' + columns[18].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[19].search.value.length > 0) {
            search.push({
                'fieldExecutive.acceptedDateS': {
                    '$regex': '.*' + columns[19].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[20].search.value.length > 0) {
            search.push({
                'fieldExecutive.submittedDateS': {
                    '$regex': '.*' + columns[20].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[21].search.value.length > 0) {
            search.push({
                'fieldExecutive.submittedDateS': {
                    '$regex': '.*' + columns[21].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[22].search.value.length > 0) {
            search.push({
                'distance': {
                    '$regex': '.*' + columns[22].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[23].search.value.length > 0) {
            search.push({
                'caseStatus': {
                    '$regex': '.*' + columns[23].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[24].search.value.length > 0) {
            search.push({
                'caseStatusRemarks': {
                    '$regex': '.*' + columns[24].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[25].search.value.length > 0) {
            search.push({
                'applicantName': {
                    '$regex': '.*' + columns[25].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[26].search.value.length > 0) {
            search.push({
                'addressType': {
                    '$regex': '.*' + columns[26].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[27].search.value.length > 0) {
            search.push({
                'product': {
                    '$regex': '.*' + columns[27].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[28].search.value.length > 0) {
            search.push({
                'area': {
                    '$regex': '.*' + columns[28].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[29].search.value.length > 0) {
            search.push({
                'bank': {
                    '$regex': '.*' + columns[29].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
    } else if (role == "manager") {

        if (columns[4].search.value.length > 0) {
            search.push({
                'seniorSupervisor.name': {
                    '$regex': '.*' + columns[4].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[5].search.value.length > 0) {
            search.push({
                'seniorSupervisor.assignedDateS': {
                    '$regex': '.*' + columns[5].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[6].search.value.length > 0) {
            search.push({
                'seniorSupervisor.assignedDateS': {
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
                'supervisor.assignedDateS': {
                    '$regex': '.*' + columns[8].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[9].search.value.length > 0) {
            search.push({
                'supervisor.assignedDateS': {
                    '$regex': '.*' + columns[9].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[10].search.value.length > 0) {
            search.push({
                'supervisor.submittedDateS': {
                    '$regex': '.*' + columns[10].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[11].search.value.length > 0) {
            search.push({
                'supervisor.submittedDateS': {
                    '$regex': '.*' + columns[11].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[12].search.value.length > 0) {
            search.push({
                'fieldExecutive.name': {
                    '$regex': '.*' + columns[12].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[13].search.value.length > 0) {
            search.push({
                'fieldExecutive.assignedDateS': {
                    '$regex': '.*' + columns[13].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[14].search.value.length > 0) {
            search.push({
                'fieldExecutive.assignedDateS': {
                    '$regex': '.*' + columns[14].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[15].search.value.length > 0) {
            search.push({
                'fieldExecutive.acceptedDateS': {
                    '$regex': '.*' + columns[15].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[16].search.value.length > 0) {
            search.push({
                'fieldExecutive.acceptedDateS': {
                    '$regex': '.*' + columns[16].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[17].search.value.length > 0) {
            search.push({
                'fieldExecutive.submittedDateS': {
                    '$regex': '.*' + columns[17].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[18].search.value.length > 0) {
            search.push({
                'fieldExecutive.submittedDateS': {
                    '$regex': '.*' + columns[18].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[19].search.value.length > 0) {
            search.push({
                'distance': {
                    '$regex': '.*' + columns[19].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[20].search.value.length > 0) {
            search.push({
                'caseStatus': {
                    '$regex': '.*' + columns[20].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[21].search.value.length > 0) {
            search.push({
                'caseStatusRemarks': {
                    '$regex': '.*' + columns[21].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[22].search.value.length > 0) {
            search.push({
                'applicantName': {
                    '$regex': '.*' + columns[22].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }


        if (columns[23].search.value.length > 0) {
            search.push({
                'addressType': {
                    '$regex': '.*' + columns[23].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[24].search.value.length > 0) {
            search.push({
                'product': {
                    '$regex': '.*' + columns[24].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[25].search.value.length > 0) {
            search.push({
                'area': {
                    '$regex': '.*' + columns[25].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[26].search.value.length > 0) {
            search.push({
                'bank': {
                    '$regex': '.*' + columns[26].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
    } else if (role == "senior-supervisor") {

        if (columns[4].search.value.length > 0) {
            search.push({
                'supervisor.name': {
                    '$regex': '.*' + columns[4].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[5].search.value.length > 0) {
            search.push({
                'supervisor.assignedDateS': {
                    '$regex': '.*' + columns[5].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[6].search.value.length > 0) {
            search.push({
                'supervisor.assignedDateS': {
                    '$regex': '.*' + columns[6].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[7].search.value.length > 0) {
            search.push({
                'supervisor.submittedDateS': {
                    '$regex': '.*' + columns[7].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[8].search.value.length > 0) {
            search.push({
                'supervisor.submittedDateS': {
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
                'fieldExecutive.assignedDateS': {
                    '$regex': '.*' + columns[10].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[11].search.value.length > 0) {
            search.push({
                'fieldExecutive.assignedDateS': {
                    '$regex': '.*' + columns[11].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[12].search.value.length > 0) {
            search.push({
                'fieldExecutive.acceptedDateS': {
                    '$regex': '.*' + columns[12].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[13].search.value.length > 0) {
            search.push({
                'fieldExecutive.acceptedDateS': {
                    '$regex': '.*' + columns[13].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[14].search.value.length > 0) {
            search.push({
                'fieldExecutive.submittedDateS': {
                    '$regex': '.*' + columns[14].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[15].search.value.length > 0) {
            search.push({
                'fieldExecutive.submittedDateS': {
                    '$regex': '.*' + columns[15].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[16].search.value.length > 0) {
            search.push({
                'distance': {
                    '$regex': '.*' + columns[16].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[17].search.value.length > 0) {
            search.push({
                'caseStatus': {
                    '$regex': '.*' + columns[17].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[18].search.value.length > 0) {
            search.push({
                'caseStatusRemarks': {
                    '$regex': '.*' + columns[18].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[19].search.value.length > 0) {
            search.push({
                'applicantName': {
                    '$regex': '.*' + columns[19].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }


        if (columns[20].search.value.length > 0) {
            search.push({
                'addressType': {
                    '$regex': '.*' + columns[20].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[21].search.value.length > 0) {
            search.push({
                'product': {
                    '$regex': '.*' + columns[21].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[22].search.value.length > 0) {
            search.push({
                'area': {
                    '$regex': '.*' + columns[22].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[23].search.value.length > 0) {
            search.push({
                'bank': {
                    '$regex': '.*' + columns[23].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
    } else if (role == "supervisor") {






        if (columns[4].search.value.length > 0) {
            search.push({
                'fieldExecutive.name': {
                    '$regex': '.*' + columns[4].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[5].search.value.length > 0) {
            search.push({
                'fieldExecutive.assignedDateS': {
                    '$regex': '.*' + columns[5].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[6].search.value.length > 0) {
            search.push({
                'fieldExecutive.assignedDateS': {
                    '$regex': '.*' + columns[6].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[7].search.value.length > 0) {
            search.push({
                'fieldExecutive.acceptedDateS': {
                    '$regex': '.*' + columns[7].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[8].search.value.length > 0) {
            search.push({
                'fieldExecutive.acceptedDateS': {
                    '$regex': '.*' + columns[8].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[9].search.value.length > 0) {
            search.push({
                'fieldExecutive.submittedDateS': {
                    '$regex': '.*' + columns[9].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[10].search.value.length > 0) {
            search.push({
                'fieldExecutive.submittedDateS': {
                    '$regex': '.*' + columns[10].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }

        if (columns[11].search.value.length > 0) {
            search.push({
                'distance': {
                    '$regex': '.*' + columns[11].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[12].search.value.length > 0) {
            search.push({
                'caseStatus': {
                    '$regex': '.*' + columns[12].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[13].search.value.length > 0) {
            search.push({
                'caseStatusRemarks': {
                    '$regex': '.*' + columns[13].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[14].search.value.length > 0) {
            search.push({
                'applicantName': {
                    '$regex': '.*' + columns[14].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }


        if (columns[15].search.value.length > 0) {
            search.push({
                'addressType': {
                    '$regex': '.*' + columns[15].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[16].search.value.length > 0) {
            search.push({
                'product': {
                    '$regex': '.*' + columns[16].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[17].search.value.length > 0) {
            search.push({
                'area': {
                    '$regex': '.*' + columns[17].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
        if (columns[18].search.value.length > 0) {
            search.push({
                'bank': {
                    '$regex': '.*' + columns[18].search.value + '.*',
                    '$options': 'i'
                }
            },)
        }
    }




    return search
}

export default customSearchReview