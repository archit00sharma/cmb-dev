import { NextFunction, Request, Response } from "express";
import config from "config";

class IndexController {
    public index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).send(`<center>${config.get(
                "siteTitle"
            )} ${config.get("env")}
            REST API Server is running. 
            <br />
            <a href="/api-docs">Explorer</a>  API documentation</center>`);
        } catch (error) {
            next(error);
        }
    };


    public getConfigs = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            let data = {};
            switch (req.params.type) {
                case "s3":
                    Object.assign(data, { s3: await config.get("awsS3") });
                    break;
                case "perPageRecord":
                    Object.assign(data, {
                        perPageRecord: await config.get("recordLimit"),
                    });
                    break;
                default:
                    break;
            }
            res.status(200).json({
                data: data,
                message: "fetch success",
            });
        } catch (error) {
            next(error);
        }
    };



    

    
}

export default IndexController;
