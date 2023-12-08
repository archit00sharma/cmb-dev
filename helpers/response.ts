import { Response, Router } from "express";


let errorResponseUnauth = (res: any, error: any, message: any, status: any) => {
   
    res.status(status).json({
        success: false,
        status,
        message,
        error,
    });
}

export default errorResponseUnauth