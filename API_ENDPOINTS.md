# 📡 Přehled API Endpointů – BankApp Inspector

Dokumentace všech backendových API endpointů, které aplikace **BankApp Inspector** využívá pro autentikaci, výpis dat, stahování payloadů a kontrolu rozsahů.

---

## 📌 Společné HTTP Hlavičky (Headers)

Všechny níže uvedené API požadavky (mimo přihlášení) posílají tyto standardní hlavičky:

| Název hlavičky | Popis / Hodnota |
| :--- | :--- |
| `Authorization` | `Bearer <access_token>` |
| `X-Tenant` | `<tenant_id>` (např. `ICEnergo-498e5a27-...`) |
| `Content-Type` | `application/json` |

---

## 🔑 1. Autentikace & Přihlašování (IDP - Identity Provider)

### **`POST /api/asol/idp/connect/token`**
* **Metoda:** `POST`
* **Content-Type:** `application/x-www-form-urlencoded`
* **Hlavička:** `X-Tenant: <tenant_id>`
* **Body:**
  ```urlencoded
  grant_type=password&username=<user>&password=<pass>&client_id=plaza-pass
  ```
* **Účel:** Načtení OAuth 2.0 Bearer tokenu pro zvolené prostředí a uživatele.

---

## 📦 2. ERP Požadavky & Zprávy (ERP Messages)

### **`GET /api/v1/Maintenance/GetMessages/{tenantId}/ErpMessage?page={page}&pageSize={pageSize}`**
* **Metoda:** `GET`
* **Účel:** Načtení přehledu ERP zpráv přes Maintenance API (obchází HTTP 403 u nevlastnických účtů).

---

## 📄 3. Žádosti o Výpisy (Statement Messages)

### **`GET /api/v1/Maintenance/GetMessages/{tenantId}/StatementMessage?page={page}&pageSize={pageSize}`**
* **Metoda:** `GET`
* **Účel:** Načtení výpisů výhradně přes Maintenance API.

---

## 🏦 4. Zprávy & Komunikace s Bankou (Bank Messages)

### **`GET /api/v1/Maintenance/GetMessages/{tenantId}/BankMessage?page={page}&pageSize={pageSize}`**
* **Metoda:** `GET`
* **Účel:** Načtení zpráv a odpovědí banky výhradně přes Maintenance API.

---

## 💸 5. Dávkové Příkazy (Payments API)

### **`POST /api/v1/Payments/list`**
* **Metoda:** `POST`
* **Účel:** Načtení seznamu platbových příkazů.
* **Body:**
  ```json
  {
    "page": 1,
    "pageSize": 100,
    "sort": [],
    "filter": null
  }
  ```

---

## 📑 6. Detail Požadavku & Souborů (Maintenance & DataService)

### **`GET /api/v1/Maintenance/GetStatementReqDataFromDS/{tenantId}/{id}`**
* **Metoda:** `GET`
* **Účel:** Získání těla požadavku z DataService přes Maintenance API (tlačítko **Požadavek**).

### **`GET /api/v1/Maintenance/GetFile/{tenantId}/{fileId}`**
* **Metoda:** `GET`
* **Účel:** Načtení surového JSON souboru odpovědi/výpisu (tlačítka **Odpověď**, **Výpis**) a skenování rozsahů `dateFrom <> dateTo` pro vyhodnocení jednodenního (OK 🟢) vs. vícedenního (Upozornění 🔴) výpisu.

---

## 📖 7. Dokumentace (Swagger API)

* **`GET /swagger/index.html`** *(pro vývojové/localhost prostředí)*
* **`GET /api/asoleu/bankapp/swagger`** *(pro produkční prostředí)*
