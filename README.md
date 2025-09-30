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

## 📖 How to Use

### For Students
1. **Borrow Equipment**
   - Select your class from the list
   - Choose equipment to borrow
   - Enter quantity needed
   - Confirm borrowing

2. **Return Equipment**
   - Select your class
   - Choose equipment to return
   - Enter quantity returning
   - Confirm return

### For Teachers/Administrators
1. **Access Admin Panel**
   - Enter admin PIN (default: 1234)
   - Access full management features

2. **Manage Classes**
   - Add new classes
   - View class borrowing status
   - Monitor equipment usage

3. **Manage Equipment**
   - Add new equipment types
   - Set quantity limits
   - View current availability

4. **Reset Data**
   - Clear all borrowing records
   - Reset for new school term

## 🔧 Technical Details

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Storage**: IndexedDB (local browser database)
- **PWA**: Service Worker for offline functionality
- **Deployment**: GitHub Pages (free hosting)

### Browser Support
- **iOS Safari** 12+ (iPads, iPhones)
- **Chrome** 80+ (Android, Windows, Mac)
- **Firefox** 78+ (Windows, Mac, Linux)
- **Edge** 80+ (Windows, Mac)

### Storage
- **Local Storage**: All data stored in browser's IndexedDB
- **Capacity**: ~250MB+ available for app data
- **Persistence**: Data survives browser restarts and device reboots

### Security Features
- **Content Filtering**: Blocks inappropriate language (Swedish/English)
- **Admin Protection**: PIN-protected admin functions
- **No External Requests**: Complete offline operation
- **Local Data Only**: No data transmission to external servers

## 🤝 Contributing

We welcome contributions from other schools and developers!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Ideas for Contributions
- Additional language support
- New equipment categories
- Enhanced reporting features
- Accessibility improvements
- Visual themes for different schools

## 📞 Support

### For Schools
- **Technical Issues**: Create an issue on GitHub
- **Feature Requests**: Open a discussion on GitHub
- **Implementation Help**: Contact via GitHub issues

### For Developers
- **Code Questions**: Check existing issues or create new ones
- **Documentation**: All technical docs in `/docs` folder
- **API Reference**: See TypeScript definitions in source

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

Free for all educational institutions to use, modify, and distribute.

## 🙏 Credits

Created by a Swedish school looking to modernize playground equipment management while maintaining simplicity and reliability.

Special thanks to the teachers and students who tested and provided feedback during development.

---

**Ready to modernize your school's equipment management? Try Rastbanken today!** 🚀

*For questions or support, please create an issue on GitHub.*
