/*
 * Figures and rules for a person working without a registered company, as of 15 Nov 2026.
 * Sources are listed for every figure; check them before relying on this (not legal advice).
 */
export const LEGAL_2026 = {
  checkedOn: "2026-11-15",
  /** Minimum wage 2026 (Dz.U. 2025 poz. 1242). */
  minimumWage: 4806,
  /** Unregistered activity: revenue limit per quarter, 225% of the minimum wage. */
  unregisteredQuarterLimit: 10813.5,
  /** Days to register in CEIDG after the limit is exceeded. */
  ceidgDays: 7,
  /** VAT subject exemption: annual sales (net). */
  vatExemptionLimit: 240000,
  /** Cash register exemption: annual sales to private persons. */
  cashRegisterLimit: 20000,
  /** Annual cap on the 50% copyright cost deduction (art. 22 ust. 9a PIT). */
  copyrightCostCap: 120000,
  /** Days for the client to report a contract for specific work to ZUS (RUD). */
  rudDays: 7,
  /** Consumer withdrawal period for distance contracts. */
  consumerWithdrawalDays: 14,
  sources: [
    { label: "biznes.gov.pl — działalność nierejestrowana (limit, obowiązki, VAT, kasa)", url: "https://www.biznes.gov.pl/pl/portal/00115" },
    { label: "Płaca minimalna 2026: 4806 zł (Dz.U. 2025 poz. 1242)", url: "https://www.pap.pl/aktualnosci/od-nowego-roku-minimalne-wynagrodzenie-w-gore-podano-kwote" },
    { label: "Limit zwolnienia z VAT od 2026: 240 000 zł", url: "https://ksiegowosc.infor.pl/wiadomosci/6852348,nowy-limit-zwolnienia-z-vat-od-2026-roku-240-tys-zl-sejm-uchwalil-nowelizacje-ustawy-o-podatku-od-towarow-i-uslug.html" },
    { label: "50% kosztów autorskich i limit 120 000 zł", url: "https://ksiegowosc.infor.pl/podatki/podatki-osobiste/pit/7549340,przychod-autorski-koszty-uzyskania-przychodu-i-limit-50-praktyczny-przewodnik-dla-tworcow-i-it.html" },
    { label: "Umowa o dzieło a działalność nierejestrowana", url: "https://epoznan.pl/news-news-176481-na_co_zwrocic_uwage_przy_laczeniu_dzialalnosci_nierejestrowanej_z_umowa_o_dzielo_wyjasniamy_najwazniejsze_zasady" },
  ],
} as const;

/** How much of this quarter's unregistered-activity limit is used, including a new contract. */
export function quarterStatus(alreadyThisQuarter: number, thisContract: number) {
  const total = Math.round((alreadyThisQuarter + thisContract) * 100) / 100;
  const remaining = Math.round((LEGAL_2026.unregisteredQuarterLimit - total) * 100) / 100;
  return { total, remaining, exceeded: remaining < 0, share: Math.min(1, total / LEGAL_2026.unregisteredQuarterLimit) };
}
