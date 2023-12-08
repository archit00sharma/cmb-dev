// Global imports

import JWT from "jsonwebtoken"

/**
 * 
 * @function sign
 * @description authentication token generation
 * @parameters key
 * @author Archit Sharma
 */
 let sign = async (key: any) => {
    try {
        let SECRET_TOKEN = "6229d687MYNASIF4dc56229dHSDFFFBAbfdc543ca821de5b6543BDFSUDca821de5b52"
        let EXPIRE_TIME = 30 * 24 * 60 * 60
        
        const token = JWT.sign(key, SECRET_TOKEN, { expiresIn: EXPIRE_TIME });
        
        return token;
    } catch (e) {
        throw e;
    }
}
export default sign