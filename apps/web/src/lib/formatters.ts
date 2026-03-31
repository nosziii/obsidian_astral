export function formatProfessionLabel(professionKey: string) {
  const labels: Record<string, string> = {
    favagas: "Favágás",
    banyaszat: "Bányászat",
    vadaszat: "Vadászat",
    alkimia: "Alkímia",
    mernokseg: "Mérnökség",
    kereskedelem: "Kereskedelem",
    felderites: "Felderítés",
  };

  return labels[professionKey] ?? professionKey;
}

export function formatEquipmentSlotLabel(slotKey: string) {
  const labels: Record<string, string> = {
    fofegyver: "Főfegyver",
    mellekfegyver: "Mellékfegyver",
    sisak: "Sisak",
    pancel: "Páncél",
    kesztyu: "Kesztyű",
    csizma: "Csizma",
    relikvia: "Relikvia",
  };

  return labels[slotKey] ?? slotKey;
}

export function formatCategoryLabel(categoryKey: string) {
  const labels: Record<string, string> = {
    fegyver: "Fegyver",
    pancel: "Páncél",
    fogyoeszkoz: "Fogyóeszköz",
    anyag: "Anyag",
    kitermeles: "Kitermelés",
    feldolgozas: "Feldolgozás",
    tamogatas: "Támogatás",
    alacsony: "Alacsony",
    kozepes: "Közepes",
    magas: "Magas",
    elerheto: "Elérhető",
    hamarosan: "Hamarosan",
    zarolt: "Zárolt",
    gathering: "Gyűjtés",
    craft: "Craft",
    building: "Építés",
    expedition: "Expedíció",
    alap: "Alap",
    halado: "Haladó",
    esemeny: "Esemény",
    gyakori: "Gyakori",
    ritka: "Ritka",
    epikus: "Epikus",
  };

  return labels[categoryKey] ?? categoryKey;
}
