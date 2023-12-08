import { NextFunction, Request, Response } from "express";
import Messages from "../messages"
import Helper from "../utils/helper";



class AjaxController {


    public presigned = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            let x = new Helper
            console.log(req.query)
            let data = {};
            let type: any = req.query.type
            if (!["get", "put"].includes(type)) {
                return Messages.Failed.SOMETHING_WENT_WRONG = "incorrect_type"
                // throw new HttpException(409, MSG.INCORRECT_TYPE);
            }
            switch (req.query.type) {
                case "get":
                    Object.assign(data, {
                        url: await x.getSignedUrlAWS(req.query.path),
                    });
                    break;
                case "put":
                    Object.assign(data, {
                        url: await x.putSignedUrlAWS(req.query.path),
                    });
                    break;
                default:
                    return Messages.Failed.SOMETHING_WENT_WRONG
                // throw new HttpException(409, MSG.FIELDS_MISSING);
            }

            console.log('this is', data)

            res.status(200).json({
                data: data,
                message: "success",
            });
        } catch (error) {
            console.log('error', error)
            next(error);
        }
    };

}

export default AjaxController;
