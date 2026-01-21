const prisma = require("../lib/prisma");

const getAll = async (req, res) => {
    try {
        const properties = await prisma.property.findMany();
        res.json(
            properties.map((p) => ({
                id: p.externalId,
                title: p.title,
                location: p.location,
                price: p.price,
                image: p.image,
            }))
        );
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Failed to fetch properties" });
    }
};

const getProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await prisma.property.findUnique({
            where: { externalId: id },
        });

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json({
            id: property.externalId,
            title: property.title,
            location: property.location,
            price: property.price,
            image: property.image,
        });
    } catch (error) {
        console.error("Error fetching property:", error);
        res.status(500).json({ message: "Failed to fetch property" });
    }
};

module.exports = {
    getAll,
    getProperty,
};
