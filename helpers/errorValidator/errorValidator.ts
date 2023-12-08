

export const validator = async (req, res, redirect, ajax = false) => {
    try {
        if (req.joiError) {
            if (ajax) {
                await res.send({ err: req.joiError });
            } else {
                req.flash('error', req.joiError);
                await res.redirect(redirect);
            }
            return false; // Validation failed
        }
        return true; // Validation passed
    } catch (error) {
        throw (error)
    }

}