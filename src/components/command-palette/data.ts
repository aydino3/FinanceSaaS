import type { TabId } from '@/stores/shell'

export type CommandItemType = 'page' | 'action' | 'fund'

export interface CommandItem {
  id:          string
  type:        CommandItemType
  label:       string
  description?: string
  keywords?:   string[]
  shortcut?:   string[]
  tabTarget?:  TabId     // SPA navigation — set activeTab on select
  icon:        string
  group:       string
}

export const COMMAND_ITEMS: CommandItem[] = [
  // ── Navigation (SPA tabs) ──────────────────────────────────────
  {
    id: 'nav-portfolio',
    type: 'page',
    label: 'Portföy',
    description: 'Portföy özeti, değer ve anlık KPI\'lar',
    keywords: ['portfolio', 'portföy', 'ana', 'home', 'genel'],
    tabTarget: 'portfolio',
    icon: 'chart-pie',
    group: 'Sayfalar',
  },
  {
    id: 'nav-explorer',
    type: 'page',
    label: 'Fon Keşfi',
    description: '24+ TEFAS fonu — filtrele, sırala, karşılaştır',
    keywords: ['fund', 'fon', 'tefas', 'explorer', 'keşif', 'hisse', 'altın'],
    tabTarget: 'explorer',
    icon: 'magnify',
    group: 'Sayfalar',
  },
  {
    id: 'nav-inflation',
    type: 'page',
    label: 'Reel Getiri Analizi',
    description: 'TÜFE düzeltmeli getiri, BIST ve USD karşılaştırması',
    keywords: ['analitik', 'analytics', 'inflation', 'enflasyon', 'grafik', 'reel', 'tüfe'],
    tabTarget: 'inflation',
    icon: 'chart-line',
    group: 'Sayfalar',
  },
  {
    id: 'nav-insights',
    type: 'page',
    label: 'AI Brief',
    description: 'Günlük yapay zeka yatırım özeti ve içgörüler',
    keywords: ['ai', 'brief', 'yapay zeka', 'özet', 'insight', 'içgörü'],
    tabTarget: 'insights',
    icon: 'sparkle',
    group: 'Sayfalar',
  },

  // ── Actions ───────────────────────────────────────────────────
  {
    id: 'action-explore-funds',
    type: 'action',
    label: 'Fonları Keşfet',
    description: 'Fon keşfi sekmesini aç',
    keywords: ['fon', 'keşif', 'ara', 'search'],
    tabTarget: 'explorer',
    shortcut: ['E'],
    icon: 'magnify',
    group: 'İşlemler',
  },
  {
    id: 'action-compare',
    type: 'action',
    label: 'Enflasyon Analizini Aç',
    description: 'Reel getiri karşılaştırma grafiği',
    keywords: ['compare', 'karşılaştır', 'enflasyon', 'analiz', 'grafik'],
    tabTarget: 'inflation',
    icon: 'scale',
    group: 'İşlemler',
  },
  {
    id: 'action-export',
    type: 'action',
    label: 'Verileri Dışa Aktar',
    description: 'Portföy ve getiri verilerini CSV olarak indir',
    keywords: ['export', 'aktar', 'csv', 'download', 'indir'],
    icon: 'download',
    group: 'İşlemler',
  },

  // ── Featured funds (navigate to explorer) ─────────────────────
  {
    id: 'fund-galata-hisse',
    type: 'fund',
    label: 'GAH — Galata Portföy Hisse',
    description: 'Hisse Senedi Fonu · %168.4 YTD',
    keywords: ['galata', 'gah', 'hisse', 'fon'],
    tabTarget: 'explorer',
    icon: 'fund',
    group: 'Popüler Fonlar',
  },
  {
    id: 'fund-ziraat-altin',
    type: 'fund',
    label: 'ZAF — Ziraat Altın Katılım',
    description: 'Altın Fonu · %134.8 YTD',
    keywords: ['ziraat', 'zaf', 'altın', 'gold', 'fon'],
    tabTarget: 'explorer',
    icon: 'fund',
    group: 'Popüler Fonlar',
  },
  {
    id: 'fund-ykl',
    type: 'fund',
    label: 'YKL — Yapı Kredi Likit',
    description: 'Para Piyasası Fonu · %67.3 YTD',
    keywords: ['yapı kredi', 'ykl', 'likit', 'para piyasası'],
    tabTarget: 'explorer',
    icon: 'fund',
    group: 'Popüler Fonlar',
  },
]

export function filterCommands(query: string): CommandItem[] {
  if (!query.trim()) return COMMAND_ITEMS.slice(0, 8)

  const q = query.toLowerCase()
  return COMMAND_ITEMS.filter((item) => {
    const haystack = [
      item.label,
      item.description ?? '',
      ...(item.keywords ?? []),
      item.group,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(q)
  }).slice(0, 10)
}
