const API_BASE = process.env.API_URL || "http://localhost:4000";

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    return { status: res.status, data: await res.json() };
}

describe("Favorites API", () => {
    const testUserId = `test_user_${Date.now()}`;

    test("GET /favorites/:userId returns empty array for new user", async () => {
        const { status, data } = await request(`/favorites/${testUserId}`);
        expect(status).toBe(200);
        expect(data).toEqual([]);
    });

    test("POST /favorites adds a favorite", async () => {
        const { status, data } = await request("/favorites", {
            method: "POST",
            body: JSON.stringify({ userId: testUserId, propertyId: "p1" }),
        });
        expect(status).toBe(200);
        expect(data).toContain("p1");
    });

    test("GET /favorites/:userId returns saved favorites", async () => {
        const { status, data } = await request(`/favorites/${testUserId}`);
        expect(status).toBe(200);
        expect(data).toContain("p1");
    });

    test("DELETE /favorites removes a favorite", async () => {
        const { status, data } = await request("/favorites", {
            method: "DELETE",
            body: JSON.stringify({ userId: testUserId, propertyId: "p1" }),
        });
        expect(status).toBe(200);
        expect(data).not.toContain("p1");
    });

    test("POST /favorites validates required fields", async () => {
        const { status, data } = await request("/favorites", {
            method: "POST",
            body: JSON.stringify({}),
        });
        expect(status).toBe(400);
        expect(data.message).toBeDefined();
    });
});
