# 📚 Rastbanken - Skolrastgårdens Redskapsbank

En progressiv webbapp (PWA) för hantering av rastgårdsredskap på skolor. Elever kan låna och återlämna redskap självständigt medan lärare har överblick genom en administratörspanel.

## 🌟 Live Demo

Besök appen: [https://jensgost.github.io/rastbanken/](https://jensgost.github.io/rastbanken/)

## 📱 Huvudfunktioner

- **Elevgränssnitt**: Enkel utlåning och återlämning av redskap
- **Administratörspanel**: Hantera klasser, elever och redskapsförråd
- **Offline-först**: Fungerar utan internetanslutning
- **Mobiloptimerad**: Designad för surfplattor och smartphones
- **Progressiv Webbapp**: Installera direkt på enhetsstartsidan
- **Innehållsfilter**: Inbyggd filtrering av olämpliga ord
- **Datasäkerhet**: All data lagras lokalt på enheten

## 🚀 Fördelar för Skolor

### Inget Nätverk Krävs
- **Fungerar helt offline** efter första installationen
- Perfekt för skolor med begränsat WiFi eller utomhus rastområden
- Inget beroende av skolans nätverksinfrastruktur

### Noll Infrastrukturkostnader
- **Inga servrar att underhålla** - körs helt på klientenheter
- **Inga hostingavgifter** - distribueras via GitHub Pages (gratis)
- **Inga databaskostnader** - använder webbläsarens inbyggda lagring

### Omedelbar Distribution
- **Redo att använda direkt** - besök bara webbadressen
- **Automatiska uppdateringar** - nya funktioner distribueras automatiskt
- **Plattformsoberoende** - fungerar på iPads, Android-surfplattor och datorer

### Integritet & Säkerhet
- **Data stannar på enheten** - lämnar aldrig skolans kontroll
- **Ingen extern dataöverföring** - fullständig integritetskomplians
- **GDPR-vänlig** - ingen insamling eller spårning av persondata

## 🏫 Perfekt För

- **Grundskolor** (ålder 6-12)
- **Rastgårdsredskapshantering**
- **iPad/surfplatte-baserade lärmiljöer**
- **Skolor som vill ha digital transformation utan komplexitet**
- **Miljöer som kräver offline-funktionalitet**

## 📋 Krav

### Hårdvara
- **iPad, Android-surfplatta eller dator** med modern webbläsare
- **Rekommenderat**: iPad (9:e generationen eller nyare) för bästa upplevelse

### Mjukvara
- **Modern webbläsare**: Chrome, Safari, Firefox eller Edge
- **Ingen ytterligare mjukvara behövs** - körs i webbläsaren

### Teknisk Kunskap
- **För installation**: Grundläggande GitHub-konto och repository-kopiering
- **För daglig användning**: Ingen - designad för elever och lärare

## 🛠 Installationsguide för Skolor

### Alternativ 1: Använd Vår Hostade Version (Enklast)
1. Besök [https://jensgost.github.io/rastbanken/](https://jensgost.github.io/rastbanken/)
2. Lägg till på startsidan på din enhet
3. Börja använda direkt!

### Alternativ 2: Distribuera Din Egen Version
1. **Skapa GitHub-konto** (gratis)
   - Gå till [github.com](https://github.com) och registrera dig

2. **Kopiera Detta Repository**
   - Klicka på "Fork"-knappen på detta repository
   - Detta skapar din egen kopia

3. **Aktivera GitHub Pages**
   - Gå till Settings → Pages i ditt kopierade repository
   - Välj "Deploy from a branch"
   - Välj "gh-pages" branch
   - Din app blir tillgänglig på `https://dittanvändarnamn.github.io/rastbanken/`

4. **Anpassa för Din Skola** (valfritt)
   - Redigera `vite.config.ts` för att ändra appnamn och färger
   - Uppdatera ordfiltret i `src/utils/wordFilter.ts`
   - Modifiera redskapsslistan i `src/utils/seedData.ts`

## 📖 Hur Man Använder

### För Elever
1. **Låna Redskap**
   - Tryck på "Låna"-knappen
   - Välj din klass
   - Välj ditt namn
   - Välj redskap att låna
   - Ange antal som behövs

2. **Lämna Tillbaka Redskap**
   - Tryck på "Återlämna"-knappen på startsidan
   - Hitta ditt namn och det redskap du lånat
   - Tryck på det för att lämna tillbaka

### För Lärare/Administratörer
1. **Första gången (engångsuppsättning)**
   - Appen visar automatiskt en välkomstskärm
   - Skapa din egen 4-siffriga admin-PIN
   - PIN:en sparas lokalt på enheten

2. **Åtkomst till Adminpanel**
   - Ange din admin-PIN
   - Få tillgång till alla hanteringsfunktioner

3. **Hantera Klasser**
   - Lägg till nya klasser
   - Visa klassers lånesstatus
   - Övervaka redskapsanvändning

4. **Hantera Redskap**
   - Lägg till nya redskapstyper
   - Sätt kvantitetsgränser
   - Visa aktuell tillgänglighet

5. **Hantera Behörigheter**
   - Välj om elever kan lägga till nya namn och redskap
   - Eller begränsa detta till endast administratörer
   - Växla mellan öppen och begränsad åtkomst

6. **Återställ Data**
   - Rensa alla låneregister
   - Återställ för ny skoltermin

## 🔧 Tekniska Detaljer

### Teknikstack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Lagring**: IndexedDB (lokal webbläsardatabas)
- **PWA**: Service Worker för offline-funktionalitet
- **Distribution**: GitHub Pages (gratis hosting)

### Webbläsarstöd
- **iOS Safari** 12+ (iPads, iPhones)
- **Chrome** 80+ (Android, Windows, Mac)
- **Firefox** 78+ (Windows, Mac, Linux)
- **Edge** 80+ (Windows, Mac)

### Lagring
- **Lokal Lagring**: All data lagras i webbläsarens IndexedDB
- **Kapacitet**: ~250MB+ tillgängligt för appdata
- **Beständighet**: Data överlever webbläsaromstarter och enhetsomstarter

### Säkerhetsfunktioner
- **Innehållsfiltrering**: Blockerar olämpligt språk (svenska/engelska)
- **Adminskydd**: PIN-skyddade adminfunktioner
- **Inga Externa Förfrågningar**: Komplett offline-drift
- **Endast Lokal Data**: Ingen dataöverföring till externa servrar


## 📄 Licens

Detta projekt är öppen källkod och tillgängligt under [MIT-licensen](LICENSE).

Gratis för alla utbildningsinstitutioner att använda, modifiera och distribuera.

---

**Redo att modernisera din skolas redskapshantering? Prova Rastbanken idag!** 🚀

*För frågor eller support, vänligen skapa ett issue på GitHub.*
