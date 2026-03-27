import type {
  BuildingDefinition,
  ExpeditionDefinition,
  GatheringDefinition,
  RecipeDefinition,
  ResourceDefinition,
} from "./game-types.js";

export const resources: ResourceDefinition[] = [
  { key: "fa", label: "Fa", tier: "alap", description: "Könnyen gyűjthető alapanyag építkezéshez és craftoláshoz." },
  { key: "ko", label: "Kő", tier: "alap", description: "Stabil építőanyag műhelyekhez és fejlesztésekhez." },
  { key: "vaserc", label: "Vasérc", tier: "alap", description: "Nyers fémalapanyag fegyverekhez és alkatrészekhez." },
  { key: "viz", label: "Víz", tier: "alap", description: "Kivonatokhoz, túléléshez és expedíciókhoz szükséges." },
  { key: "elelem", label: "Élelem", tier: "alap", description: "A személyzet és a karakter ellátását biztosítja." },
  { key: "textil", label: "Textil", tier: "alap", description: "Könnyű felszerelések és kötések alapja." },
  { key: "rez", label: "Réz", tier: "alap", description: "Vezetőanyag korai eszközökhöz és modulokhoz." },
  { key: "szen", label: "Szén", tier: "kozepes", description: "Olvasztáshoz és ipari folyamatokhoz kell." },
  { key: "kristaly", label: "Kristály", tier: "kozepes", description: "Energiával telített ritkább nyersanyag." },
  { key: "gyogynoveny", label: "Gyógynövény", tier: "kozepes", description: "Gyógyító és támogató receptek alapja." },
  { key: "obszidian", label: "Obszidián", tier: "halado", description: "Ritka, nagy értékű sötétfém alapanyag." },
  { key: "energiamag", label: "Energiamag", tier: "halado", description: "Haladó craft és fejlesztés kulcseleme." },
  { key: "vasrud", label: "Vasrúd", tier: "kozepes", description: "Finomított fémkomponens fegyverekhez és építkezéshez." },
  { key: "deszka", label: "Deszka", tier: "kozepes", description: "Megmunkált fa szerkezetekhez és tárgyakhoz." },
  { key: "alapkivonat", label: "Alapkivonat", tier: "kozepes", description: "Egyszerű gyógyító és támogató oldat." },
  { key: "energiacella", label: "Energiacella", tier: "halado", description: "Nagy sűrűségű energiaforrás fejlett eszközökhöz." },
];

export const gatherings: GatheringDefinition[] = [
  {
    key: "favagas",
    label: "Favágás",
    description: "Gyors ciklusú erdőjárás fa és kevés élelem szerzésére.",
    energyCost: 5,
    durationSeconds: 45,
    rewardXp: 12,
    yields: [
      { resourceKey: "fa", amount: 18 },
      { resourceKey: "elelem", amount: 4 },
    ],
  },
  {
    key: "banyaszat",
    label: "Bányászat",
    description: "Vasérc, kő és szén kitermelése a hegyvidéken.",
    energyCost: 7,
    durationSeconds: 60,
    rewardXp: 16,
    yields: [
      { resourceKey: "ko", amount: 14 },
      { resourceKey: "vaserc", amount: 12 },
      { resourceKey: "szen", amount: 4 },
    ],
  },
  {
    key: "vizkinyeres",
    label: "Vízkivonás",
    description: "Tiszta víz és gyógynövény gyűjtése a parti zónában.",
    energyCost: 4,
    durationSeconds: 40,
    rewardXp: 10,
    yields: [
      { resourceKey: "viz", amount: 16 },
      { resourceKey: "gyogynoveny", amount: 5 },
    ],
  },
];

export const recipes: RecipeDefinition[] = [
  {
    key: "vasrud_ontes",
    label: "Vasrúd öntése",
    category: "anyag",
    description: "Kohóban olvasztott tartós alapanyag további fejlesztésekhez.",
    craftSeconds: 30,
    requiredLevel: 1,
    rewardXp: 18,
    ingredients: [
      { resourceKey: "vaserc", amount: 8 },
      { resourceKey: "szen", amount: 3 },
    ],
    produces: [{ resourceKey: "vasrud", amount: 3 }],
  },
  {
    key: "deszka_vagas",
    label: "Deszkavágás",
    category: "anyag",
    description: "Megmunkált faanyag műhelyekhez és könnyű felszerelésekhez.",
    craftSeconds: 20,
    requiredLevel: 1,
    rewardXp: 14,
    ingredients: [{ resourceKey: "fa", amount: 10 }],
    produces: [{ resourceKey: "deszka", amount: 4 }],
  },
  {
    key: "alapkivonat",
    label: "Alapkivonat",
    category: "fogyoeszkoz",
    description: "Egyszerű regeneráló kivonat a műveletek támogatására.",
    craftSeconds: 25,
    requiredLevel: 1,
    rewardXp: 20,
    ingredients: [
      { resourceKey: "gyogynoveny", amount: 6 },
      { resourceKey: "viz", amount: 8 },
    ],
    produces: [{ resourceKey: "alapkivonat", amount: 2 }],
  },
  {
    key: "energiacella",
    label: "Energiacella",
    category: "anyag",
    description: "Finomított kristály és fém kombinációja a fejlett technológiákhoz.",
    craftSeconds: 45,
    requiredLevel: 2,
    rewardXp: 32,
    ingredients: [
      { resourceKey: "kristaly", amount: 6 },
      { resourceKey: "vasrud", amount: 4 },
    ],
    produces: [{ resourceKey: "energiacella", amount: 2 }],
  },
];

export const buildings: BuildingDefinition[] = [
  {
    key: "furesztelep",
    label: "Fűrésztelep",
    category: "kitermeles",
    description: "Növeli a favágás és megmunkálás hatékonyságát.",
    baseCost: [
      { resourceKey: "fa", amount: 40 },
      { resourceKey: "ko", amount: 20 },
    ],
    productionBonus: { fa: 0.12, deszka: 0.1 },
  },
  {
    key: "koho",
    label: "Kohó",
    category: "feldolgozas",
    description: "Növeli a fémalapú craft receptek kimenetét.",
    baseCost: [
      { resourceKey: "ko", amount: 45 },
      { resourceKey: "vaserc", amount: 24 },
      { resourceKey: "szen", amount: 12 },
    ],
    productionBonus: { vaserc: 0.08, vasrud: 0.12 },
  },
  {
    key: "labor",
    label: "Labor",
    category: "tamogatas",
    description: "Javítja a kivonatok és energiacellák hatásfokát.",
    baseCost: [
      { resourceKey: "rez", amount: 20 },
      { resourceKey: "kristaly", amount: 10 },
      { resourceKey: "viz", amount: 30 },
    ],
    productionBonus: { gyogynoveny: 0.08, alapkivonat: 0.15, energiacella: 0.08 },
  },
];

export const expeditions: ExpeditionDefinition[] = [
  {
    key: "vashegy_kor",
    label: "Vashegy körjárat",
    description: "Rövid expedíció a vasban gazdag peremvidékre.",
    durationMinutes: 5,
    energyCost: 10,
    risk: "alacsony",
    rewardXp: 36,
    guaranteedRewards: [
      { resourceKey: "vaserc", amount: 18 },
      { resourceKey: "ko", amount: 12 },
    ],
    bonusRewards: [{ resourceKey: "kristaly", amount: 4 }],
  },
  {
    key: "kristalyhasadek",
    label: "Kristályhasadék",
    description: "Közepes kockázatú út kristályért és energiamag-maradványokért.",
    durationMinutes: 10,
    energyCost: 16,
    risk: "kozepes",
    rewardXp: 54,
    guaranteedRewards: [
      { resourceKey: "kristaly", amount: 10 },
      { resourceKey: "gyogynoveny", amount: 6 },
    ],
    bonusRewards: [{ resourceKey: "energiamag", amount: 2 }],
  },
];
