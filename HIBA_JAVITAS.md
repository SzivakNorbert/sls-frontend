# Angular TypeScript Hiba Javítás

Ha ezt a hibát látod: "'imports' must be an array... Unknown reference"

## Megoldás 1: TypeScript Server Restart
VS Code-ban:
1. Nyomd meg: `Ctrl + Shift + P`
2. Írd be: "TypeScript: Restart TS Server"
3. Válaszd ki és futtasd

## Megoldás 2: Node modules újratelepítése
```bash
cd sls-frontend
rmdir /s /q node_modules
npm install
```

## Megoldás 3: Angular Language Service újraindítása
VS Code-ban:
1. Nyomd meg: `Ctrl + Shift + P`
2. Írd be: "Angular: Restart Language Service"
3. Válaszd ki és futtasd

## Megoldás 4: .angular cache törlése
```bash
cd sls-frontend
rmdir /s /q .angular
ng serve
```

## Megoldás 5: Teljes VS Code újraindítás
Zárd be és nyisd meg újra VS Code-ot.

## Ha továbbra is hiba van:
Futtasd le terminálban:
```bash
cd sls-frontend
npm start
```

Ha a terminálban nincs hiba, csak a VS Code IDE-ben, akkor az IDE cache problémája, ami nem akadályozza a futást!
