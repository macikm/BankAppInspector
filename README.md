# BankApp Inspector

**BankApp Inspector** je moderní webový nástroj pro sledování, inspekci a monitoring výpisů, bankovních zpráv, ERP požadavků a dávkových příkazů v systému BankApp.

## 🚀 Vlastnosti

- **ERP Požadavky (ERP Messages):** Přehled odeslaných a zpracovaných zpráv z ERP.
- **Žádosti o výpisy (Statement Messages):** Monitoring požadavků na výpisy a detekce vícedenních rozsahů.
- **Zprávy a komunikace s bankou (Bank Messages):** Detailní výpis komunikace a odpovědí z banky.
- **Seznam dávkových příkazů (Payments API):** Správa a přehled platbových příkazů.
- **Raw Logy & API Konzola:** Integrovaná konzola pro sledování API požadavků v reálném čase.
- **Vícedenní výpisy (Upozornění):** Automatická indikace `dateFrom <> dateTo` u výpisů (blikající červená ikona s popisem rozsahu vs. zelená fajfka).
- **Flexibilní UI:** 
  - Tmavý a světlý režim
  - Plynulé zvětšování velikosti mřížek (drag & drop za spodní roh)
  - Rychlé mazání vyhledávání pomocí tlačítka `✖`
  - Zavírání dialogů klávesou `ESC` nebo kliknutím mimo okno
  - Globální filtr období a per-section stránkování

## 💻 Spuštění

### 1. V Docker kontejneru (doporučeno pro server)
```bash
# 1. Příprava .env souboru
cp .env.example .env

# 2. Sestavení a spuštění
docker compose up -d --build
```
Aplikace bude dostupná na portu `8087` (lze změnit v `.env` parametrem `HOST_PORT`).

### 2. Lokálně bez Dockeru
Otevřete soubor `BankAppInspector.html` v jakémkoliv moderním prohlížeči.
