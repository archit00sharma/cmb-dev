import { Response, Router } from "express";
import moment = require("moment");
let customSearch = async (columns) => {
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
            'time': {
                '$regex': '.*' + columns[2].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[3].search.value.length > 0) {
        search.push({
            'fileNo': {
                '$regex': '.*' + columns[3].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[4].search.value.length > 0) {
        search.push({
            'barCode': {
                '$regex': '.*' + columns[4].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[5].search.value.length > 0) {
        search.push({
            'applicantName': {
                '$regex': '.*' + columns[5].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[6].search.value.length > 0) {
        search.push({
            'applicantType': {
                '$regex': '.*' + columns[6].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[7].search.value.length > 0) {
        search.push({
            'addressType': {
                '$regex': '.*' + columns[7].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[8].search.value.length > 0) {
        search.push({
            'officeName': {
                '$regex': '.*' + columns[8].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[9].search.value.length > 0) {
        search.push({
            'address': {
                '$regex': '.*' + columns[9].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[10].search.value.length > 0) {
        search.push({
            'pincode': {
                '$regex': '.*' + columns[10].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[11].search.value.length > 0) {
        search.push({
            'branch': {
                '$regex': '.*' + columns[11].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[12].search.value.length > 0) {
        search.push({
            'area': {
                '$regex': '.*' + columns[12].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[13].search.value.length > 0) {
        search.push({
            'mobileNumber': {
                '$regex': '.*' + columns[13].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[14].search.value.length > 0) {
        search.push({
            'bank': {
                '$regex': '.*' + columns[14].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[15].search.value.length > 0) {
        search.push({
            'product': {
                '$regex': '.*' + columns[15].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[16].search.value.length > 0) {
        let date1 = moment(columns[16].search.value).format('YYYY/MM/DD')
        let date2 = moment(moment(columns[16].search.value).format('YYYY/MM/DD')).add(1, 'days').format('YYYY/MM/DD');
        search.push({
            "caseUploadedDate": {
                '$regex': '.*' + columns[16].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[17].search.value.length > 0) {
        search.push({
            "caseUploadedDate": {
                '$regex': '.*' + columns[17].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[18].search.value.length > 0) {
        search.push({
            'manager.name': {
                '$regex': '.*' + columns[18].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[19].search.value.length > 0) {
        search.push({
            'manager.assignedDateS': {
                '$regex': '.*' + columns[19].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[20].search.value.length > 0) {
        search.push({
            'manager.assignedDateS': {
                '$regex': '.*' + columns[20].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[21].search.value.length > 0) {
        search.push({
            'manager.submittedDateS': {
                '$regex': '.*' + columns[21].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[22].search.value.length > 0) {
        search.push({
            'manager.submittedDateS': {
                '$regex': '.*' + columns[22].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[23].search.value.length > 0) {
        search.push({
            'seniorSupervisor.name': {
                '$regex': '.*' + columns[23].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[24].search.value.length > 0) {
        search.push({
            'seniorSupervisor.assignedDateS': {
                '$regex': '.*' + columns[24].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[25].search.value.length > 0) {
        search.push({
            'seniorSupervisor.assignedDateS': {
                '$regex': '.*' + columns[25].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[26].search.value.length > 0) {
        search.push({
            'seniorSupervisor.submittedDateS': {
                '$regex': '.*' + columns[26].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[27].search.value.length > 0) {
        search.push({
            'seniorSupervisor.submittedDateS': {
                '$regex': '.*' + columns[27].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[28].search.value.length > 0) {
        search.push({
            'supervisor.name': {
                '$regex': '.*' + columns[28].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[29].search.value.length > 0) {
        search.push({
            'supervisor.assignedDateS': {
                '$regex': '.*' + columns[29].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[30].search.value.length > 0) {
        search.push({
            'supervisor.assignedDateS': {
                '$regex': '.*' + columns[30].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[31].search.value.length > 0) {
        search.push({
            'supervisor.submittedDateS': {
                '$regex': '.*' + columns[31].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[32].search.value.length > 0) {
        search.push({
            'supervisor.submittedDateS': {
                '$regex': '.*' + columns[32].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[33].search.value.length > 0) {
        search.push({
            'admin.name': {
                '$regex': '.*' + columns[33].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[34].search.value.length > 0) {
        search.push({
            'admin.submittedDateS': {
                '$regex': '.*' + columns[34].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[35].search.value.length > 0) {
        search.push({
            'admin.submittedDateS': {
                '$regex': '.*' + columns[35].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[36].search.value.length > 0) {
        search.push({
            'fieldExecutive.name': {
                '$regex': '.*' + columns[36].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[37].search.value.length > 0) {
        search.push({
            'fieldExecutive.assignedDateS': {
                '$regex': '.*' + columns[37].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[38].search.value.length > 0) {
        search.push({
            'fieldExecutive.assignedDateS': {
                '$regex': '.*' + columns[38].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[39].search.value.length > 0) {
        search.push({
            'fieldExecutive.acceptedDateS': {
                '$regex': '.*' + columns[39].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[40].search.value.length > 0) {
        search.push({
            'fieldExecutive.acceptedDateS': {
                '$regex': '.*' + columns[40].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[41].search.value.length > 0) {
        search.push({
            'fieldExecutive.submittedDateS': {
                '$regex': '.*' + columns[41].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[42].search.value.length > 0) {
        search.push({
            'fieldExecutive.submittedDateS': {
                '$regex': '.*' + columns[42].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

    if (columns[43].search.value.length > 0) {
        search.push({
            'distance': {
                '$regex': '.*' + columns[43].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[44].search.value.length > 0) {
        search.push({
            'caseStatus': {
                '$regex': '.*' + columns[44].search.value + '.*',
                '$options': 'i'
            }
        },)
    }
    if (columns[45].search.value.length > 0) {
        search.push({
            'caseStatusRemarks': {
                '$regex': '.*' + columns[45].search.value + '.*',
                '$options': 'i'
            }
        },)
    }

  
    return search
}

export default customSearch