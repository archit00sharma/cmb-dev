import areaModel from "@/models/area.model";


class areaService {
    public area = areaModel;

    // ********************************* area **************************

    public async getAllArea() {
        try {
            return await areaModel.find();
        } catch (error) {
            error.code = 401;
            return error
        }
    };
}
export default areaService;
