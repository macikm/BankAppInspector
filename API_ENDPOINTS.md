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

### **`POST /api/v1/Messages/ERPMessages/list`**
* **Metoda:** `POST`
* **Účel:** Načtení stránkovaného přehledu zpráv odeslaných z ERP systému.
* **Body:**
  ```json
  {
    "page": 1,
    "pageSize": 100,
    "sort": [],
    "filter": null
  }
  ```

### **`GET /api/v1/Maintenance/GetMessages/{tenantId}/ErpMessage`** *(Fallback)*
* **Metoda:** `GET`
* **Účel:** Zpětné načtení ERP zpráv přes správcovské Maintenance API v případě selhání primárního endpointu.

---

## 📄 3. Žádosti o Výpisy (Statement Messages)

### **`POST /api/v1/Messages/StatementMessages/list`**
* **Metoda:** `POST`
* **Účel:** Načtení seznamu žádostí o bankovní výpisy.
* **Body:**
  ```json
  {
    "page": 1,
    "pageSize": 100,
    "sort": [],
    "filter": null
  }
  ```

### **`GET /api/v1/Maintenance/GetMessages/{tenantId}/StatementMessage`** *(Fallback)*
* **Metoda:** `GET`
* **Účel:** Zpětné načtení výpisů přes Maintenance API.

---

## 🏦 4. Zprávy & Komunikace s Bankou (Bank Messages)

### **`POST /api/v1/Messages/BankMessages/list`**
* **Metoda:** `POST`
* **Účel:** Načtení seznamu odpovědí a zpráv přijatých z banky.
* **Body:**
  ```json
  {
    "page": 1,
    "pageSize": 100,
    "sort": [],
    "filter": null
  }
  ```

### **`GET /api/v1/Maintenance/GetMessages/{tenantId}/BankMessage`** *(Fallback)*
* **Metoda:** `GET`
* **Účel:** Zpětné načtení bankovních zpráv přes Maintenance API.

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

## 📑 6. Detail Požadavku & Souborů (DataService & Maintenance)

### **`GET /api/v1/Utility/GetReqDataFromDS/{id}`**
* **Metoda:** `GET`
* **Účel:** Získání těla požadavku z DataService (tlačítko **Požadavek**).

### **`GET /api/v1/Maintenance/GetStatementReqDataFromDS/{tenantId}/{id}`** *(Fallback 1)*
* **Metoda:** `GET`
* **Účel:** Načtení požadavku z DataService přes Maintenance API v případě chybějících rolí u Utility API (obchází HTTP 403 Forbidden).

### **`GET /api/v1/Maintenance/GetFile/{tenantId}/{fileId}`** *(Fallback 2, Detaily & Kontrola rozsahů datumu)*
* **Metoda:** `GET`
* **Účel:** Načtení surového JSON souboru odpovědi/výpisu (tlačítka **Odpověď**, **Výpis**) a skenování rozsahů `dateFrom <> dateTo` pro vyhodnocení jednodenního (OK 🟢) vs. vícedenního (Upozornění 🔴) výpisu.

---

## 📖 7. Dokumentace (Swagger API)

* **`GET /swagger/index.html`** *(pro vývojové/localhost prostředí)*
* **`GET /api/asoleu/bankapp/swagger`** *(pro produkční prostředí)*
