import { describe, expect, it } from "vitest";
import { amountInWords } from "../src/lib/contracts/amount-words";
import { quarterStatus, LEGAL_2026 } from "../src/lib/contracts/legal-2026";
import { buildContract, type ContractInput } from "../src/lib/contracts/contract";

const base: ContractInput = {
  mode: "dzielo",
  contractor: { name: "Jan Wykonawca", address: "ul. Krótka 1, 37-500 Jarosław", pesel: "", email: "jan@example.com", bank: "00 1111 2222 3333 4444 5555 6666" },
  client: { kind: "firma", name: "Piekarnia Sp. z o.o.", address: "ul. Długa 2, 37-500 Jarosław", nip: "1234567890", representative: "Anna Nowak", email: "biuro@example.com" },
  consumerRights: false,
  remote: true,
  work: { title: "Strona internetowa piekarni", description: "Strona z ofertą i formularzem kontaktowym." },
  dates: { signed: "2026-11-20", start: "2026-11-23", deadline: "2026-12-18" },
  price: { amount: 3000, advancePercent: 30, paymentDays: 7, copyrightShare: 80 },
  revisions: 2,
  supportDays: 30,
  place: "Jarosław",
};
const text = (input: ContractInput) => JSON.stringify(buildContract(input));

describe("kwota słownie", () => {
  it("zapisuje złote i grosze po polsku", () => {
    expect(amountInWords(3000)).toBe("trzy tysiące złotych 00/100");
    expect(amountInWords(1234.5)).toBe("jeden tysiąc dwieście trzydzieści cztery złote 50/100");
    expect(amountInWords(10813.5)).toBe("dziesięć tysięcy osiemset trzynaście złotych 50/100");
    expect(amountInWords(1)).toBe("jeden złoty 00/100");
    expect(amountInWords(22)).toBe("dwadzieścia dwa złote 00/100");
    expect(amountInWords(115)).toBe("sto piętnaście złotych 00/100");
  });
});

describe("limit działalności nierejestrowanej", () => {
  it("2026: 10 813,50 zł na kwartał (225% z 4806 zł)", () => {
    expect(LEGAL_2026.unregisteredQuarterLimit).toBe(10813.5);
    expect(LEGAL_2026.unregisteredQuarterLimit).toBe(Math.round(LEGAL_2026.minimumWage * 2.25 * 100) / 100);
  });
  it("liczy, ile zostało w kwartale i ostrzega przed przekroczeniem", () => {
    expect(quarterStatus(4000, 3000)).toMatchObject({ total: 7000, remaining: 3813.5, exceeded: false });
    expect(quarterStatus(9000, 3000)).toMatchObject({ total: 12000, exceeded: true });
  });
});

describe("umowa", () => {
  it("umowa o dzieło z firmą: firma jest płatnikiem i zgłasza RUD, wynagrodzenie brutto", () => {
    const t = text(base);
    expect(t).toContain("Umowa o dzieło");
    expect(t).toContain("płatnik");
    expect(t).toContain("RUD");
    expect(t).toContain("brutto");
    expect(t).toContain("trzy tysiące złotych 00/100");
  });

  it("działalność nierejestrowana: rachunek i własne rozliczenie podatku, bez płatnika", () => {
    const t = text({ ...base, mode: "nierejestrowana", client: { ...base.client, kind: "osoba", nip: "" }, consumerRights: true });
    expect(t).toContain("działalności nierejestrowanej");
    expect(t).toContain("rachunek");
    expect(t).not.toContain("jako płatnik");
  });

  it("prawa autorskie przechodzą dopiero po zapłacie całego wynagrodzenia", () => {
    expect(text(base)).toMatch(/z chwilą zapłaty całości wynagrodzenia/i);
  });

  it("konsument przy umowie na odległość: 14 dni na odstąpienie i formularz w załączniku", () => {
    const contract = buildContract({ ...base, client: { ...base.client, kind: "osoba" }, consumerRights: true });
    expect(JSON.stringify(contract)).toContain("14 dni");
    expect(contract.annexes.map(a => a.title)).toContain("Wzór formularza odstąpienia od umowy");
  });

  it("firma: bez prawa odstąpienia konsumenta, z ograniczeniem odpowiedzialności", () => {
    const contract = buildContract(base);
    const t = JSON.stringify(contract);
    expect(t).not.toContain("14 dni od dnia zawarcia");
    expect(t).toContain("ogranicza się do wysokości wynagrodzenia");
    expect(contract.annexes.map(a => a.title)).toEqual(["Protokół odbioru"]);
  });

  it("konsumentowi nie ogranicza ustawowej odpowiedzialności", () => {
    expect(text({ ...base, client: { ...base.client, kind: "osoba" }, consumerRights: true })).not.toContain("ogranicza się do wysokości wynagrodzenia");
  });
});
