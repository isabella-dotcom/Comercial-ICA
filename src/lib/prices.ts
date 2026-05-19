export type PaymentMode = "avista" | "parcelado";

export const priceData = {
  lux: {
    tables: ["Social", "Clínicas", "Particular"],
    procedures: {
      Aortografia: {
        Social: { avista: "R$ 1.470,00", parcelado: "R$ 1.700,00" },
        Clínicas: { avista: "R$ 1.815,00", parcelado: "R$ 2.178,00" },
        Particular: { avista: "R$ 2.815,00", parcelado: "R$ 3.378,00" },
      },
      "Cateterismo Cardíaco": {
        Social: { avista: "R$ 1.470,00", parcelado: "R$ 1.700,00" },
        Clínicas: { avista: "R$ 1.800,00", parcelado: "R$ 2.160,00" },
        Particular: { avista: "R$ 2.800,00", parcelado: "R$ 3.360,00" },
      },
      "Angioplastia sem stent": {
        Social: { avista: "R$ 13.500,00", parcelado: "R$ 13.500,00" },
        Clínicas: { avista: "R$ 15.000,00", parcelado: "R$ 15.000,00" },
        Particular: { avista: "R$ 18.000,00", parcelado: "R$ 18.000,00" },
      },
      TAVI: "É necessário solicitar orçamento",
      Ablação: "É necessário solicitar orçamento",
      Endoprótese: "É necessário solicitar orçamento",
    },
  },
  cac: {
    tables: ["Social", "Parcerias", "Particular balcão", "GCR"],
    procedures: {
      Aortografia: {
        Social: { avista: "R$ 2.400,00", parcelado: "R$ 2.985,00" },
        Parcerias: { avista: "R$ 2.550,00", parcelado: "R$ 3.137,00" },
        "Particular balcão": {
          avista: "R$ 2.700,00",
          parcelado: "R$ 3.000,00",
        },
        GCR: { avista: "R$ 2.350,00", parcelado: "R$ 2.985,00" },
      },
      "Cateterismo Cardíaco": {
        Social: { avista: "R$ 2.400,00", parcelado: "R$ 2.985,00" },
        Parcerias: { avista: "R$ 2.550,00", parcelado: "R$ 3.137,00" },
        "Particular balcão": {
          avista: "R$ 2.700,00",
          parcelado: "R$ 3.000,00",
        },
        GCR: { avista: "R$ 2.350,00", parcelado: "R$ 2.985,00" },
      },
      "Angioplastia com um stent": {
        Social: { avista: "R$ 22.253,00", parcelado: "R$ 27.372,00" },
        Parcerias: { avista: "R$ 22.252,50", parcelado: "R$ 27.372,00" },
        "Particular balcão": {
          avista: "R$ 22.252,50",
          parcelado: "R$ 27.372,00",
        },
        GCR: { avista: "R$ 22.253,00", parcelado: "R$ 27.372,00" },
      },
      TAVI: "É necessário solicitar orçamento",
      Crioablação: "É necessário solicitar orçamento",
      "Implante de filtro de veia cava": "É necessário solicitar orçamento",
    },
  },
} as const;

export type UnitKey = keyof typeof priceData;

export function calculatePrice(
  unit: UnitKey,
  table: string,
  mode: PaymentMode,
  procedure: string
): { value: string; requiresQuote: boolean } {
  const unitData = priceData[unit];
  const proc = unitData.procedures[procedure as keyof typeof unitData.procedures];
  if (!proc) return { value: "Procedimento não encontrado", requiresQuote: false };
  if (typeof proc === "string") return { value: proc, requiresQuote: true };
  const tableData = proc[table as keyof typeof proc];
  if (!tableData || typeof tableData !== "object") {
    return { value: "Tabela não configurada", requiresQuote: false };
  }
  return { value: tableData[mode], requiresQuote: false };
}
