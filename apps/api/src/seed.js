const prisma = require("./lib/prisma");

const properties = [
    {
        externalId: "p1",
        title: "Luxury Villa",
        location: "Bangkok",
        price: 5000000,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
    },
    {
        externalId: "p2",
        title: "Modern Condo",
        location: "Phuket",
        price: 3500000,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    },
    {
        externalId: "p3",
        title: "Beach House",
        location: "Pattaya",
        price: 8000000,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    },
    {
        externalId: "p4",
        title: "City Apartment",
        location: "Chiang Mai",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    },
    {
        externalId: "p5",
        title: "Garden Home",
        location: "Hua Hin",
        price: 6500000,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
    },
    {
        externalId: "p6",
        title: "Penthouse Suite",
        location: "Bangkok",
        price: 12000000,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    }
];

async function seed() {
    console.log("Seeding database...");

    try {
        await prisma.$connect();

        for (const property of properties) {
            await prisma.property.upsert({
                where: { externalId: property.externalId },
                update: property,
                create: property
            });
            console.log(`Upserted property: ${property.title}`);
        }

        console.log("Seeding complete!");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
