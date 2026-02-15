export const config = {
    baseUrl: "https://blazedemo.com",
    sleepSeconds: 1,

    // --- STAGES CONFIGURATION ---
    // Uncomment the scenario you want to run. Default is LOAD TEST.

    stages: [
        // --- LOAD TEST (Default) ---
        // Simulates normal traffic to verify system behavior under expected load.
        { target: 10, duration: "1m" }, // Ramp-up to 10 users
        { target: 10, duration: "3m" }, // Stay at 10 users
        { target: 0, duration: "1m" },  // Ramp-down to 0

        // --- STRESS TEST (Uncomment to use) ---
        // Pushes the system beyond normal limits to find the breaking point.
        // { target: 20, duration: "2m" },
        // { target: 20, duration: "5m" },
        // { target: 0, duration: "2m" },

        // --- SPIKE TEST (Uncomment to use) ---
        // Simulates a sudden surge in traffic (e.g., ticket sales opening).
        // { target: 100, duration: "1m" }, // Fast ramp-up
        // { target: 100, duration: "2m" }, // Short burst
        // { target: 0, duration: "1m" },

        // --- SOAK TEST (Uncomment to use) ---
        // Validates reliability over a long period (e.g., checks for memory leaks).
        // { target: 5, duration: "5m" }, // Ramp-up
        // { target: 5, duration: "4h" }, // Long duration
        // { target: 0, duration: "5m" },
    ],

    thresholds: {
        http_req_failed: ["rate<0.01"],
        http_req_duration: ["p(95)<800"],
    },
};
