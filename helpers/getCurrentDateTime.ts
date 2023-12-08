import { Response, Router } from "express";


let getDateTime = () => {
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var currentdate: any = new Date(currentTime.getTime() + (ISTOffset) * 60000);

    return currentdate
}

export default getDateTime