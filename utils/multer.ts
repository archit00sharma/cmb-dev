// global imports
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import aws from 'aws-sdk'
import multerS3 from 'multer-s3'
import config from "config";
import path from "path";


const awsconfig: any = config.get('awsS3')
aws.config.update({
    secretAccessKey: awsconfig.secretAccessKey,
    accessKeyId: awsconfig.accessKeyId,
    region: awsconfig.region
});

const s3 = new aws.S3();

var upload = multer({
    fileFilter: (req: any, file: any, cb: any) => {
        if (req.body.typename == "fieldExecutiveProfilePic") {
            if (
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                req.fileValidationError = "Only .jpg and .jpeg format allowed!";
                return cb(null, false, req.fileValidationError);
            }
        } else if (req.body.typename == "fieldExecutiveDocument") {
            if (
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                req.fileValidationError = "Only .jpg and .jpeg format allowed!";
                return cb(null, false, req.fileValidationError);
            }
        }
    },
    storage: multerS3({
        s3: s3,
        bucket: 'cmb-management',
        key: function (req, file, cb) {
            let s = file.originalname;
            let s1 = s.substring(s.lastIndexOf(".") + 1);
            s1.trim();
            cb(null, `${awsconfig.prefix}${req.body.typename}/${Date.now().toString()}.${s1}`)
        }
    }),

}
);



const storage1 = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, path.join(__dirname, `../public/${req.body.typename}`))
    },
    filename: function (req: any, file: any, cb) {
        let exe = (file.originalname).split(".").pop();
        let filename = `${Date.now()}.${exe}`;
        cb(null, filename)
    }
});
export var upload1 = multer({
    storage: storage1,
    fileFilter: (req: any, file: any, cb: any) => {
        if (req.body.typename == "caseFile") {
            if (
                file.mimetype == "	application/vnd.ms-excel" ||
                file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ) {
                cb(null, true);
            } else {
                req.fileValidationError = "Only excel format allowed!";
                return cb(null, false, req.fileValidationError);
            }
        } else if (req.body.typename == "fieldExecutiveProfilePic") {
            if (
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                req.fileValidationError = "Only .jpg and .jpeg format allowed!";
                return cb(null, false, req.fileValidationError);
            }
        } else if (req.body.typename == "fieldExecutiveDocument") {
            if (
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                req.fileValidationError = "Only .jpg and .jpeg format allowed!";
                return cb(null, false, req.fileValidationError);
            }
        }
    }
}
);



export default upload
