# BlazeDemo Load Testing - Live Workshop Demo

Live demo per il **Workshop di Test Automation e Performance Testing** con k6.

Questo progetto dimostra come implementare un **test E2E realistico** per un'applicazione web, con:
- ✅ Automazione di workflow completi (prenotazione voli)
- ✅ Load testing e stress testing
- ✅ Correlazione dinamica di dati dalle risposte
- ✅ Gestione configurazione via environment
- ✅ Reporting personalizzato con summaryHelper

---

## 📋 Struttura del Progetto

```
live-demo/
├── Config/
│   └── env.json              # Configurazione (baseUrl, stages, thresholds)
│
├── Data/
│   ├── users.json            # Test users con dati di pagamento
│   └── routes.json           # Route aeree da testare
│
├── Scripts/
│   ├── blaze-custom.js       # Script di test principale (ottimizzato)
│   └── blaze.js              # Script generato da k6 Studio (reference)
│
├── Helpers/
│   └── summaryHelper.js      # Helper per generare report JSON personalizzati
│
├── Output/
│   └── Summary/              # Dove vengono salvati i report
│
└── README.md                 # Questo file
```

---

## 🎯 Come Funziona

Lo script `blaze-custom.js` simula un **user journey completo**:

1. **GET /** → Visita home page
2. **POST /reserve.php** → Seleziona una rotta aerea
3. **Estrazione dinamica** → Recupera l'ID del volo dalla risposta HTML
4. **POST /purchase.php** → Completa l'acquisto con dati utente
5. **POST /confirmation.php** → Conferma la prenotazione
6. **Sleep** → Pausa configurabile tra iterazioni

### Configurazione di Load

Nel file `Config/env.json`:

```json
"stages": [
  { "target": 10, "duration": "1m" },     // Ramp-up: 0→10 VU in 1 min
  { "target": 10, "duration": "3m" },     // Plateau: 10 VU per 3 min
  { "target": 0, "duration": "1m" }       // Ramp-down: 10→0 VU in 1 min
]
```

---

## 🚀 Guida Rapida

### Requisiti

- **k6** (v0.40+)
- **Node.js** (opzionale, solo se usi altri script)
- **Windows/Mac/Linux**

### Installazione

#### Windows (PowerShell)

```powershell
# Installa k6 via Chocolatey
choco install k6

# Verifica l'installazione
k6 version
```

#### macOS

```bash
brew install k6
k6 version
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Avviare i Test

#### Basic run (1 VU, 1 iterazione)

```powershell
cd .\Scripts\
k6 run blaze-custom.js
```

#### Full load test (con config da env.json)

```powershell
cd .\Scripts\
k6 run blaze-custom.js --summary-trend-stats="med,p(95),p(99)"
```

#### Con environment override

```powershell
k6 run blaze-custom.js `
  --env BASE_URL=https://blazedemo.com `
  --env SLEEP_S=2 `
  --env P95_MS=1000
```

#### Con output verbose

```powershell
k6 run blaze-custom.js -v --summary-trend-stats="med,p(95),p(99)"
```

---

## 📊 Output e Reporting

### Report Standard (su console)

k6 mostra automaticamente:
- Metriche HTTP (durata, errori, rate)
- Metriche di gruppo (blazedemo_e2e_http)
- Controlli passati/falliti (checks)
- Threshold violations

### Report Personalizzato (JSON)

Il file `Helpers/summaryHelper.js` genera automaticamente:

```
Output/Summary/summary_DDMMYY_HH_SS.json
```

Contiene: `http_reqs`, `http_req_duration`, `http_req_failed`, ecc. in formato JSON formattato.

---

## 🔧 Parametri Configurabili

Puoi controllare il test via variabili d'ambiente:

| Variabile | Default | Descrizione |
|-----------|---------|-------------|
| `BASE_URL` | https://blazedemo.com | URL dell'app |
| `SLEEP_S` | 1 (da env.json) | Pausa tra iterazioni (secondi) |
| `P95_MS` | null | P95 threshold (es: 800 ms). Se valorizzato, fail se p(95) > valore |

### Esempio: Test Performance con Threshold

```powershell
k6 run blaze-custom.js --env P95_MS=800
# Fallisce se p(95) della durata richiesta > 800ms
```

---

## 📈 Metriche Chiave

- **http_req_duration** → Tempo di risposta HTTP
- **http_req_failed** → % richieste fallite (target: <1%)
- **checks** → Validazioni custom (GET / status 200, flight id extracted, ecc.)
- **data_received/sent** → Banda utilizzata

---

## 💡 Tips & Tricks

### Debugare un test fallito

```powershell
# Esegui con una sola VU e vedi lo stack trace completo
k6 run blaze-custom.js -u 1 -i 1 -v
```

### Testare solo una richiesta specifica

Commenta le altre richieste in `blaze-custom.js` durante il debug.

### Check il corpo della risposta

```javascript
console.log(res.body);  // Stampa la risposta nella console k6
```

---

## 📞 Info Extra

- **App di test**: https://blazedemo.com (public demo)
- **k6 Docs**: https://k6.io/docs/
- **Community**: https://community.k6.io/

---

**Buon testing! 🚀**
