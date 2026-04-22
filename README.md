# SLS Frontend

## Főbb funkciók

- jogosultság alapú felületek (ADMIN / COURIER)
- dashboard statisztikák
- csomagkezelés, futárkezelés, kézbesítési státuszfrissítés
- nyomkövetés **valódi státusztörténetből** (`/api/packages/tracking/{trackingNumber}/history`)

## Futtatás

1. `npm install`
2. `npm run start`
3. Böngésző: `http://localhost:4200`

## Build

- `npm run build`

## Környezet

`src/environments/environment.ts`:

- `apiUrl: 'http://localhost:8080/api'`
