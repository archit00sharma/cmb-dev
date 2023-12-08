import productModel from "@/models/product.model";


class productService {
    public product = productModel;

    // ********************************* PRODUCT **************************

    public async getAllProduct() {
        try {
            return await productModel.find();
        } catch (error) {
            error.code = 401;
            return error
        }
    };
}
export default productService;
