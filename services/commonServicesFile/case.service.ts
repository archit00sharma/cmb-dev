import caseModel from "@/models/case.model";


class caseService {
    public case = caseModel;

    // ********************************* case **************************

    public async getAllCase(cond = {}) {
        try {
            return await caseModel.find(cond).lean();
        } catch (error) {
            error.code = 401;
            return error
        }
    };
}
export default caseService;
