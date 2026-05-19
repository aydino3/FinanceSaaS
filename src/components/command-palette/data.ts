export type CommandItemType = 'page' | 'action' | 'fund'

export interface CommandItem {
  id: string
  type: CommandItemType
  label: string
  description?: string
  keywords?: string[]
  shortcut?: string[]
  href?: string
  icon: string // emoji or SVG path name
  group: string
}

export const COMMAND_ITEMS: CommandItem[] = [
  // Navigation
  {
    id: 'nav-dashboard',
    type: 'page',
    label: 'Portföy',
    description: 'Portföy özeti ve anlık değer',
    keywords: ['portfolio', 'portföy', 'ana sayfa', 'home'],
    href: '/dashboard',
    icon: 'chart-pie',
    group: 'Sayfalar',
  },
  {
    id: 'nav-explorer',
    type: 'page',
    label: 'Fon Keşfi',
    description: '847+ TEFAS fonu listesi ve filtreler',
    keywords: ['fund', 'fon', 'tefas', 'explorer', 'keşif'],
    href: '/dashboard/explorer',
    icon: 'magnify',
    group: 'Sayfalar',
  },
  {
    id: 'nav-analytics',
    type: 'page',
    label: 'Analitik',
    description: 'Enflasyon düzeltmeli getiri grafikleri',
    keywords: ['analitik', 'analytics', 'inflation', 'enflasyon', 'grafik'],
    href: '/dashboard/analytics',
    icon: 'chart-line',
    group: 'Sayfalar',
  },
  {
    id: 'nav-macro',
    type: 'page',
    label: 'Makro',
    description: 'TCMB faiz, CPI ve ekonomik göstergeler',
    keywords: ['macro', 'makro', 'tcmb', 'faiz', 'cpi', 'enflasyon'],
    href: '/dashboard/macro',
    icon: 'globe',
    group: 'Sayfalar',
  },
  {
    id: 'nav-ai-brief',
    type: 'page',
    label: 'AI Brief',
    description: 'Günlük yapay zeka yatırım özeti',
    keywords: ['ai', 'brief', 'yapay zeka', 'özet', 'insight'],
    href: '/dashboard/insights',
    icon: 'sparkle',
    group: 'Sayfalar',
  },
  {
    id: 'nav-watchlist',
    type: 'page',
    label: 'İzleme Listesi',
    description: 'Takip ettiğiniz fonlar ve alarmlar',
    keywords: ['watchlist', 'izleme', 'alarm', 'takip'],
    href: '/dashboard/watchlist',
    icon: 'bookmark',
    group: 'Sayfalar',
  },
  {
    id: 'nav-journal',
    type: 'page',
    label: 'Yatırım Defteri',
    description: 'Kararlarınızı ve notlarınızı kaydedin',
    keywords: ['journal', 'defter', 'not', 'karar'],
    href: '/dashboard/journal',
    icon: 'pencil',
    group: 'Sayfalar',
  },
  {
    id: 'nav-settings',
    type: 'page',
    label: 'Ayarlar',
    description: 'Hesap ve tercih ayarları',
    keywords: ['settings', 'ayarlar', 'hesap', 'profil'],
    href: '/dashboard/settings',
    icon: 'cog',
    group: 'Sayfalar',
  },

  // Actions
  {
    id: 'action-add-position',
    type: 'action',
    label: 'Pozisyon Ekle',
    description: 'Portföye yeni fon veya varlık ekle',
    keywords: ['add', 'ekle', 'pozisyon', 'yeni', 'new'],
    shortcut: ['N'],
    icon: 'plus',
    group: 'İşlemler',
  },
  {
    id: 'action-compare',
    type: 'action',
    label: 'Fonları Karşılaştır',
    description: 'İki veya daha fazla fonu yan yana analiz et',
    keywords: ['compare', 'karşılaştır', 'fon', 'analiz'],
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

  // Featured funds
  {
    id: 'fund-galata',
    type: 'fund',
    label: 'GAF — Galata Fon A.Ş.',
    description: 'Hisse Senedi Fonu · %142.3 YTD',
    keywords: ['galata', 'gaf', 'hisse', 'fon'],
    href: '/dashboard/explorer/GAF',
    icon: 'fund',
    group: 'Popüler Fonlar',
  },
  {
    id: 'fund-akbank',
    type: 'fund',
    label: 'AKB — Akbank Portföy',
    description: 'Borçlanma Araçları Fonu · %98.7 YTD',
    keywords: ['akbank', 'akb', 'borçlanma', 'fon'],
    href: '/dashboard/explorer/AKB',
    icon: 'fund',
    group: 'Popüler Fonlar',
  },
  {
    id: 'fund-enpara',
    type: 'fund',
    label: 'ENP — Enpara Para Piyasası',
    description: 'Para Piyasası Fonu · %89.2 YTD',
    keywords: ['enpara', 'enp', 'para piyasası', 'fon'],
    href: '/dashboard/explorer/ENP',
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
