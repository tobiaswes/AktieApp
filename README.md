# Aktieapp

Välkommen till min aktie app!

## Ska-krav
- Skapa en API-nyckel från [Finnhub.io](https://finnhub.io)
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