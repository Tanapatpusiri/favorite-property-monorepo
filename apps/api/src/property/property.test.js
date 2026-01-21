const API_BASE = process.env.API_URL || "http://localhost:4000";

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    return { status: res.status, data: await res.json() };
}

describe("Properties API", () => {
    test("GET /properties returns array of properties", async () => {
        const { status, data } = await request("/properties");
        expect(status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0]).toHaveProperty("id");
        expect(data[0]).toHaveProperty("title");
        expect(data[0]).toHaveProperty("price");
    });

    test("GET /properties/:id returns single property", async () => {
        // First get all properties to get a valid ID
        const { data: allProperties } = await request("/properties");
        const firstProperty = allProperties[0];

        const { status, data } = await request(`/properties/${firstProperty.id}`);
        expect(status).toBe(200);
        expect(data).toHaveProperty("id", firstProperty.id);
        expect(data).toHaveProperty("title");
        expect(data).toHaveProperty("location");
        expect(data).toHaveProperty("price");
        expect(data).toHaveProperty("image");
    });

    test("GET /properties/:id returns 404 for non-existent property", async () => {
        const { status, data } = await request("/properties/non_existent_id");
        expect(status).toBe(404);
        expect(data.message).toBeDefined();
    });
});
