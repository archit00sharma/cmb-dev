// import { Response, Router } from "express";
// import Messages from "messages"


// export default function getErrorMessage(errorObj) {

//     var errorMsg: any = { message: "", code: 410 };
//     if (errorObj && errorObj.name == "ValidationError") {
//         for (let field in errorObj.errors) {
//             errorMsg += errorObj.errors[field].message + " ";
//         }
//     }
//     if (errorObj && errorObj.name == "CastError") {
//         errorMsg += errorObj.reason;
//     }
//     if (errorObj && errorObj.name == "MongoServerError") {
//         // console.log("errorObj>>>>>>>>>>>>>>>>>>>>>>....", errorObj, "errorObj.name>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.", errorObj.name)
//         if (errorObj.code == 401) {
//             if (errorObj.errmsg.includes("dup key")) {
//                 errorMsg.message += "area ,product and bank already assigned";
//             } else if (errorObj.errmsg.includes("username_1")) {
//                 errorMsg += "Username is already exist";
//             } else if (errorObj.errmsg.includes("email_1")) {
//                 errorMsg += Messages.EMAIL_EXISTS;
//             } else if (errorObj.errmsg.includes("phone_1")) {
//                 errorMsg += Messages.MOBILE_EXISTS;
//             } else if (errorObj.errmsg.includes("referralCode_1")) {
//                 errorMsg += Messages.REFERRAL_CODE_EXISTS;
//             } else if (errorObj.errmsg.includes("code_1")) {
//                 errorMsg += Messages.PROMO_CODE_EXISTS;
//             } else {
//                 errorMsg += errorObj.errmsg;
//             }
//         } else {
//             errorMsg += errorObj.errmsg;
//         }
//     }
//     if (errorMsg == "") {
//         errorMsg += errorObj.toString();
//     }
//     return errorMsg;
// }