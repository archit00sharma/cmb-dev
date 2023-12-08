import moment from "moment";
import mongoose from "mongoose";
import caseModel from "../../models/case.model";
const calTat = async (req, date1, date2) => {
    let oneArray = [];
    let twoArray = [];
    let threeArray = [];
    let fourArray = [];
    let fiveArray = [];
    let sixArray = [];
    let sevenArray = [];
    let notSubmittedArray = [];
    let one = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    let six = 0;
    let seven = 0;
    let notSubmitted = 0;
    let submittedDate: any = "";
    let assignedDate: any = "";

    if (req.body.member == "fieldExecutive") {
        let condition = [];
        condition.push(
            {
                $match: {
                    fieldExecutiveId: new mongoose.Types.ObjectId(req.body.id),
                },
            },
            {
                $match: {
                    "fieldExecutive.assignedDate": {
                        $exists: true,
                    },
                },
            },
            {
                $match: {
                    caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                    },
                },
            }, {
            '$project': {
                'fileNo':1,
                'date':1,
                'time':1,
                'barCode':1,
                'applicantName':1,
                'applicantType':1,
                'addressType':1,
                'officeName':1,
                'address':1,
                'pinCode':1,
                'branch':1,
                'area':1,
                'mobileNo':1,
                'bank':1,
                'product':1,
                'distance':1,
                'caseStatus':1,
                'caseStatusRemarks':1,
                'caseUploaded': 1,
                'manager': 1,
                'seniorSupervisor': 1,
                'fieldExecutive': 1,
                'supervisor': 1
            }
        }

        );
        let fieldExecutive = await caseModel.aggregate(condition);
        for (let i = 0; i < fieldExecutive.length; i++) {
            if (fieldExecutive[i].fieldExecutive.submittedDate) {
                let assignedTime = moment
                    .duration(
                        moment(fieldExecutive[i].fieldExecutive.assignedDate)
                            .utc()
                            .format("HH:mm")
                    )
                    .asMinutes();
                let submittedTime = moment
                    .duration(
                        moment(fieldExecutive[i].fieldExecutive.submittedDate)
                            .utc()
                            .format("HH:mm")
                    )
                    .asMinutes();

                if (assignedTime >= 570 && assignedTime <= 960 && submittedTime >= 570 && submittedTime <= 1110) {
                    let checkDateIsSame = moment(moment(fieldExecutive[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD")).isSame(moment(fieldExecutive[i].fieldExecutive.submittedDate).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(moment(fieldExecutive[i].fieldExecutive.submittedDate).utc()).diff(moment(fieldExecutive[i].fieldExecutive.assignedDate).utc(), "minutes");
                        hoursDiff = hoursDiff / 60;
                        if (hoursDiff >= 0 && hoursDiff <= 3) {
                            one++;
                            oneArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 3 && hoursDiff <= 4) {
                            two++;
                            twoArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 4 && hoursDiff <= 6) {
                            three++;
                            threeArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 6 && hoursDiff <= 8) {
                            four++;
                            fourArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 8 && hoursDiff <= 12) {
                            five++;
                            fiveArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 12 && hoursDiff <= 18) {
                            six++;
                            sixArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 18) {
                            seven++;
                            sevenArray.push(fieldExecutive[i]);
                        }
                    } else {
                        let daysDiff = moment(moment(fieldExecutive[i].fieldExecutive.submittedDate).utc().format("YYYY-MM-DD")).diff(moment(fieldExecutive[i].fieldExecutive.assignedDate).utc().format("YYYY-MM-DD"), "days");
                        let hoursDiff = moment(moment(fieldExecutive[i].fieldExecutive.submittedDate).utc()).diff(moment(fieldExecutive[i].fieldExecutive.assignedDate).utc(), "minutes");
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        if (hoursDiff >= 0 && hoursDiff <= 3) {
                            one++;
                            oneArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 3 && hoursDiff <= 4) {
                            two++;
                            twoArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 4 && hoursDiff <= 6) {
                            three++;
                            threeArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 6 && hoursDiff <= 8) {
                            four++;
                            fourArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 8 && hoursDiff <= 12) {
                            five++;
                            fiveArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 12 && hoursDiff <= 18) {
                            six++;
                            sixArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 18) {
                            seven++;
                            sevenArray.push(fieldExecutive[i]);
                        }
                    }
                }
                if (
                    (assignedTime < 570 || assignedTime > 960) &&
                    submittedTime >= 570 &&
                    submittedTime <= 1110
                ) {
                    let newDate1: any = "";
                    let newDate2: any = "";
                    if (assignedTime > 960 && assignedTime < 1440) {
                        let sameDate = moment(
                            moment(fieldExecutive[i].fieldExecutive.assignedDate)
                                .utc()
                                .format("YYYY-MM-DD")
                        ).isSame(
                            moment(fieldExecutive[i].fieldExecutive.submittedDate)
                                .utc()
                                .format("YYYY-MM-DD")
                        );
                        if (sameDate) {
                            newDate2 = moment(
                                fieldExecutive[i].fieldExecutive.submittedDate,
                                "YYYY-MM-DD"
                            )
                                .utc()
                                .add(1, "days");
                            newDate2 = moment(newDate2)
                                .utc()
                                .set("hour", 9)
                                .set("minute", 30)
                                .set("second", 0);
                        }
                        newDate1 = moment(
                            fieldExecutive[i].fieldExecutive.assignedDate,
                            "YYYY-MM-DD"
                        )
                            .utc()
                            .add(1, "days");
                        newDate1 = moment(newDate1)
                            .utc()
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate1 = moment(
                            fieldExecutive[i].fieldExecutive.assignedDate 
                        )
                            .utc()
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(newDate1).utc().format("YYYY-MM-DD")
                    ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(newDate2)
                            .utc()
                            .diff(moment(newDate1).utc(), "minutes");
                        hoursDiff = hoursDiff / 60;
                        if (hoursDiff >= 0 && hoursDiff <= 3) {
                            one++;
                            oneArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 3 && hoursDiff <= 4) {
                            two++;
                            twoArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 4 && hoursDiff <= 6) {
                            three++;
                            threeArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 6 && hoursDiff <= 8) {
                            four++;
                            fourArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 8 && hoursDiff <= 12) {
                            five++;
                            fiveArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 12 && hoursDiff <= 18) {
                            six++;
                            sixArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 18) {
                            seven++;
                            sevenArray.push(fieldExecutive[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(fieldExecutive[i].fieldExecutive.submittedDate)
                                .utc()
                                .format("YYYY-MM-DD")
                        ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                        let hoursDiff = moment(
                            moment(fieldExecutive[i].fieldExecutive.submittedDate).utc()
                        ).diff(moment(newDate1).utc(), "minutes");
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;

                        if (hoursDiff >= 0 && hoursDiff <= 3) {
                            one++;
                            oneArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 3 && hoursDiff <= 4) {
                            two++;
                            twoArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 4 && hoursDiff <= 6) {
                            three++;
                            threeArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 6 && hoursDiff <= 8) {
                            four++;
                            fourArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 8 && hoursDiff <= 12) {
                            five++;
                            fiveArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 12 && hoursDiff <= 18) {
                            six++;
                            sixArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 18) {
                            seven++;
                            sevenArray.push(fieldExecutive[i]);
                        }
                    }

                }
                if (
                    assignedTime >= 570 &&
                    assignedTime <= 960 &&
                    (submittedTime < 570 || submittedTime > 1110)
                ) {
                    let newDate2: any = "";
                    if (submittedTime > 1110 && submittedTime < 1440) {
                        newDate2 = moment(
                            moment(
                                fieldExecutive[i].fieldExecutive.submittedDate
                            ).format("YYYY-MM-DD")
                        )
                            .utc()
                            .add(1, "days");
                        newDate2 = moment(moment(newDate2).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate2 = moment(
                            fieldExecutive[i].fieldExecutive.submittedDate
                        )
                            .utc()
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(fieldExecutive[i].fieldExecutive.assignedDate)
                            .utc()
                            .format("YYYY-MM-DD")
                    ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(moment(newDate2)).diff(
                            moment(fieldExecutive[i].fieldExecutive.assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        if (hoursDiff >= 0 && hoursDiff <= 3) {
                            one++;
                            oneArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 3 && hoursDiff <= 4) {
                            two++;
                            twoArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 4 && hoursDiff <= 6) {
                            three++;
                            threeArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 6 && hoursDiff <= 8) {
                            four++;
                            fourArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 8 && hoursDiff <= 12) {
                            five++;
                            fiveArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 12 && hoursDiff <= 18) {
                            six++;
                            sixArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 18) {
                            seven++;
                            sevenArray.push(fieldExecutive[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(newDate2).utc().format("YYYY-MM-DD")
                        ).diff(
                            moment(fieldExecutive[i].fieldExecutive.assignedDate)
                                .utc()
                                .format("YYYY-MM-DD"),
                            "days"
                        );
                        let hoursDiff = moment(moment(newDate2).utc()).diff(
                            moment(fieldExecutive[i].fieldExecutive.assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;

                        if (hoursDiff >= 0 && hoursDiff <= 3) {
                            one++;
                            oneArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 3 && hoursDiff <= 4) {
                            two++;
                            twoArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 4 && hoursDiff <= 6) {
                            three++;
                            threeArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 6 && hoursDiff <= 8) {
                            four++;
                            fourArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 8 && hoursDiff <= 12) {
                            five++;
                            fiveArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 12 && hoursDiff <= 18) {
                            six++;
                            sixArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 18) {
                            seven++;
                            sevenArray.push(fieldExecutive[i]);
                        }
                    }
                }
                if (
                    (assignedTime < 570 || assignedTime > 960) &&
                    (submittedTime < 570 || submittedTime > 1110)
                ) {
                    let newDate1: any = "";
                    let newDate2: any = "";
                    if (assignedTime > 960 && assignedTime < 1440) {
                        newDate1 = moment(
                            moment(fieldExecutive[i].fieldExecutive.assignedDate)
                        )
                            .utc()
                            .add(1, "days");
                        newDate1 = moment(newDate1)
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate1 = moment(
                            moment(fieldExecutive[i].fieldExecutive.assignedDate)
                        )
                            .utc()
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    if (submittedTime > 1110 && submittedTime < 1440) {
                        newDate2 = moment(
                            moment(fieldExecutive[i].fieldExecutive.submittedDate).utc()
                        ).add(1, "days");
                        newDate2 = moment(newDate2)
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate2 = moment(
                            moment(fieldExecutive[i].fieldExecutive.submittedDate).utc()
                        )
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }

                    let checkDateIsSame = moment(
                        moment(newDate1).utc().format("YYYY-MM-DD")
                    ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(newDate2).diff(
                            moment(newDate1),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;

                        if (hoursDiff >= 0 && hoursDiff <= 3) {
                            one++;
                            oneArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 3 && hoursDiff <= 4) {
                            two++;
                            twoArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 4 && hoursDiff <= 6) {
                            three++;
                            threeArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 6 && hoursDiff <= 8) {
                            four++;
                            fourArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 8 && hoursDiff <= 12) {
                            five++;
                            fiveArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 12 && hoursDiff <= 18) {
                            six++;
                            sixArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 18) {
                            seven++;
                            sevenArray.push(fieldExecutive[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(newDate2).utc().format("YYYY-MM-DD")
                        ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                        let hoursDiff = moment(moment(newDate2)).diff(
                            moment(newDate1),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        if (hoursDiff >= 0 && hoursDiff <= 3) {
                            one++;
                            oneArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 3 && hoursDiff <= 4) {
                            two++;
                            twoArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 4 && hoursDiff <= 6) {
                            three++;
                            threeArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 6 && hoursDiff <= 8) {
                            four++;
                            fourArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 8 && hoursDiff <= 12) {
                            five++;
                            fiveArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 12 && hoursDiff <= 18) {
                            six++;
                            sixArray.push(fieldExecutive[i]);
                        }
                        if (hoursDiff > 18) {
                            seven++;
                            sevenArray.push(fieldExecutive[i]);
                        }
                    }
                }
            } else {
                if (fieldExecutive[i].stage != "submited") {
                    notSubmitted++;
                    notSubmittedArray.push(fieldExecutive[i]);
                }
            }
        }
    };

    if (req.body.member == "manager") {
        let condition = [];
        condition.push(
            {
                $match: {
                    managerId: new mongoose.Types.ObjectId(req.body.id),
                },
            },
            {
                $match: {
                    "manager.assignedDate": {
                        $exists: true,
                    },
                },
            },
            {
                $match: {
                    caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                    },
                },
            }
        );
        let manager = await caseModel.aggregate(condition);
        for (let i = 0; i < manager.length; i++) {
            submittedDate = "";
            assignedDate = "";
            if (
                (manager[i].manager?.submittedDate ||
                    manager[i].seniorSupervisor?.submittedDate) &&
                manager[i].stage == "submited"
            ) {
                if (manager[i].seniorSupervisor?.submittedDate) {
                    submittedDate = moment(
                        manager[i].seniorSupervisor.submittedDate
                    )
                        .utc()
                        .format();
                }
                if (manager[i].manager?.submittedDate) {
                    submittedDate = moment(manager[i].manager.submittedDate)
                        .utc()
                        .format();
                }
                if (manager[i].fieldExecutive?.submittedDate) {
                    assignedDate = moment(manager[i].fieldExecutive.submittedDate)
                        .utc()
                        .format();
                }
                if (manager[i].supervisor?.submittedDate) {
                    assignedDate = moment(manager[i].supervisor.submittedDate)
                        .utc()
                        .format();
                }
                let assignedTime = moment
                    .duration(moment(assignedDate).utc().format("HH:mm"))
                    .asMinutes();
                let submittedTime = moment
                    .duration(moment(submittedDate).utc().format("HH:mm"))
                    .asMinutes();


                if (
                    assignedTime >= 570 &&
                    assignedTime <= 1110 &&
                    submittedTime >= 570 &&
                    submittedTime <= 1110
                ) {
                    let checkDateIsSame = moment(
                        moment(assignedDate).utc().format("YYYY-MM-DD")
                    ).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(manager[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(manager[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(manager[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(manager[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(manager[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(manager[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(manager[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(submittedDate).utc().format("YYYY-MM-DD")
                        ).diff(
                            moment(assignedDate).utc().format("YYYY-MM-DD"),
                            "days"
                        );
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(assignedDate).utc(),
                            "minute"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(manager[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(manager[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(manager[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(manager[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(manager[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(manager[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(manager[i]);
                        }
                    }
                }
                if (
                    (assignedTime < 570 || assignedTime > 1110) &&
                    submittedTime >= 570 &&
                    submittedTime <= 1110
                ) {
                    let newDate1: any = "";
                    if (assignedTime > 1110 && assignedTime < 1440) {
                        newDate1 = moment(moment(assignedDate).format("YYYY-MM-DD"))
                            .utc()
                            .add(1, "days");
                        newDate1 = moment(moment(newDate1).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate1 = moment(moment(assignedDate).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(newDate1).utc().format("YYYY-MM-DD")
                    ).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(newDate1).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(manager[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(manager[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(manager[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(manager[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(manager[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(manager[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(manager[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(submittedDate).utc().format("YYYY-MM-DD")
                        ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(newDate1).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(manager[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(manager[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(manager[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(manager[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(manager[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(manager[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(manager[i]);
                        }
                    }
                }
                if (
                    assignedTime >= 570 &&
                    assignedTime <= 1110 &&
                    (submittedTime < 570 || submittedTime > 1110)
                ) {
                    let newDate2: any = "";
                    if (submittedTime > 1110 && submittedTime < 1440) {
                        newDate2 = moment(moment(submittedDate).format("YYYY-MM-DD"))
                            .utc()
                            .add(1, "days");
                        newDate2 = moment(newDate2)
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate2 = moment(moment(submittedDate).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(assignedDate).utc().format("YYYY-MM-DD")
                    ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(newDate2).diff(
                            moment(assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(manager[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(manager[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(manager[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(manager[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(manager[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(manager[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(manager[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(newDate2).utc().format("YYYY-MM-DD")
                        ).diff(
                            moment(assignedDate).utc().format("YYYY-MM-DD"),
                            "days"
                        );
                        let hoursDiff = moment(newDate2).diff(
                            moment(assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(manager[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(manager[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(manager[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(manager[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(manager[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(manager[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(manager[i]);
                        }
                    }
                }
                if (
                    (assignedTime < 570 || assignedTime > 1110) &&
                    (submittedTime < 570 || submittedTime > 1110)
                ) {
                    let newDate1: any = "";
                    let newDate2: any = "";
                    if (assignedTime > 1110 && assignedTime < 1440) {
                        newDate1 = moment(moment(assignedDate)).utc().add(1, "days");
                        newDate1 = moment(moment(newDate1).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate1 = moment(moment(assignedDate).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    if (submittedTime > 1110 && submittedTime < 1440) {
                        newDate2 = moment(moment(submittedDate)).utc().add(1, "days");
                        newDate2 = moment(moment(newDate2).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate2 = moment(submittedDate)
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(newDate1).utc().format("YYYY-MM-DD")
                    ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(newDate2).diff(
                            moment(newDate1),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(manager[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(manager[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(manager[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(manager[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(manager[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(manager[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(manager[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(newDate2).utc().format("YYYY-MM-DD")
                        ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                        let hoursDiff = moment(newDate2).diff(
                            moment(newDate1),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(manager[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(manager[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(manager[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(manager[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(manager[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(manager[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(manager[i]);
                        }
                    }
                }
            } else {
                if (manager[i].stage != "submited") {
                    notSubmitted++;
                    notSubmittedArray.push(manager[i]);
                }
            }
        }


    };

    if (req.body.member == "seniorSupervisor") {
        let condition = [];
        condition.push(
            {
                $match: {
                    seniorSupervisorId: new mongoose.Types.ObjectId(req.body.id),
                },
            },
            {
                $match: {
                    "seniorSupervisor.assignedDate": {
                        $exists: true,
                    },
                },
            },
            {
                $match: {
                    caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                    },
                },
            }
        );
        let seniorSupervisor = await caseModel.aggregate(condition);
        for (let i = 0; i < seniorSupervisor.length; i++) {
            submittedDate = "";
            assignedDate = "";
            if (
                (seniorSupervisor[i].manager?.submittedDate ||
                    seniorSupervisor[i].seniorSupervisor?.submittedDate) &&
                seniorSupervisor[i].stage == "submited"
            ) {
                if (seniorSupervisor[i].seniorSupervisor?.submittedDate) {
                    submittedDate = moment(
                        seniorSupervisor[i].seniorSupervisor.submittedDate
                    )
                        .utc()
                        .format();
                }
                if (seniorSupervisor[i].manager?.submittedDate) {
                    submittedDate = moment(
                        seniorSupervisor[i].manager.submittedDate
                    )
                        .utc()
                        .format();
                }
                if (seniorSupervisor[i].fieldExecutive?.submittedDate) {
                    assignedDate = moment(
                        seniorSupervisor[i].fieldExecutive.submittedDate
                    )
                        .utc()
                        .format();
                }
                if (seniorSupervisor[i].supervisor?.submittedDate) {
                    assignedDate = moment(
                        seniorSupervisor[i].supervisor.submittedDate
                    )
                        .utc()
                        .format();
                }
                let assignedTime = moment
                    .duration(moment(assignedDate).utc().format("HH:mm"))
                    .asMinutes();
                let submittedTime = moment
                    .duration(moment(submittedDate).utc().format("HH:mm"))
                    .asMinutes();

                if (
                    assignedTime >= 570 &&
                    assignedTime <= 1110 &&
                    submittedTime >= 570 &&
                    submittedTime <= 1110
                ) {
                    let checkDateIsSame = moment(
                        moment(assignedDate).utc().format("YYYY-MM-DD")
                    ).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(seniorSupervisor[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(submittedDate).utc().format("YYYY-MM-DD")
                        ).diff(
                            moment(assignedDate).utc().format("YYYY-MM-DD"),
                            "days"
                        );
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(assignedDate).utc(),
                            "minute"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(seniorSupervisor[i]);
                        }
                    }
                }
                if (
                    (assignedTime < 570 || assignedTime > 1110) &&
                    submittedTime >= 570 &&
                    submittedTime <= 1110
                ) {
                    let newDate1: any = "";
                    if (assignedTime > 1110 && assignedTime < 1440) {
                        newDate1 = moment(moment(assignedDate).format("YYYY-MM-DD"))
                            .utc()
                            .add(1, "days");
                        newDate1 = moment(moment(newDate1).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate1 = moment(moment(assignedDate).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(newDate1).utc().format("YYYY-MM-DD")
                    ).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(newDate1).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(seniorSupervisor[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(submittedDate).utc().format("YYYY-MM-DD")
                        ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(newDate1).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(seniorSupervisor[i]);
                        }
                    }
                }
                if (
                    assignedTime >= 570 &&
                    assignedTime <= 1110 &&
                    (submittedTime < 570 || submittedTime > 1110)
                ) {
                    let newDate2: any = "";
                    if (submittedTime > 1110 && submittedTime < 1440) {
                        newDate2 = moment(moment(submittedDate).format("YYYY-MM-DD"))
                            .utc()
                            .add(1, "days");
                        newDate2 = moment(newDate2)
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate2 = moment(moment(submittedDate).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(assignedDate).utc().format("YYYY-MM-DD")
                    ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(newDate2).diff(
                            moment(assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(seniorSupervisor[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(newDate2).utc().format("YYYY-MM-DD")
                        ).diff(
                            moment(assignedDate).utc().format("YYYY-MM-DD"),
                            "days"
                        );
                        let hoursDiff = moment(newDate2).diff(
                            moment(assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(seniorSupervisor[i]);
                        }
                    }
                }
                if (
                    (assignedTime < 570 || assignedTime > 1110) &&
                    (submittedTime < 570 || submittedTime > 1110)
                ) {
                    let newDate1: any = "";
                    let newDate2: any = "";
                    if (assignedTime > 1110 && assignedTime < 1440) {
                        newDate1 = moment(moment(assignedDate)).utc().add(1, "days");
                        newDate1 = moment(moment(newDate1).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate1 = moment(moment(assignedDate).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    if (submittedTime > 1110 && submittedTime < 1440) {
                        newDate2 = moment(moment(submittedDate)).utc().add(1, "days");
                        newDate2 = moment(moment(newDate2).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate2 = moment(submittedDate)
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(newDate1).utc().format("YYYY-MM-DD")
                    ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(newDate2).diff(
                            moment(newDate1),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(seniorSupervisor[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(newDate2).utc().format("YYYY-MM-DD")
                        ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                        let hoursDiff = moment(newDate2).diff(
                            moment(newDate1),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(seniorSupervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(seniorSupervisor[i]);
                        }
                    }
                }
            } else {
                if (seniorSupervisor[i].stage != "submited") {
                    notSubmitted++;
                    notSubmittedArray.push(seniorSupervisor[i]);
                }
            }
        }

    };

    if (req.body.member == "supervisor") {
        let condition = [];
        condition.push(
            {
                $match: {
                    supervisorId: new mongoose.Types.ObjectId(req.body.id),
                },
            },
            {
                $match: {
                    "supervisor.assignedDate": {
                        $exists: true,
                    },
                },
            },
            {
                $match: {
                    caseUploaded: {
                        $gte: new Date(moment(date1).format("YYYY-MM-DD")),
                        $lte: new Date(moment(date2).format("YYYY-MM-DD")),
                    },
                },
            }
        );
        let supervisor = await caseModel.aggregate(condition);
        for (let i = 0; i < supervisor.length; i++) {
            submittedDate = "";
            assignedDate = "";
            if (
                supervisor[i].supervisor?.submittedDate &&
                supervisor[i].stage == "submited"
            ) {
                submittedDate = moment(supervisor[i].supervisor.submittedDate)
                    .utc()
                    .format();
                if (supervisor[i].fieldExecutive?.submittedDate) {
                    assignedDate = moment(
                        supervisor[i].fieldExecutive?.submittedDate
                    )
                        .utc()
                        .format();
                }
                if (
                    supervisor[i].directSupervisor == true &&
                    supervisor[i].supervisor?.assignedDate
                ) {
                    assignedDate = moment(supervisor[i].supervisor?.assignedDate)
                        .utc()
                        .format();
                }
                let assignedTime = moment
                    .duration(moment(assignedDate).utc().format("HH:mm"))
                    .asMinutes();
                let submittedTime = moment
                    .duration(moment(submittedDate).utc().format("HH:mm"))
                    .asMinutes();

                if (
                    assignedTime >= 570 &&
                    assignedTime <= 1110 &&
                    submittedTime >= 570 &&
                    submittedTime <= 1110
                ) {
                    let checkDateIsSame = moment(
                        moment(assignedDate).utc().format("YYYY-MM-DD")
                    ).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(supervisor[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(submittedDate).utc().format("YYYY-MM-DD")
                        ).diff(
                            moment(assignedDate).utc().format("YYYY-MM-DD"),
                            "days"
                        );
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(assignedDate).utc(),
                            "minute"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(supervisor[i]);
                        }
                    }
                }
                if (
                    (assignedTime < 570 || assignedTime > 1110) &&
                    submittedTime >= 570 &&
                    submittedTime <= 1110
                ) {
                    let newDate1: any = "";
                    if (assignedTime > 1110 && assignedTime < 1440) {
                        newDate1 = moment(moment(assignedDate).format("YYYY-MM-DD"))
                            .utc()
                            .add(1, "days");
                        newDate1 = moment(moment(newDate1).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate1 = moment(moment(assignedDate).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(newDate1).utc().format("YYYY-MM-DD")
                    ).isSame(moment(submittedDate).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(newDate1).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(supervisor[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(submittedDate).utc().format("YYYY-MM-DD")
                        ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                        let hoursDiff = moment(moment(submittedDate).utc()).diff(
                            moment(newDate1).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(supervisor[i]);
                        }
                    }
                }
                if (
                    assignedTime >= 570 &&
                    assignedTime <= 1110 &&
                    (submittedTime < 570 || submittedTime > 1110)
                ) {
                    let newDate2: any = "";
                    if (submittedTime > 1110 && submittedTime < 1440) {
                        newDate2 = moment(moment(submittedDate).format("YYYY-MM-DD"))
                            .utc()
                            .add(1, "days");
                        newDate2 = moment(newDate2)
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate2 = moment(moment(submittedDate).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(assignedDate).utc().format("YYYY-MM-DD")
                    ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(newDate2).diff(
                            moment(assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(supervisor[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(newDate2).utc().format("YYYY-MM-DD")
                        ).diff(
                            moment(assignedDate).utc().format("YYYY-MM-DD"),
                            "days"
                        );
                        let hoursDiff = moment(newDate2).diff(
                            moment(assignedDate).utc(),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(supervisor[i]);
                        }
                    }
                }
                if (
                    (assignedTime < 570 || assignedTime > 1110) &&
                    (submittedTime < 570 || submittedTime > 1110)
                ) {
                    let newDate1: any = "";
                    let newDate2: any = "";
                    if (assignedTime > 1110 && assignedTime < 1440) {
                        newDate1 = moment(moment(assignedDate)).utc().add(1, "days");
                        newDate1 = moment(moment(newDate1).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate1 = moment(moment(assignedDate).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    if (submittedTime > 1110 && submittedTime < 1440) {
                        newDate2 = moment(moment(submittedDate)).utc().add(1, "days");
                        newDate2 = moment(moment(newDate2).utc())
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    } else {
                        newDate2 = moment(submittedDate)
                            .set("hour", 9)
                            .set("minute", 30)
                            .set("second", 0);
                    }
                    let checkDateIsSame = moment(
                        moment(newDate1).utc().format("YYYY-MM-DD")
                    ).isSame(moment(newDate2).utc().format("YYYY-MM-DD"));
                    if (checkDateIsSame) {
                        let hoursDiff = moment(newDate2).diff(
                            moment(newDate1),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(supervisor[i]);
                        }
                    } else {
                        let daysDiff = moment(
                            moment(newDate2).utc().format("YYYY-MM-DD")
                        ).diff(moment(newDate1).utc().format("YYYY-MM-DD"), "days");
                        let hoursDiff = moment(newDate2).diff(
                            moment(newDate1),
                            "minutes"
                        );
                        hoursDiff = hoursDiff / 60;
                        hoursDiff = hoursDiff - 15 * daysDiff;
                        hoursDiff = hoursDiff * 60;
                        if (hoursDiff >= 0 && hoursDiff <= 15) {
                            one++;
                            oneArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 15 && hoursDiff <= 30) {
                            two++;
                            twoArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 30 && hoursDiff <= 45) {
                            three++;
                            threeArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 45 && hoursDiff <= 60) {
                            four++;
                            fourArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 60 && hoursDiff <= 75) {
                            five++;
                            fiveArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 75 && hoursDiff <= 90) {
                            six++;
                            sixArray.push(supervisor[i]);
                        }
                        if (hoursDiff > 90) {
                            seven++;
                            sevenArray.push(supervisor[i]);
                        }
                    }
                }
            } else {
                if (supervisor[i].stage != "submited") {
                    notSubmitted++;
                    notSubmittedArray.push(supervisor[i]);
                }
            }
        }

    };

    return {
        one,
        two,
        three,
        four,
        five,
        six,
        seven,
        notSubmitted,
        oneArray,
        twoArray,
        threeArray,
        fourArray,
        fiveArray,
        sixArray,
        sevenArray,
        notSubmittedArray,
    }
}

export default calTat
