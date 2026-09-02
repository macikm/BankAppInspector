# 📡 Přehled API Endpointů – BankApp Inspector

Dokumentace všech backendových API endpointů, které webová aplikace **BankApp Inspector** reálně využívá pro autentikaci, načítání tenantů, přehledy zpráv, stahování payloadů, kontrolu rozsahů a propojení entit.

---

## 🌐 Základní URL & Směrování (Base URLs)

Aplikace podporuje přepínání cílových prostředí v konfiguračním dialogu:

| Prostředí | Base URL API BankApp | Identity Provider (IDP) Base URL |
| :--- | :--- | :--- |
| **Produkce / Stage** | `https://avaplace.com/api/asoleu/bankapp` | `https://avaplace.com/api/asol/idp` |
| **Alpha / Beta / Dev / Neo** | `https://{env}.avaplace.com/api/asoleu/bankapp` | `https://{env}.avaplace.com/api/asol/idp` |
| **Lokální vývoj (Localhost)** | `http://localhost:50131` | `https://dev.avaplace.com/api/asol/idp` |

---

## 📌 Společné HTTP Hlavičky (Headers)

Všechny API požadavky směřující na BankApp backend a IDP (mimo samotné získání tokenu) posílají tyto standardní hlavičky:

| Název hlavičky | Popis / Hodnota |
| :--- | :--- |
| `Authorization` | `Bearer <access_token>` |
| `X-Tenant` | `<tenant_id>` (např. `ICEnergo-498e5a27-3e95-4ff3-88fd-357e0a9450aa`) |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

---

## 🔑 1. Autentikace & Správa Tenantů (IDP - Identity Provider)

### **A. Získání OAuth 2.0 Bearer Tokenu**
* **Endpoint:** `POST /api/asol/idp/connect/token`
* **Metoda:** `POST`
* **Content-Type:** `application/x-www-form-urlencoded`
* **Hlavička:** `X-Tenant: <tenant_id>`
* **Parametry v těle (Body):**
  ```urlencoded
  grant_type=password&username=<user>&password=<pass>&client_id=plaza-pass
  ```
  *(Volitelně lze předat i `client_secret`)*
* **Účel:** Získání OAuth 2.0 JWT tokenu pro zvoleného uživatele a tenanta. Token je v aplikaci automaticky kontrolován na expiraci a v případě potřeby obnoven.

---

### **B. Automatická detekce a načtení seznamu tenantů (Discovery)**
Inspektor po přihlášení dynamicky načte seznam všech tenantů, ke kterým má přihlášený uživatel přístup, a naplní jimi vyhledávací dropdown v horní liště.

* **1. Primární seznam tenantů uživatele:**
  * **Endpoint:** `GET /api/asol/idp/api/v1/UserTenants?Limit={limit}&Offset={offset}`
* **2. Seznam podřízených tenantů:**
  * **Endpoint:** `GET /api/asol/idp/api/v1/Tenants/childTenants?Limit={limit}&Offset={offset}`
* **3. Fallback seznam tenantů:**
  * **Endpoint:** `GET /api/asol/idp/api/v1/Tenants?Limit={limit}&Offset={offset}`
* **Parametry dotazu (Query):**
  * `Limit`: Počet záznamů na dávku (např. `1000`)
  * `Offset`: Posun pro postupné stránkování (`0`, `1000`, ...)

---

## 📦 2. ERP Požadavky & Zprávy (ERP Messages)

Zobrazuje přehled platebních i výpisových požadavků přijatých z ERP systému.

### **`GET /api/v1/Maintenance/GetMessages/{tenantId}/ErpMessage`**
* **Metoda:** `GET`
* **Parametry v cestě (Path):**
  * `{tenantId}`: ID zvoleného tenanta
* **Parametry dotazu (Query):**
  * `Offset`: Posun záznamů (např. `0`, `100`, `200`)
  * `Limit`: Počet záznamů na stránku (`100`, `250`, `500`, `1000`)
  * `page`: Číslo stránky (1-indexed)
  * `pageSize`: Velikost stránky
  * `from`: *(Volitelné)* Filtr počátečního data ve formátu `YYYY-MM-DD`
  * `to`: *(Volitelné)* Filtr koncového data ve formátu `YYYY-MM-DDTHH:mm:ss`
* **Příklad volání:**
  ```http
  GET /api/v1/Maintenance/GetMessages/ICEnergo-498e5a27-.../ErpMessage?Offset=0&Limit=100&page=1&pageSize=100&from=2026-09-01&to=2026-09-02T23:59:59
  ```
* **Účel:** Načtení historie příchozích zpráv z ERP přes Maintenance API (obchází HTTP 403 u nevlastnických a servisních účtů).

---

## 📄 3. Žádosti o Výpisy (Statement Messages)

Zobrazuje požadavky na stažení bankovních výpisů včetně počtu stažených výpisů a vazebních klíčů.

### **`GET /api/v1/Maintenance/GetMessages/{tenantId}/StatementMessage`**
* **Metoda:** `GET`
* **Parametry v cestě (Path):** `{tenantId}`
* **Parametry dotazu (Query):** Shodné jako u `ErpMessage` (`Offset`, `Limit`, `page`, `pageSize`, `from`, `to`).
* **Účel:** Načtení přehledu výpisových zpráv, počtu výpisů (`numberOfStatements`), vazebního identifikátoru `statementJsonFileReferenceId` a `requestReferenceId`.

---

## 🏦 4. Zprávy & Komunikace s Bankou (Bank Messages)

Zobrazuje komunikaci a odpovědi z bankovních komunikačních modulů / konektorů.

### **`GET /api/v1/Maintenance/GetMessages/{tenantId}/BankMessage`**
* **Metoda:** `GET`
* **Parametry v cestě (Path):** `{tenantId}`
* **Parametry dotazu (Query):** Shodné jako u `ErpMessage` (`Offset`, `Limit`, `page`, `pageSize`, `from`, `to`).
* **Účel:** Načtení odpovědí a zpráv banky výhradně přes Maintenance API včetně vazby na `responseJsonId` a `requestReferenceId`.

---

## 📑 5. Detail Požadavku, Surové Soubory & Kontrola Rozsahů

### **A. Načtení těla požadavku z DataService (tlačítko „Požadavek“)**
Inspektor při kliknutí na tlačítko **Požadavek** provádí automatickou kaskádu volání:

1. **Primární endpoint (Maintenance API):**
   * **`GET /api/v1/Maintenance/GetStatementReqDataFromDS/{tenantId}/{id}`**
   * *Parametry:* `{tenantId}` = ID tenanta, `{id}` = kód požadavku / `requestReferenceId`
2. **1. Fallback endpoint (Maintenance File API):**
   * **`GET /api/v1/Maintenance/GetFile/{tenantId}/{id}`**
3. **2. Fallback endpoint (Utility API):**
   * **`GET /api/v1/Utility/GetReqDataFromDS/{id}`**

---

### **B. Načtení surového JSON souboru výpisu / odpovědi (tlačítka „Výpis“, „Odpověď“)**
* **Endpoint:** `GET /api/v1/Maintenance/GetFile/{tenantId}/{fileId}`
* **Metoda:** `GET`
* **Parametry v cestě (Path):**
  * `{tenantId}`: ID tenanta
  * `{fileId}`: Identifikátor souboru (`statementJsonFileReferenceId` nebo `responseJsonId`)
* **Využití v aplikaci:**
  1. **Zobrazení detailu:** Zobrazení zformátovaného a obarveného JSON v modálním okně.
  2. **Asynchronní detekce rozsahů výpisů (Date Range Scanner):** Inspektor na pozadí stahuje hlavičky výpisů a porovnává hodnoty `dateFrom` vs. `dateTo`.
     * 🟢 **Jednodenní výpis (`dateFrom == dateTo`):** Zobrazí zelenou fajfku s datem.
     * 🔴 **Vícedenní rozsah (`dateFrom <> dateTo`):** Zobrazí pulzující varovnou ikonu s přesným rozsahem (např. `01.09.2026 – 02.09.2026`).

---

## 💸 6. Dávkové Příkazy (Payments API)

* **Endpointy:**
  * `GET /api/v1/Payments/list`
  * `GET /api/v1/Payments/list/open`
* **Stav v aplikaci:** Volání těchto endpointů je v Inspektoru **vypnuto / vynecháno**. Důvodem je, že tyto endpointy vyžadují speciální oprávnění `RestAPI-PaymentsController-GetAllPayments` a pro nevlastnické / běžné servisní účty vracejí `HTTP 403 Forbidden`. Přehled platebních dávek z ERP je plnohodnotně dostupný přes záložku **ERP Požadavky** (`ErpMessage`).

---

## 📖 7. Dokumentace (Swagger API)

* **Produkční / Vzdálená prostředí:** `GET /api/asoleu/bankapp/swagger`
* **Lokální vývojové prostředí:** `GET /swagger/index.html`
