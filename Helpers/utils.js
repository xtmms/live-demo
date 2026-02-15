export function pickFromArray(arr) {
    // distribuisce in modo deterministico tra VU/iterazione
    // Nota: __VU e __ITER sono variabili globali disponibili nel contesto di esecuzione di k6
    return arr[(__VU + __ITER) % arr.length];
}

export function formBody(obj) {
    // BlazeDemo si aspetta x-www-form-urlencoded
    return Object.entries(obj)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&");
}
