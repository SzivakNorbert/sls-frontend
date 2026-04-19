# SLS Frontend – Szállítmányozó Rendszer

Angular 18 alapú frontend a szállítmányozó rendszerhez.

## Követelmények

- Node.js 18+
- Angular CLI 18: `npm install -g @angular/cli`
- Futó backend: alapértelmezés szerint `http://localhost:8080/api`

## Indítás fejlesztői módban

```bash
npm install
npm start        # http://localhost:4200 megnyitása automatikus
```

## Build

```bash
npm run build          # fejlesztői build
npm run build:prod     # production build (fileReplacements aktív)
```

## Környezeti változók

| Fájl | Érték | Mikor használatos |
|------|-------|-------------------|
| `src/environments/environment.ts` | `apiUrl: 'http://localhost:8080/api'` | `ng serve` / dev build |
| `src/environments/environment.prod.ts` | `apiUrl: 'http://localhost:8080/api'` | production build – **ezt kell módosítani deploy előtt** |

> Production API URL megadása: `src/environments/environment.prod.ts` fájlban írd át az `apiUrl` értéket.

## CORS

A backend `http://localhost:8080`-on fut. Fejlesztői szerveren a böngésző CORS-kérést küld.
A backendnek engedélyeznie kell az `http://localhost:4200` origint.  
Proxy használata (opcionális): hozz létre `proxy.conf.json` fájlt és add meg a `serve` konfigurációban.

## Autentikáció

- `POST /api/auth/login` → JWT token, lejárat: `expiresIn` másodpercben
- A token `localStorage`-ba kerül, minden API-kéréshez `Authorization: Bearer <token>` header adódik hozzá
- Lejárt token esetén automatikus kijelentkezés
- Szerepkörök: `ADMIN`, `COURIER`

### Teszt felhasználók (ha a backend demo adatokkal van feltöltve)

| Szerepkör | Email | Jelszó |
|-----------|-------|--------|
| Admin | admin@sls.com | admin123 |
| Futár | courier@sls.com | courier123 |

## Fő oldalak és üzleti folyamatok

| Route | Szerepkör | Leírás |
|-------|-----------|--------|
| `/login` | Mindenki | Bejelentkezés |
| `/dashboard` | ADMIN, COURIER | Összefoglaló statisztikák |
| `/packages` | ADMIN, COURIER | Csomaglista szűrőkkel |
| `/packages/create` | ADMIN | Új csomag létrehozása |
| `/packages/assign` | ADMIN | Csomag futárhoz rendelése (kézbesítés indítás) |
| `/packages/tracking` | ADMIN, COURIER | Csomag nyomkövetése tracking szám alapján |
| `/packages/:id` | ADMIN, COURIER | Csomag részletei |
| `/couriers` | ADMIN | Futárlista |
| `/couriers/create` | ADMIN | Új futárprofil létrehozása |
| `/couriers/:id` | ADMIN | Futár részletei, statisztikák |
| `/deliveries` | ADMIN | Összes kézbesítés listája |
| `/deliveries/:id` | ADMIN | Kézbesítés részletei |
| `/deliveries/my-deliveries` | COURIER | Saját kézbesítések + státuszfrissítés |

### Státusz-átmenetek (csomag / kézbesítés)

```
CREATED → (assign) → ASSIGNED
ASSIGNED → IN_TRANSIT → DELIVERED
                      → FAILED
```

## API végpontok összefoglalója

| Metódus | Végpont | Leírás |
|---------|---------|--------|
| POST | `/api/auth/login` | Bejelentkezés |
| GET | `/api/packages` | Összes csomag |
| POST | `/api/packages` | Új csomag |
| GET | `/api/packages/:id` | Csomag részletei |
| GET | `/api/packages/tracking/:trackingNumber` | Nyomkövetés |
| POST | `/api/packages/assign` | Futár hozzárendelése |
| GET | `/api/couriers` | Összes futár |
| POST | `/api/couriers` | Új futár |
| GET | `/api/couriers/:id` | Futár részletei |
| GET | `/api/deliveries` | Összes kézbesítés |
| GET | `/api/deliveries/:id` | Kézbesítés részletei |
| GET | `/api/deliveries/courier/:courierId` | Futár kézbesítései |
| PATCH | `/api/deliveries/:id/status` | Státusz frissítése |

## Tesztek futtatása

```bash
ng test
```

## Ismert korlátozások

- SSR (`server.ts`) be van kötve, de productionban külön Node szerver szükséges hozzá (`node dist/sls-frontend/server/server.mjs`).
