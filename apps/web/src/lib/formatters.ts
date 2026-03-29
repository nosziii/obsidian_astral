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
  };

  return labels[categoryKey] ?? categoryKey;
}
