const API_BASE = process.env.API_URL || "http://localhost:4000";

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    return { status: res.status, data: await res.json() };
}

describe("User API", () => {
    const testUsername = `test_user_api_${Date.now()}`;

    test("POST /users creates a new user", async () => {
        const { status, data } = await request("/users", {
            method: "POST",
            body: JSON.stringify({ username: testUsername }),
        });
        expect(status).toBe(201);
        expect(data).toHaveProperty("id");
        expect(data).toHaveProperty("username", testUsername);
    });

    test("POST /users returns 409 if user already exists", async () => {
        // Try creating the same user again
        const { status, data } = await request("/users", {
            method: "POST",
            body: JSON.stringify({ username: testUsername }),
        });
        expect(status).toBe(409);
        expect(data.message).toBe("User already exists");
        expect(data.user).toHaveProperty("username", testUsername);
    });

    test("POST /users validates required fields", async () => {
        const { status, data } = await request("/users", {
            method: "POST",
            body: JSON.stringify({}),
        });
        expect(status).toBe(400);
        expect(data.message).toBe("Username is required");
    });

    test("GET /users returns list of users", async () => {
        const { status, data } = await request("/users");
        expect(status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
        // Verify the user we just created is in the list
        const found = data.find(u => u.username === testUsername);
        expect(found).toBeDefined();
        expect(found).toHaveProperty("id");
    });
});
