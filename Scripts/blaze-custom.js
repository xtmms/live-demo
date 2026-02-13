import { group, sleep, check } from "k6";
import http from "k6/http";
import { SharedArray } from "k6/data";
import { customSummary } from "../Helpers/summaryHelper.js";

// ---------- LOAD CONFIG / DATA ----------
const envCfg = JSON.parse(open("../config/env.json"));

const users = new SharedArray("users", () => JSON.parse(open("../data/users.json")));
const routes = new SharedArray("routes", () => JSON.parse(open("../data/routes.json")));

// ---------- ENV OVERRIDES ----------
const BASE_URL = __ENV.BASE_URL || envCfg.baseUrl;
const SLEEP_S = Number(__ENV.SLEEP_S || envCfg.sleepSeconds || 0);

// Threshold demo pass/fail controllabile da CI
const P95_MS = Number(__ENV.P95_MS || null);

// ---------- OPTIONS ----------
export const options = {
  stages: envCfg.stages,
  thresholds: {
    ...(envCfg.thresholds || {}),
    ...(P95_MS ? { http_req_duration: [`p(95)<${P95_MS}`] } : {}),
  },
};

// ---------- HELPERS ----------
function pickFromArray(arr) {
  // distribuisce in modo deterministico tra VU/iterazione
  return arr[(__VU + __ITER) % arr.length];
}

function formBody(obj) {
  // BlazeDemo si aspetta x-www-form-urlencoded
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
}

export function handleSummary(data) {
  return customSummary(data);
}


// Header essenziali
const BASE_HEADERS = {
  "content-type": "application/x-www-form-urlencoded",
  "user-agent": "k6",
};

export default function () {
  const route = pickFromArray(routes);
  const user = pickFromArray(users);

  group("blazedemo_e2e_http", () => {

    // 1) Home
    let res = http.get(`${BASE_URL}/`);
    check(res, { "GET / status 200": (r) => r.status === 200 });

    // 2) Reserve (POST) - select route
    res = http.post(`${BASE_URL}/reserve.php`, formBody(route), { headers: BASE_HEADERS });
    check(res, { "POST /reserve status 200": (r) => r.status === 200 });

    // 3) Correlation: estrarre flight/price/airline dalla pagina HTML di selezione volo, 
    const flight = res.html().find("tr td input.btn").first().attr("value"); // value del bottone "Choose This Flight"
    check(flight, {
      "flight id extracted": (f) => f !== undefined && f !== null,
    });

    // 4) Purchase (POST)
    res = http.post(`${BASE_URL}/purchase.php`, formBody(user), { headers: BASE_HEADERS });
    check(res, { "POST /purchase status 200": (r) => r.status === 200 });

    // 5) Confirmation (POST) - form compilation con dati utente
    res = http.post(`${BASE_URL}/confirmation.php`, formBody({ _token: "", ...user }), {
      headers: BASE_HEADERS,
    });

    check(res, {
      "POST /confirmation status 200": (r) => r.status === 200,
      "confirmation contains Thank you": (r) => r.body.includes("Thank you"),
    });
  });

  sleep(SLEEP_S);
}
