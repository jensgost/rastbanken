# 🏫 Snabb Installationsguide för Skolor

Den här guiden hjälper skolor att få igång Rastbanken på 5 minuter eller mindre.

## 🚀 Alternativ 1: Omedelbar Användning (Rekommenderat)

**Ingen installation krävs!** Besök bara: [https://jensgost.github.io/rastbanken/](https://jensgost.github.io/rastbanken/)

### På iPad/Surfplatta:
1. Öppna Safari/Chrome och besök länken ovan
2. Tryck på "Dela"-knappen (ruta med pil)
3. Välj "Lägg till på hemskärm"
4. App-ikonen visas på din hemskärm
5. Tryck på ikonen för att öppna appen - den fungerar offline!

### Första användning:
- **Admin-PIN**: Du skapar din egen 4-siffriga PIN första gången (appen guidar dig)
- **Data**: Appen startar helt tom - ingen data är förladdad
- **Klasser**: Lägg till dina klasser via adminpanelen (t.ex. FA, 1A, 2B)
- **Redskap**: Lägg till redskap med antal (t.ex. 5 fotbollar, 10 hopprep)
- **Elever**: Elever kan lägga till sina namn, eller endast admin (välj i inställningar)
- **Behörigheter**: Som standard kan elever lägga till namn/redskap (kan ändras via admin)

## 🔧 Alternativ 2: Din Egen Version

Vill du anpassa för din skola? Skapa din egen kopia:

### Steg 1: Skapa GitHub-konto
1. Gå till [github.com](https://github.com)
2. Klicka "Sign up" (det är gratis)
3. Följ registreringsstegen

### Steg 2: Kopiera Vår App
1. Besök [detta repository](https://github.com/jensgost/rastbanken)
2. Klicka på "Fork"-knappen (upp till höger)
3. Detta skapar din egen kopia

### Steg 3: Aktivera Webbhosting
1. I ditt kopierade repository, klicka "Settings"
2. Scrolla ner till "Pages" i vänstermenyn
3. Under "Source", välj "Deploy from a branch"
4. Välj "gh-pages" branch
5. Klicka "Save"

Din app blir redo på: `https://dittanvändarnamn.github.io/rastbanken/`

### Steg 4: Anpassa (Valfritt)
- Ändra färger och skolnamn i `vite.config.ts`
- Anpassa klassfärger i `src/constants/colors.ts`
- Modifiera ordfiltret i `src/utils/wordFilter.ts`

## 🎯 Första Dagens Inställning

### För Lärare:
1. **Första gången**: Skapa din egen 4-siffriga admin-PIN (appen guidar dig)
2. **Åtkomst till Adminpanel**: Tryck på ⚙️ på startsidan, ange din PIN
3. **Lägg till Dina Klasser**: Admin → Klasser → Lägg till Klass (t.ex. FA, 1A, 2B)
4. **Lägg till Redskap**: Admin → Redskap → Lägg till Redskap (namn + antal)
5. **Lägg till Elever**: Admin → Elever → Lägg till Elev (eller låt elever göra det själva)
6. **Hantera Behörigheter**: Växla mellan "Elever kan skapa" eller "Endast admin skapar"
7. **Testa med Elever**: Gör en snabb demo av låna/återlämna

### För Elever:
1. **Öppna Appen**: Tryck på hemskärmsikonen
2. **Välj Din Klass**: Från huvudskärmen
3. **Låna Redskap**: Tryck på sak, tryck flera gånger för fler
4. **Lämna Tillbaka Redskap**: Samma process när du är klar

## 📱 Daglig Användning

### Elever Kan:
- ✅ Låna redskap självständigt
- ✅ Lämna tillbaka redskap när de är klara
- ✅ Se vad som är tillgängligt i realtid
- ✅ Använda det helt offline

### Lärare Kan:
- ✅ Övervaka all låneaktivitet
- ✅ Lägga till/ta bort redskap
- ✅ Hantera klasslistor
- ✅ Styra vem som kan lägga till namn/redskap
- ✅ Återställa data för nya terminer
- ✅ Visa användningsstatistik

## 🔒 Safety Features

- **Content Filter**: Blocks inappropriate language
- **Admin Protection**: PIN-required admin functions
- **Local Storage**: No data leaves your device
- **Offline First**: Works without internet

## 🆘 Common Questions

**Q: What if we lose internet?**
A: The app works completely offline after first load!

**Q: Can students break it?**
A: Admin functions are PIN-protected. Students can only borrow/return.

**Q: How do we reset for new school year?**
A: Admin → Reset All Data (removes all borrowing records)

**Q: What devices work best?**
A: iPads are perfect, but any tablet or computer with a modern browser works.

**Q: Is our data safe?**
A: Yes! Everything stays on your device. No data is sent anywhere.

**Q: How do we get help?**
A: Create an issue on GitHub or contact us through the repository.

## 🎉 You're Ready!

That's it! Your school now has a modern, offline-capable equipment management system.

**Questions?** Visit our [main documentation](README.md) or create an issue on GitHub.

---

*Happy equipment lending! 🏃‍♂️⚽🪁*