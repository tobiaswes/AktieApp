# Aktieapp

Välkommen till min aktieapp för "demo trading" (låtsashandel)!

## Avgränsning
- Appen är begränsad till den aktiemarknaden i USA (Öppettider: 16:30–23:00, måndag–fredag). Man kan köpa aktier även när marknaden är stängd, men priserna uppdateras först när marknaden öppnar.
- Vid köp och försäljning av aktier tas **inte** avgifter (courtage) eller utdelningar (dividender) i beaktande.


## Förkrav
1. Installera Node.js ifall du inte har det installerat
2. Öppna VS-code och ta ner projektet **git clone https://github.com/tobiaswes/AktieApp.git**
3. Kör **npm install expo** i terminalen
4. Skapa en API-nyckel på Finnhubs hemsida: [https://finnhub.io/](https://finnhub.io/)
5. Kör **npm install react-native-dotenv**
6. Skapa filen **.env** i projektmappen
7. Lägg till den publika variabeln **API_KEY=din-api-nyckel** i .env-filen
8. **Viktigt!** När du startar appen för första gången, kör **npx expo start --clear** för att den skall importera och använda filen .env **Viktigt!**

# Kravspecifikation

## Ska-krav
- En sida med en sökfunktion för att söka efter en aktie ([API-dokumentation](https://finnhub.io/docs/api/symbol-search))
- Söksidan visar sökresultatet i en `FlatList`
- En detaljsida för att visa detaljer om en aktie, t.ex:
  - Nuvarande pris
  - Högsta pris
  - Lägsta pris ([API-dokumentation](https://finnhub.io/docs/api/quote))

## Bör-krav
- Skapa "demo trading" (låtsashandel)
- Ge användarens konto ett startkapital på **10 000 euro**
- Lägg till en knapp på detaljsidan för att **köpa en aktie**
- Ett alternativ att köpa aktier, där man kan ange:
  - Antal aktier
  - Total köpsumma
- En startsidan som visar en överblick över eget kapital och köpta aktier i en `FlatList` 
- En detaljsida för en köpt aktie som visar:
  - Antal aktier
  - Totalt värde
  - En knapp för att **sälja aktien**
- En knapp på startsidan för att **låna mer pengar** om kapitalet tar slut
- Lagring av data

## Trevligt-att-ha-krav
- Scoreboard eller statistik över användarens investeringar