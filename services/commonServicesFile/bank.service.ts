import bankModel from "@/models/bank.model";


class bankService {
    public bank = bankModel;

    // ********************************* bank **************************

    public async getAllBank() {
        try {
            return await bankModel.find();
        } catch (error) {
            error.code = 401;
            return error
        }
    };
}
export default bankService;
