const prisma = require("../lib/prisma");

// Helper: Get or create user by username
const getOrCreateUser = async (username) => {
    let user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        user = await prisma.user.create({ data: { username } });
    }
    return user;
};

const getFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await prisma.user.findUnique({
            where: { username: userId },
            include: {
                favorites: {
                    include: { property: true },
                },
            },
        });

        if (!user) {
            return res.json([]);
        }

        res.json(user.favorites.map((f) => f.property.externalId));
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: "Failed to fetch favorites" });
    }
};

const addFavorite = async (req, res) => {
    try {
        const { userId, propertyId } = req.body;
        // Validation is handled by middleware but we need the values

        const user = await getOrCreateUser(userId);
        const property = await prisma.property.findUnique({
            where: { externalId: propertyId },
        });

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        await prisma.favorite.upsert({
            where: {
                userId_propertyId: {
                    userId: user.id,
                    propertyId: property.id,
                },
            },
            update: {},
            create: {
                userId: user.id,
                propertyId: property.id,
            },
        });

        const updatedFavorites = await prisma.favorite.findMany({
            where: { userId: user.id },
            include: { property: true },
        });

        res.json(updatedFavorites.map((f) => f.property.externalId));
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ message: "Failed to add favorite" });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { userId, propertyId } = req.body;

        const user = await prisma.user.findUnique({ where: { username: userId } });
        const property = await prisma.property.findUnique({
            where: { externalId: propertyId },
        });

        if (user && property) {
            await prisma.favorite.deleteMany({
                where: {
                    userId: user.id,
                    propertyId: property.id,
                },
            });
        }

        const updatedFavorites = user
            ? await prisma.favorite.findMany({
                where: { userId: user.id },
                include: { property: true },
            })
            : [];

        res.json(updatedFavorites.map((f) => f.property.externalId));
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ message: "Failed to remove favorite" });
    }
};

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
};
