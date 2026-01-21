const validateFavorite = (req, res, next) => {
    const { userId, propertyId } = req.body;
    if (!userId || !propertyId) {
        return res.status(400).json({ message: "Missing userId or propertyId" });
    }
    next();
};

module.exports = {
    validateFavorite,
};
