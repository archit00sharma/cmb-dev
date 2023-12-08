

export const validator = async (req, res, redirect, ajax = false) => {
    try {
        switch (ajax) {
            case true:
                if (req.joiError) {
                    res.send({ err: req.joiError })
                }
                break;
            case false:
                if (req.joiError) {
                    req.flash('error', req.joiError)
                    res.redirect(redirect)
                }
                break;
            default:
                break;
        }

        return true
    } catch (error) {
        throw (error)
    }

}