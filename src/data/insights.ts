import type { AIInsight, DailyBriefSummary, MarketTicker } from '@/types/insights'

export const DAILY_BRIEF: DailyBriefSummary = {
  date: '2026-05-19',
  greeting: 'Günaydın',
  portfolioDayChange: 14_280,
  portfolioDayChangePct: 0.50,
  insightCount: 8,
  tickers: [
    { id: 'bist',   label: 'BIST 100',  value: '9.842',   change:  0.74 },
    { id: 'usdtry', label: 'USD/TRY',   value: '40.71',   change:  0.21 },
    { id: 'eurtry', label: 'EUR/TRY',   value: '44.12',   change:  0.08 },
    { id: 'xau',    label: 'Altın/g',   value: '₺3.842',  change:  1.24 },
    { id: 'tcmb',   label: 'TCMB Faiz', value: '%42.5',   change:  0.00 },
    { id: 'cpi',    label: 'TÜFE (Y)',  value: '%67.1',   change: -0.30 },
  ] satisfies MarketTicker[],
}

export const INSIGHTS: AIInsight[] = [
  // ─── 1. Featured — portfolio performance ──────────────────
  {
    id: 'port-may-summary',
    type: 'portfolio',
    priority: 'high',
    source: 'Portföy Analizi',
    title: 'Portföyünüz Mayıs ayında reel olarak %3.8 büyüdü',
    lead: 'Mayıs ayı sona ererken portföyünüzün enflasyona karşı güçlü performansını koruduğunu görüyoruz.',
    body: 'TÜFE\'nin aylık %3.2 arttığı bir ortamda portföy değeriniz %7.0 nominal getiri sağladı. Bu durum, reel servetinizin bu ay yaklaşık ₺24,000 arttığı anlamına geliyor.\n\nEn büyük katkıyı altın fonları sağlarken, para piyasası araçlarınız da enflasyonla neredeyse eşit bir performans sergiledi. Hisse bileşeniniz ise BIST 100\'ün üzerinde seyrederek portföy alfa\'sına olumlu katkı yaptı.',
    metric: { value: '+%3.8', label: 'Aylık Reel Getiri', delta: '+0.6pp geçen aya göre', positive: true },
    tags: ['Portföy', 'Reel Getiri', 'Mayıs 2026'],
    action: { label: 'Reel analiz sayfasına git', href: '/dashboard/analytics' },
    timestamp: '2026-05-19',
    readTime: 2,
  },

  // ─── 2. TCMB rate decision ─────────────────────────────────
  {
    id: 'tcmb-may-decision',
    type: 'macro',
    priority: 'critical',
    source: 'Makro Akış',
    title: 'TCMB politika faizini %42.5\'te sabit bıraktı',
    lead: 'Merkez Bankası bu ayki toplantısında faiz oranını beklentiler doğrultusunda değiştirmedi.',
    body: 'Bu karar, kısa vadeli borçlanma araçlarının cazibesini koruyacak. Portföyünüzdeki para piyasası fonları yaklaşık %42–44 brüt getiri aralığında seyretmeye devam edebilir.\n\nOrta vadede faiz indirim beklentileri sürmekte; bu durum uzun vadeli tahvil fonlarını olası fiyat kazancı açısından ilginç kılmaktadır. 2026 yılı sonuna kadar toplam 500 baz puanlık indirim fiyatlanıyor.',
    metric: { value: '%42.5', label: 'TCMB Politika Faizi', delta: 'Değişmedi — beklenti karşılandı' },
    tags: ['TCMB', 'Faiz Kararı', 'Para Piyasası'],
    action: { label: 'Para piyasası fonlarını gör', href: '/dashboard/explorer' },
    timestamp: '2026-05-19',
    readTime: 3,
  },

  // ─── 3. Gold opportunity ───────────────────────────────────
  {
    id: 'gold-opp-may',
    type: 'opportunity',
    priority: 'high',
    source: 'Fırsat Taraması',
    title: 'Altın fonları 6 aylık tarihi zirveye yaklaştı',
    lead: 'Küresel belirsizlik ortamında ons fiyatı $2.680\'e ulaşarak portföyünüzdeki altın fonlarını pozitif etkiliyor.',
    body: 'Portföyünüzün %25\'ini oluşturan altın bileşeninin yıllık nominal getirisi %136\'ya yaklaşmış durumda. TL bazında bu performans güçlü olmakla birlikte, dolar bazındaki ons fiyatını ve TL kur hareketini göz önünde bulundurmanız önerilir.\n\nMevcut pozisyonunuzu koruyun. Ek alım için kısa vadeli bir konsolidasyon beklemeniz strateji açısından daha ihtiyatlı olabilir. ZAF ve AKA fonları bu dönemde en yüksek performansı sergiledi.',
    metric: { value: '+%136', label: 'Altın Bileşeni YTD', delta: '1Y nominal', positive: true },
    tags: ['Altın', 'Emtia', 'ZAF', 'AKA'],
    action: { label: 'Altın fonlarını incele', href: '/dashboard/explorer' },
    timestamp: '2026-05-19',
    readTime: 2,
  },

  // ─── 4. CPI reading ───────────────────────────────────────
  {
    id: 'cpi-may',
    type: 'macro',
    priority: 'high',
    source: 'Makro Akış',
    title: 'Mayıs TÜFE açıklandı: Yıllık %67.1, aylık %3.8',
    lead: 'TÜİK\'in açıkladığı Mayıs ayı enflasyon verisi, beklentilerin hafif üzerinde gerçekleşti.',
    body: 'Aylık bazda %3.8 olan TÜFE, portföyünüzün reel getiri hesaplamalarını doğrudan etkiliyor. Bu veriyle güncellenen enflasyon eşiğiniz ₺1,980,000 seviyesindedir.\n\nEnerji ve gıda fiyatlarındaki artış enflasyonun temel itici güçleri olmaya devam ediyor. Önümüzdeki aylarda %60\'ın altına gerileme beklentisi sürmekle birlikte risklerin yukarı yönlü olduğu değerlendiriliyor.',
    metric: { value: '%67.1', label: 'TÜFE (Yıllık)', delta: 'Beklenti: %65.8 — revize yukarı', positive: false },
    tags: ['TÜFE', 'Enflasyon', 'Makro', 'TÜİK'],
    timestamp: '2026-05-19',
    readTime: 2,
  },

  // ─── 5. USD/TRY risk ──────────────────────────────────────
  {
    id: 'usdtry-risk',
    type: 'risk',
    priority: 'normal',
    source: 'Risk Değerlendirmesi',
    title: 'TL, dolar karşısında son 30 günde %2.1 değer kaybetti',
    lead: 'Kur hareketleri portföyünüzdeki eurobond ve yabancı para bileşenlerini yakından etkiliyor.',
    body: 'Portföyünüzün %8\'ini oluşturan eurobond bileşeni bu kur hareketinden faydalanıyor. USD/TRY\'nin 40.71\'e ulaşması, dolar bazlı varlıklarınızın TL karşılığını artırıyor.\n\nAncak kur oynaklığı devam ettiği sürece bu pozisyonun riskini düzenli olarak gözden geçirmeniz önerilir. Kısa vadeli kur baskısının sürebileceği senaryolarda eurobond ağırlığınızı artırmayı değerlendirin.',
    metric: { value: '40.71', label: 'USD/TRY', delta: '+%2.1 son 30 gün' },
    tags: ['USD/TRY', 'Kur Riski', 'Eurobond'],
    timestamp: '2026-05-19',
    readTime: 2,
  },

  // ─── 6. Rebalancing suggestion ────────────────────────────
  {
    id: 'rebalance-may',
    type: 'portfolio',
    priority: 'normal',
    source: 'Portföy Analizi',
    title: 'Para piyasası ağırlığı hedef bandının %2.1 üzerinde',
    lead: 'Portföy optimizasyon analizi, para piyasası pozisyonunuzun stratejik hedef bandını aştığını gösteriyor.',
    body: 'Mevcut %20 olan para piyasası ağırlığınız, önerilen %16–18 maksimum bandının üzerinde seyrediyor. Bu fazla ağırlığı hisse ya da borçlanma araçlarına taşımak, orta vadeli reel getiri potansiyelinizi artırabilir.\n\nÖnerilen dengeleme: ₺48,000\'lik para piyasası tutarını yüksek getirili borçlanma fonlarına aktararak yıllık tahmini reel getiriyi 1.8pp artırın.',
    metric: { value: '%20', label: 'Para Piyasası Ağırlığı', delta: 'Hedef: %16–18', positive: false },
    tags: ['Dengeleme', 'Optimizasyon', 'Para Piyasası'],
    action: { label: 'Dağılım görünümüne git', href: '/dashboard' },
    timestamp: '2026-05-19',
    readTime: 2,
  },

  // ─── 7. Fund alert ────────────────────────────────────────
  {
    id: 'gaf-alert',
    type: 'alert',
    priority: 'critical',
    source: 'Sistem Uyarısı',
    title: 'GAF: Kıdemli fon yöneticisi değişikliği duyuruldu',
    lead: 'Garanti Portföy Altın Fonu\'nda kıdemli fon yöneticisi değişikliği gerçekleşti.',
    body: 'Fon şirketi, mevcut yatırım stratejisi ve risk profilinin değişmeyeceğini açıkladı. Kısa vadede fon performansında belirgin bir sapma beklenmemekle birlikte, yeni yöneticinin performansının önümüzdeki 3 aylık dönemde yakından izlenmesi önerilir.\n\nFonun %136 YTD getirisi ve yüksek AUM\'u stratejik sürekliliği destekler niteliktedir. Şu an için pozisyon değişikliği önerilmemektedir.',
    tags: ['GAF', 'Altın', 'Yönetici Değişikliği', 'Uyarı'],
    action: { label: 'GAF detayına git', href: '/dashboard/explorer' },
    timestamp: '2026-05-19',
    readTime: 1,
  },

  // ─── 8. Bond opportunity ──────────────────────────────────
  {
    id: 'bond-opp-faiz',
    type: 'opportunity',
    priority: 'normal',
    source: 'Fırsat Taraması',
    title: 'Borçlanma araçları faiz indirim beklentisiyle değer kazanıyor',
    lead: 'Piyasalar TCMB\'den 2026 yılı sonuna kadar toplam 500 baz puanlık indirim fiyatlıyor.',
    body: 'Portföyünüzün %12\'sini oluşturan borçlanma bileşeni bu ortamdan avantaj sağlayabilir. Uzun vadeli tahvil fiyatları faiz indirimlerini önceden fiyatlamaya başladığında, elinizdeki tahvil fonları sermaye kazancı da sağlayabilir.\n\nTBF ve DZT gibi orta–uzun vadeli devlet tahvili fonları bu senaryonun en fazla yarar sağlayacağı araçlar arasında öne çıkıyor.',
    metric: { value: '%12', label: 'Borçlanma Ağırlığı', delta: 'Fırsat penceresi açık', positive: true },
    tags: ['Borçlanma', 'Tahvil', 'Faiz İndirimi', 'TBF', 'DZT'],
    action: { label: 'Borçlanma fonlarına bak', href: '/dashboard/explorer' },
    timestamp: '2026-05-19',
    readTime: 2,
  },
]
