

export const validator = async (req, res, redirect, ajax = false) => {
    try {
        switch (ajax) {
            case true:
                await res.send({ err: req.joiError });
                break;
            case false:
                await req.flash('error', req.joiError);
                await res.redirect(redirect);
                break;
            default:
                break;
        }
    } catch (error) {
        throw (error)
    }

}