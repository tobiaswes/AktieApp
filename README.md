# Aktieapp

Välkommen till min aktie app!

##Förkrav
1. Installera Node.js ifall du inte har det installerat
2. Öppna VS-code och ta ner projektet **git clone https://github.com/tobiaswes/AktieApp.git**
3. Kör **npm install expo** i terminalen
4. Skapa en API-nyckel på Finnhubs hemsida: [https://finnhub.io/](https://finnhub.io/)
5. Kör **npm install react-native-dotenv**
6. Skapa filen **.env** i projektmappen
7. Lägg till den publika variabeln **API_KEY=din-api-nyckel** i .env-filen
8. När du startar appen för första gången, kör **npx expo start --clear** för att den skall använda sig av ändringarna i filen .env

## Ska-krav
- En startsida med en sökfunktion för att söka efter en aktie ([API-dokumentation](https://finnhub.io/docs/api/symbol-search))
- Startsidan visar sökresultatet i en `FlatList`
- En detaljsida för att visa detaljer om en aktie, t.ex:
  - Nuvarande pris
  - Högsta pris
  - Lägsta pris ([API-dokumentation](https://finnhub.io/docs/api/quote))

## Bör-krav
- Skapa "demo trading" (låtsashandel)
- Ge användarens konto ett startkapital på **10 000 euro**
- Lägg till en knapp på detaljsidan för att **köpa en aktie**
- En sida för att köpa aktier, där man kan ange:
  - Antal aktier
  - Total köpsumma
- En knapp från startsidan som leder till en sida med en `FlatList` som visar köpta aktier
- En detaljsida för en köpt aktie som visar:
  - Antal aktier
  - Totalt värde
  - En knapp för att **sälja aktien**
- En knapp för att **låna mer pengar** om kapitalet tar slut

## Trevligt-att-ha-krav
- Scoreboard eller statistik över användarens investeringar