// Reviewed v2 copy migration. Run with node --env-file=.env.local scripts/update-public-copy-v2.mjs [--apply].
// Default is a dry run. No prices, account data, testimonials or publication flags are changed.
import { createClient } from '@libsql/client';
import { mkdir, writeFile } from 'node:fs/promises';
const apply = process.argv.includes('--apply');
if (!process.env.TURSO_DATABASE_URL) throw new Error('Missing database configuration.');
const db = createClient({url:process.env.TURSO_DATABASE_URL, authToken:process.env.TURSO_AUTH_TOKEN});
const services = [
  { id: "de9871ba-8ca4-4039-8c57-d8f753b56db3", short: "Strona firmowa lub landing page, która jasno pokazuje ofertę i prowadzi do kontaktu.",
    description: "Projektuję i buduję strony firmowe oraz landing page w Next.js. Zaczynamy od celu strony i tego, co ma zrobić odwiedzający. Potem powstaje projekt, treści i wersja do sprawdzenia na telefonie i komputerze. Przed publikacją testuję szybkość, dostępność i podstawy SEO.",
    features: ["Projekt dopasowany do telefonu i komputera", "Podstawowe SEO i dane strukturalne", "Formularz kontaktowy", "Test wydajności przed publikacją", "Instrukcja zmiany treści"] },
  { id: "d6fae604-eed1-4051-8ef4-e4cda81b1a4f", short: "Aplikacje dla firm: panele, portale i platformy z logowaniem.",
    description: "Buduję aplikacje webowe od zakresu po wdrożenie: logowanie, role użytkowników, baza danych i integracje z innymi usługami. Zaczynamy od najmniejszej wersji, która rozwiązuje konkretny problem, i rozwijamy ją etapami. Na koniec omawiamy obsługę i dalszy rozwój.",
    features: ["Logowanie i role użytkowników", "Integracje z zewnętrznymi API", "Baza danych dopasowana do danych firmy", "Wersja MVP, potem kolejne etapy", "Testy kluczowych funkcji"] },
  { id: "a76b42a8-a706-4e99-b26e-9b8296b83817", short: "Panele administracyjne i proste systemy do pracy z danymi.",
    description: "Tworzę wewnętrzne narzędzia, które zastępują arkusze i ręczne przepisywanie danych: panele z raportami, listy zamówień, proste systemy do obsługi klientów. Ustalamy, kto czego potrzebuje, i budujemy tylko te funkcje, z których zespół naprawdę korzysta.",
    features: ["Panel z uprawnieniami", "Raporty i wykresy", "Eksport danych", "Integracje z istniejącymi narzędziami"] },
  { id: "8a9b8313-e96b-4846-b817-66a5a1242ad2", short: "Sklep internetowy z koszykiem, płatnościami i panelem zamówień.",
    description: "Buduję sklepy internetowe dopasowane do sposobu, w jaki sprzedajesz: katalog produktów, koszyk, płatności i panel do obsługi zamówień. Wspólnie wybieramy płatności i dostawę. Jeśli gotowa platforma wystarczy, powiem o tym wprost.",
    features: ["Katalog produktów i koszyk", "Płatności online (np. Stripe, PayU)", "Panel zamówień", "Stany magazynowe", "Faktury i powiadomienia e-mail"] },
  { id: "25345066-c440-46dd-b1bf-2a471241a7f5", short: "Automatyzacja powtarzalnych zadań i połączenia między systemami.",
    description: "Automatyzuję zadania, które zabierają czas: przenoszenie danych między systemami, raporty, powiadomienia, obsługę formularzy. Łączę usługi przez API i webhooki. Zaczynamy od jednego procesu, żeby szybko sprawdzić, czy automatyzacja się opłaca.",
    features: ["Integracje API i webhooki", "Automatyczne raporty", "Porządkowanie i przetwarzanie danych", "Powiadomienia e-mail", "Skrypty uruchamiane cyklicznie"] },
  { id: "91af5810-355b-4553-ba01-331438f9859a", short: "Odświeżenie i uporządkowanie istniejącej strony lub aplikacji.",
    description: "Przeglądam istniejący kod, wskazuję najważniejsze problemy i naprawiam je etapami: szybkość działania, bezpieczeństwo zależności, wygląd i wygodę obsługi. Przed rozpoczęciem pracy dostajesz listę zmian z uzasadnieniem.",
    features: ["Audyt wydajności", "Aktualizacja zależności", "Odświeżenie interfejsu", "Porządkowanie kodu", "Poprawa podstaw bezpieczeństwa"] },
  { id: "fc06f71b-d746-45b2-a0e2-361ef18f2578", short: "Aplikacje na iOS i Androida z jednej bazy kodu.",
    description: "Buduję aplikacje mobilne na iOS i Androida z jednej bazy kodu. Wspólnie ustalamy najważniejsze ekrany i funkcje pierwszej wersji, a potem przygotowuję ją do publikacji w sklepach. Zakres i termin poznasz przed startem.",
    features: ["iOS i Android z jednej bazy", "Powiadomienia push", "Tryb offline tam, gdzie ma sens", "Przygotowanie do publikacji w sklepach", "Integracja z API"] },
  { id: "99329714-cfb4-4149-a276-f4620f272f2b", short: "Konsultacje i przegląd architektury przed większą decyzją.",
    description: "Pomagam wybrać technologie i ocenić architekturę systemu przed większą inwestycją. Po przeglądzie dostajesz konkretne rekomendacje i kolejność działań: co zmienić od razu, a co może poczekać.",
    features: ["Przegląd architektury", "Code review", "Dobór technologii", "Szacowanie kosztów chmury", "Plan działań"] },
];

const projects = [
  { slug: "vip-transfery-platforma-premium-transport-solutions", project_type: "landing-page",
    short_description: "Strona wizytówkowa firmy oferującej transfery VIP i lotniskowe. Zbudowana w Next.js 16 i Tailwind CSS.",
    main_challenge: "Pokazać wysokiej jakości zdjęcia samochodów i utrzymać szybkie ładowanie strony. Obrazy optymalizuje next/image.",
    project_result: "Strona prezentuje ofertę transferów i prowadzi do kontaktu. Według opublikowanej opinii klienta rezerwacja transferów stała się prostsza." },
  { slug: "zielona-baza-restauracja-weganska-w-rzeszowie", project_type: "web",
    short_description: "Strona restauracji wegańskiej w Rzeszowie z menu zarządzanym z bazy danych.",
    main_challenge: "Połączyć menu pobierane z bazy danych z szybkim ładowaniem i wygodą na telefonie.",
    project_result: "Szybka, responsywna strona z menu, które można aktualizować bez zmian w kodzie." },
];


const preview=[];
for(const s of services) {
 const old=(await db.execute({sql:'SELECT id,title,short_description,description,features FROM services WHERE id = ?',args:[s.id]})).rows;
 if(old.length!==1) throw new Error('Service record missing; no writes performed.');
 preview.push({table:'services',before:old[0],after:{short_description:s.short,description:s.description,features:JSON.stringify(s.features)}});
}
for(const p of projects) {
 const old=(await db.execute({sql:'SELECT id,slug,category,project_type,short_description,main_challenge,project_result FROM projects WHERE slug = ?',args:[p.slug]})).rows;
 if(old.length!==1) throw new Error('Project record missing; no writes performed.');
 preview.push({table:'projects',before:old[0],after:{category:'web',project_type:p.project_type,short_description:p.short_description,main_challenge:p.main_challenge,project_result:p.project_result}});
}
console.log(`${apply?'APPLY':'DRY RUN'}: ${services.length} services, ${projects.length} projects; prices and publication status unchanged.`);
if(apply){
 await mkdir('.debug',{recursive:true});
 await writeFile(`.debug/public-copy-v2-backup-${Date.now()}.json`,JSON.stringify(preview,null,2));
 const tx=await db.transaction('write');
 try {
  for(const item of preview){
   const entries=Object.entries(item.after);
   const previous=Object.entries(item.before).filter(([k])=>k!=='id');
   const result=await tx.execute({sql:`UPDATE ${item.table} SET ${entries.map(([k])=>`${k} = ?`).join(', ')} WHERE id = ? AND ${previous.map(([k])=>`${k} IS ?`).join(' AND ')}`,args:[...entries.map(([,v])=>v),item.before.id,...previous.map(([,v])=>v)]});
   if(result.rowsAffected!==1)throw new Error('Record changed since preview; transaction rolled back.');
  }
  await tx.commit();console.log('Committed atomically; backup stored locally in .debug.');
 } catch(error){await tx.rollback();throw error;} finally{tx.close();}
}
db.close();
