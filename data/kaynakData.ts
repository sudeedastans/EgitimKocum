export type KaynakZorluk =
  | 'kolay'
  | 'kolay-orta'
  | 'orta'
  | 'orta-zor'
  | 'zor'
  | 'çok-zor';

export type KaynakTipi =
  | 'soru-bankasi'
  | 'paragraf'
  | 'dil-bilgisi'
  | 'brans-denemesi'
  | 'ders-kitabi';

export type Kaynak = {
  id: string;
  ad: string;
  ders: string;
  tip: KaynakTipi;
  zorluk: KaynakZorluk;
  aciklama?: string;
  resmiKaynak?: boolean;
};

export const TURKCE_KAYNAKLARI: Kaynak[] = [
  {
    id: 'turkce-345-paragraf',
    ad: '3,4,5 Paragraf',
    ders: 'Türkçe',
    tip: 'paragraf',
    zorluk: 'orta-zor',
    aciklama: 'Konuyu oturtup ÖSYM tarzına yaklaşmak için uygun.',
  },
  {
    id: 'turkce-hiz-renk-dil',
    ad: 'Hız ve Renk Dil Bilgisi',
    ders: 'Türkçe',
    tip: 'dil-bilgisi',
    zorluk: 'orta',
    aciklama: 'Konuyu öğrenirken ve temel oluştururken kullanılabilir.',
  },
  {
    id: 'turkce-kronometre-paragraf',
    ad: 'Kronometre Paragraf',
    ders: 'Türkçe',
    tip: 'paragraf',
    zorluk: 'orta-zor',
    aciklama: 'Süre ve hız çalışması için daha uygun.',
  },
  {
    id: 'turkce-3d-tyt-dil',
    ad: '3D Yayınları TYT Dil Bilgisi',
    ders: 'Türkçe',
    tip: 'dil-bilgisi',
    zorluk: 'zor',
    aciklama: 'Daha seçici bir kaynak.',
  },
  {
    id: 'turkce-bilgi-sarmal-paragraf',
    ad: 'Bilgi Sarmal Paragraf',
    ders: 'Türkçe',
    tip: 'paragraf',
    zorluk: 'orta-zor',
    aciklama:
      'TYT seviyesine geçiş ve sınav pratiği açısından dengeli.',
  },
  {
    id: 'turkce-345-dil',
    ad: '3,4,5 Dil Bilgisi',
    ders: 'Türkçe',
    tip: 'dil-bilgisi',
    zorluk: 'orta-zor',
    aciklama: 'Konuyu oturtup ÖSYM tarzına yaklaşmak için uygun.',
  },
  {
    id: 'turkce-hiz-renk-paragraf',
    ad: 'Hız ve Renk Paragraf',
    ders: 'Türkçe',
    tip: 'paragraf',
    zorluk: 'orta',
    aciklama: 'Konuyu öğrenirken ve temel oluştururken kullanılabilir.',
  },
  {
    id: 'turkce-apotemi-paragraf',
    ad: 'Apotemi Paragraf',
    ders: 'Türkçe',
    tip: 'paragraf',
    zorluk: 'zor',
    aciklama: 'Zor paragraf çalışmaları ve yorum gücü için.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'turkce-bilgi-sarmal-20-deneme',
    ad: 'Bilgi Sarmal 20’li Genel Deneme',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'turkce-yanit-deneme',
    ad: 'Yanıt Denemesi',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'turkce-3d-deneme',
    ad: '3D Denemesi',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'turkce-limit-brans',
    ad: 'Limit Branş Denemeleri',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'turkce-deneme-deposu-acil',
    ad: 'Deneme Deposu - Acil Dil Bilgisi',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'turkce-ulti-10',
    ad: 'Ulti Deneme 10’lu',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'turkce-liderler-karmasi',
    ad: 'Liderler Karması Dil Bilgisi 20’li',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'turkce-ozdebir',
    ad: 'Özdebir TYT Türkçe Denemesi',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'turkce-paraf',
    ad: 'Paraf Türkçe Denemesi',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'turkce-345-deneme',
    ad: '3,4,5 TYT Türkçe Denemesi',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'turkce-apotemi-brans',
    ad: 'Apotemi Branş Denemesi',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'turkce-cap-brans',
    ad: 'ÇAP Branş Denemesi',
    ders: 'Türkçe',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
];
export const TYT_MATEMATIK_KAYNAKLARI: Kaynak[] = [
  {
    id: 'tyt-matematik-345',
    ad: '3,4,5',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-matematik-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-matematik-orijinal',
    ad: 'Orijinal',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-baris',
    ad: 'Barış',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-3d',
    ad: '3D',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-toprak',
    ad: 'Toprak',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-mikro-orijinal',
    ad: 'Mikro Orijinal',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
  },
  {
    id: 'tyt-matematik-acil-matematigin-ilaci',
    ad: 'Acil Matematiğin İlacı',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
  },
  {
    id: 'tyt-matematik-acil',
    ad: 'Acil',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-matematik-apotemi',
    ad: 'Apotemi',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
  },
  {
    id: 'tyt-matematik-cap',
    ad: 'ÇAP',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-etkin',
    ad: 'Etkin',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
  },
  {
    id: 'tyt-matematik-miray',
    ad: 'Miray',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-karekok',
    ad: 'Karekök',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-matematik-acil-deneme-deposu',
    ad: 'Acil Deneme Deposu',
    ders: 'TYT Matematik',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-matematik-aydin',
    ad: 'Aydın',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-endemik',
    ad: 'Endemik',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
  },
  {
    id: 'tyt-matematik-mert-hoca',
    ad: 'Mert Hoca',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-etkili-matematik',
    ad: 'Etkili Matematik',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
  },
  {
    id: 'tyt-matematik-benim-hocam',
    ad: 'Benim Hocam',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-matematik-rehber-matematik',
    ad: 'Rehber Matematik',
    ders: 'TYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
];
export const AYT_MATEMATIK_KAYNAKLARI: Kaynak[] = [
  {
    id: 'ayt-matematik-345',
    ad: '3,4,5',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-matematik-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-orijinal',
    ad: 'Orijinal',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-baris',
    ad: 'Barış',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-3d',
    ad: '3D',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-toprak',
    ad: 'Toprak',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-mikro-orijinal',
    ad: 'Mikro Orijinal',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-matematik-acil-matematigin-ilaci',
    ad: 'Acil Matematiğin İlacı',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-matematik-acil',
    ad: 'Acil',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-matematik-apotemi',
    ad: 'Apotemi',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-matematik-cap',
    ad: 'ÇAP',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-etkin',
    ad: 'Etkin',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-matematik-miray',
    ad: 'Miray',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-karekok',
    ad: 'Karekök',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-matematik-acil-deneme-deposu',
    ad: 'Acil Deneme Deposu',
    ders: 'AYT Matematik',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-aydin',
    ad: 'Aydın',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-endemik',
    ad: 'Endemik',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'çok-zor',
  },
  {
    id: 'ayt-matematik-mert-hoca',
    ad: 'Mert Hoca',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-etkili-matematik',
    ad: 'Etkili Matematik',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-matematik-benim-hocam',
    ad: 'Benim Hocam',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-matematik-rehber-matematik',
    ad: 'Rehber Matematik',
    ders: 'AYT Matematik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
  },
];
export const TYT_TARIH_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'tyt-tarih-3d',
    ad: '3D',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Seçici ve zorlayıcı sorularıyla bilgiyi yorumlama becerisini geliştirir. Üst seviyedeki öğrenciler için uygundur.',
  },
  {
    id: 'tyt-tarih-limit',
    ad: 'Limit',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi + yorum dengesini iyi kurar. ÖSYM tarzına yakın, kazanım odaklı sorularıyla dikkat çeker.',
  },
  {
    id: 'tyt-tarih-bilgi-sarmal-ayt',
    ad: 'Bilgi Sarmal AYT',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Kademeli soru yapısı ve düzenli konu ilerleyişiyle konuyu pekiştirmeye uygundur. Bilgi ve yorum soruları dengelidir.',
  },
  {
    id: 'tyt-tarih-345',
    ad: '3,4,5',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'ÖSYM tarzına yakın ve dengeli bir kaynaktır. Temel bilgiden yorum sorularına geçiş sağlar.',
  },
  {
    id: 'tyt-tarih-palme',
    ad: 'Palme',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Temel bilgileri oturtmak ve konu eksiklerini kapatmak için uygundur. Daha çok konu pekiştirme amacıyla kullanılabilir.',
  },
  {
    id: 'tyt-tarih-aydin',
    ad: 'Aydın',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kazanım odaklı sorularıyla temel bilgilerin kalıcı hâle gelmesine yardımcı olur. Orta seviyedeki öğrenciler için uygundur.',
  },
  {
    id: 'tyt-tarih-cap',
    ad: 'ÇAP',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Farklı soru tarzları ve yorum soruları ile öğrenciyi zorlayarak bilgiyi kullanma becerisini geliştirir.',
  },
  {
    id: 'tyt-tarih-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Temel-orta seviyede konu tekrarı ve soru pratiği için kullanışlıdır. Düzenli ilerlemek isteyen öğrenciler için uygundur.',
  },
  {
    id: 'tyt-tarih-acil',
    ad: 'Acil',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Seçici, zorlayıcı ve yorum ağırlıklı sorularıyla üst düzey öğrencileri geliştirir.',
  },
  {
    id: 'tyt-tarih-apatomi',
    ad: 'Apatomi',
    ders: 'TYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Üst düzey düşünme ve yorumlama gerektiren sorularıyla güçlü öğrenciler için tercih edilir.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'tyt-tarih-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal Deneme',
    ders: 'TYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Konu-kazanım dengesi ve ÖSYM tarzına yakın soru dağılımıyla düzenli branş denemesi için uygundur.',
  },
  {
    id: 'tyt-tarih-limit-deneme',
    ad: 'Limit Deneme',
    ders: 'TYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi ve yorum sorularını bir arada kullanır. Orta-zor seviyede öğrenciyi sınava hazırlar.',
  },
  {
    id: 'tyt-tarih-345-deneme',
    ad: '3,4,5',
    ders: 'TYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta',
    aciklama:
      'Daha dengeli ve ulaşılabilir soru yapısıyla denemeye yeni başlayan öğrenciler için uygundur.',
  },
  {
    id: 'tyt-tarih-ozdebir',
    ad: 'Özdebir',
    ders: 'TYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'zor',
    aciklama:
      'Seçici ve sınav ciddiyetine yakın sorularıyla öğrencinin gerçek sınav performansını ölçmek için kullanılabilir.',
  },
  {
    id: 'tyt-tarih-aydin-deneme',
    ad: 'Aydın',
    ders: 'TYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Kazanım kontrolü ve bilgi pekiştirme açısından kullanışlıdır.',
  },
  {
    id: 'tyt-tarih-paraf',
    ad: 'Paraf',
    ders: 'TYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi + yorum ağırlıklı yapısıyla farklı soru tiplerini görmeye yardımcı olur.',
  },
  {
    id: 'tyt-tarih-cap-deneme',
    ad: 'ÇAP',
    ders: 'TYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Seçici ve düşündürücü sorularıyla özellikle yüksek net hedefleyen öğrenciler için uygundur.',
  },
];
export const AYT_TARIH_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'ayt-tarih-3d',
    ad: '3D',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Zor ve seçici sorularıyla bilgi birikimini yorumlama ve analiz etme becerisini geliştirir. Yüksek net hedefleyen öğrenciler için uygundur.',
  },
  {
    id: 'ayt-tarih-limit',
    ad: 'Limit',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi + yorum dengesini başarılı şekilde kurar. ÖSYM tarzına yakın, seçici sorularıyla konuyu derinleştirir.',
  },
  {
    id: 'ayt-tarih-bilgi-sarmal',
    ad: 'Bilgi Sarmal AYT',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Kazanım odaklı ve sistemli ilerler. Temel bilgiden yorum sorularına geçiş için dengeli bir kaynaktır.',
  },
  {
    id: 'ayt-tarih-345',
    ad: '3,4,5',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'ÖSYM tarzına yakın soru yapısıyla bilgi ve yorum becerisini birlikte geliştirir. Orta ve orta-üst seviyedeki öğrenciler için uygundur.',
  },
  {
    id: 'ayt-tarih-palme',
    ad: 'Palme',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Konu bilgilerini oturtma ve pekiştirme açısından kullanışlıdır. Temel ve orta seviyedeki öğrenciler için uygundur.',
  },
  {
    id: 'ayt-tarih-aydin',
    ad: 'Aydın',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Kazanım ve bilgi odaklı sorularıyla konuların sağlamlaştırılmasına yardımcı olur.',
  },
  {
    id: 'ayt-tarih-cap',
    ad: 'ÇAP',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Yorum, çıkarım ve farklı soru tarzları açısından zengindir. Öğrenciyi standart bilgi sorularının dışına çıkarır.',
  },
  {
    id: 'ayt-tarih-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Temel-orta seviyede soru pratiği ve konu pekiştirme için uygundur. Konu çalışmasının ardından kullanılabilir.',
  },
  {
    id: 'ayt-tarih-acil',
    ad: 'Acil',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Seçici ve zorlayıcı sorularıyla özellikle üst seviyedeki öğrencileri geliştirir. Bilgiyi yorumlamayı gerektirir.',
  },
  {
    id: 'ayt-tarih-apatomi',
    ad: 'Apatomi',
    ders: 'AYT Tarih',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Üst düzey düşünme, analiz ve yorumlama isteyen sorularıyla en güçlü öğrenciler için daha uygundur.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'ayt-tarih-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal Deneme',
    ders: 'AYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Kazanım kontrolü + ÖSYM tarzı soru dengesiyle konuların ne kadar öğrenildiğini ölçmeye uygundur.',
  },
  {
    id: 'ayt-tarih-limit-deneme',
    ad: 'Limit Deneme',
    ders: 'AYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi ve yorum ağırlıklı, seçici yapısıyla sınav seviyesini yükseltmeye yardımcı olur.',
  },
  {
    id: 'ayt-tarih-345-deneme',
    ad: '3,4,5',
    ders: 'AYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta',
    aciklama:
      'Dengeli ve ulaşılabilir soru yapısıyla düzenli branş denemelerine başlangıç için uygundur.',
  },
  {
    id: 'ayt-tarih-ozdebir',
    ad: 'Özdebir',
    ders: 'AYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'zor',
    aciklama:
      'Seçici ve sınav atmosferine yakın sorularıyla öğrencinin gerçek performansını görmesini sağlar.',
  },
  {
    id: 'ayt-tarih-aydin-deneme',
    ad: 'Aydın',
    ders: 'AYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Kazanım kontrolü ve bilgi pekiştirme açısından kullanışlıdır. Eksik konuları tespit etmeye yardımcı olur.',
  },
  {
    id: 'ayt-tarih-paraf',
    ad: 'Paraf',
    ders: 'AYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi + yorum + çıkarım sorularını bir arada kullanarak farklı soru biçimlerini görmeyi sağlar.',
  },
  {
    id: 'ayt-tarih-cap-deneme',
    ad: 'ÇAP',
    ders: 'AYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'zor',
    aciklama:
      'Seçici ve düşündürücü sorularıyla özellikle yüksek net hedefleyen öğrenciler için uygundur.',
  },
  {
    id: 'ayt-tarih-3d-deneme',
    ad: '3D',
    ders: 'AYT Tarih',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama: 'Zorlayıcı soru pratiği.',
  },
];
export const TYT_COGRAFYA_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'tyt-cografya-3d',
    ad: '3D',
    ders: 'TYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Harita, grafik, tablo ve yorum becerisini geliştiren seçici sorular içerir. Bilgiyi kullanma ve çıkarım yapma becerisini öne çıkarır.',
  },
  {
    id: 'tyt-cografya-limit',
    ad: 'Limit',
    ders: 'TYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi + yorum dengesini iyi kurar. Harita bilgisi, neden-sonuç ilişkisi ve günlük hayat bağlantılı sorularıyla dikkat çeker.',
  },
  {
    id: 'tyt-cografya-bilgi-sarmal-ayt',
    ad: 'Bilgi Sarmal AYT',
    ders: 'TYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kazanım odaklı ve sistemli ilerler. Temel bilgilerin öğrenilmesi ve TYT seviyesinde pekiştirilmesi için uygundur.',
  },
  {
    id: 'tyt-cografya-345',
    ad: '3,4,5',
    ders: 'TYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'ÖSYM tarzı, harita ve görsel yorumlama sorularıyla temel bilgiyi uygulamaya dönüştürür.',
  },
  {
    id: 'tyt-cografya-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'TYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Harita, grafik, tablo ve metin yorumlama soru çeşitliliğiyle öne çıkar. Düzenli',
  },
  {
    id: 'tyt-cografya-yayin-denizi',
    ad: 'Yayın Denizi',
    ders: 'TYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi ve yorum sorularını harmanlayarak öğrenciyi daha seçici sorulara hazırlar.',
  },
  {
    id: 'tyt-cografya-endemik',
    ad: 'Endemik',
    ders: 'TYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Detay bilgi, yorum ve seçici sorular.',
  },
  {
    id: 'tyt-cografya-cap',
    ad: 'ÇAP',
    ders: 'TYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Çok katmanlı harita, iklim grafikleri ve nüfus verileri üzerinden analiz ve çıkarım becerisini geliştirir.',
  },
  {
    id: 'tyt-cografya-apotemi',
    ad: 'Apotemi',
    ders: 'TYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Üst düzey analiz, yorum ve çıkarım gerektiren sorularıyla en ileri seviyedeki öğrenciler için uygundur.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'tyt-cografya-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal Deneme',
    ders: 'TYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta',
    aciklama:
      'Konu ve kazanım kontrolü açısından güçlüdür. Bilgi, harita ve yorum sorularını dengeli şekilde kullanır.',
  },
  {
    id: 'tyt-cografya-limit-deneme',
    ad: 'Limit Deneme',
    ders: 'TYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta',
    aciklama:
      'Yorum ve analiz yönü daha belirgindir. Farklı soru biçimlerini görmeye ve sınav pratiği kazanmaya yardımcı olur.',
  },
  {
    id: 'tyt-cografya-hiz-ve-renk-deneme',
    ad: 'Hız ve Renk',
    ders: 'TYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta',
    aciklama:
      'Çok sayıda kısa denemeyle hız ve süre yönetimi kazandırır.',
  },
  {
    id: 'tyt-cografya-345-deneme',
    ad: '3,4,5',
    ders: 'TYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'ÖSYM tarzına yakın, dengeli soru dağılımıyla gerçek sınava geçiş sağlar.',
  },
  {
    id: 'tyt-cografya-karekok-deneme',
    ad: 'Karekök',
    ders: 'TYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Harita ve grafik yorumlama ağırlıklı sorularıyla soru çeşitliliğini artırır.',
  },
  {
    id: 'tyt-cografya-paraf-deneme',
    ad: 'Paraf',
    ders: 'TYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi, yorum ve görsel veriyi birlikte kullanarak farklı soru tipleri gösterir.',
  },
  {
    id: 'tyt-cografya-ozdebir-deneme',
    ad: 'Özdebir',
    ders: 'TYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
    aciklama:
      'Seçici sorularıyla öğrencinin 5/5 performansa ne kadar yakın olduğunu görmeye yardımcı olur.',
  },
  {
    id: 'tyt-cografya-cap-deneme',
    ad: 'ÇAP',
    ders: 'TYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
    aciklama:
      'Daha düşündürücü ve analiz gerektiren sorularla üst düzey pratik sağlar.',
  },
];
export const AYT_COGRAFYA_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'ayt-cografya-3d',
    ad: '3D',
    ders: 'AYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Harita, grafik, tablo ve yorum becerisini geliştiren seçici sorular içerir. Bilgiyi kullanma ve çıkarım yapma becerisini öne çıkarır.',
  },
  {
    id: 'ayt-cografya-limit',
    ad: 'Limit',
    ders: 'AYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi + yorum dengesini iyi kurar. Harita bilgisi, neden-sonuç ilişkisi ve günlük hayat bağlantılı sorularıyla dikkat çeker.',
  },
  {
    id: 'ayt-cografya-bilgi-sarmal',
    ad: 'Bilgi Sarmal AYT',
    ders: 'AYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kazanım odaklı ve sistemli ilerler. Temel bilgilerin öğrenilmesi ve TYT seviyesinde pekiştirilmesi için uygundur.',
  },
  {
    id: 'ayt-cografya-345',
    ad: '3,4,5',
    ders: 'AYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'ÖSYM tarzı bilgi + yorum sorularıyla temel bilgiyi uygulamaya dönüştürür.',
  },
  {
    id: 'ayt-cografya-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'AYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Harita, grafik, tablo ve metin yorumlama soru çeşitliliğiyle öne çıkar. Düzenli',
  },
  {
    id: 'ayt-cografya-yayin-denizi',
    ad: 'Yayın Denizi',
    ders: 'AYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi ve yorum sorularını harmanlayarak öğrenciyi daha seçici sorulara hazırlar.',
  },
  {
    id: 'ayt-cografya-endemik',
    ad: 'Endemik',
    ders: 'AYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Detay bilgi, yorum ve seçici sorular.',
  },
  {
    id: 'ayt-cografya-cap',
    ad: 'ÇAP',
    ders: 'AYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Çok katmanlı harita, iklim grafikleri ve nüfus verileri üzerinden analiz ve çıkarım becerisini geliştirir.',
  },
  {
    id: 'ayt-cografya-apotemi',
    ad: 'Apotemi',
    ders: 'AYT Coğrafya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Üst düzey analiz, yorum ve çıkarım gerektiren sorularıyla en ileri seviyedeki öğrenciler için uygundur.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'ayt-cografya-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal Deneme',
    ders: 'AYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta',
    aciklama:
      'Konu ve kazanım kontrolü açısından güçlüdür. Bilgi, harita ve yorum sorularını dengeli şekilde kullanır.',
  },
  {
    id: 'ayt-cografya-limit-deneme',
    ad: 'Limit Deneme',
    ders: 'AYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Yorum ve analiz yönü daha belirgindir. Farklı soru biçimlerini görmeye ve sınav pratiği kazanmaya yardımcı olur.',
  },
  {
    id: 'ayt-cografya-hiz-ve-renk-deneme',
    ad: 'Hız ve Renk',
    ders: 'AYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta',
    aciklama:
      'Çok sayıda kısa denemeyle hız ve süre yönetimi kazandırır.',
  },
  {
    id: 'ayt-cografya-345-deneme',
    ad: '3,4,5',
    ders: 'AYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'ÖSYM tarzına yakın, dengeli soru dağılımıyla gerçek sınava geçiş sağlar.',
  },
  {
    id: 'ayt-cografya-karekok-deneme',
    ad: 'Karekök',
    ders: 'AYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Harita ve grafik yorumlama ağırlıklı sorularıyla soru çeşitliliğini artırır.',
  },
  {
    id: 'ayt-cografya-paraf-deneme',
    ad: 'Paraf',
    ders: 'AYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi, yorum ve görsel veriyi birlikte kullanarak farklı soru tipleri gösterir.',
  },
  {
    id: 'ayt-cografya-ozdebir-deneme',
    ad: 'Özdebir',
    ders: 'AYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
    aciklama:
      'Seçici sorularıyla öğrencinin 5/5 performansa ne kadar yakın olduğunu görmeye yardımcı olur.',
  },
  {
    id: 'ayt-cografya-cap-deneme',
    ad: 'ÇAP',
    ders: 'AYT Coğrafya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
    aciklama:
      'Daha düşündürücü ve analiz gerektiren sorularla üst düzey pratik sağlar.',
  },
];
export const TYT_FIZIK_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'tyt-fizik-345',
    ad: '3,4,5',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Konu + soru dengesi güçlüdür. Temel seviyeden başlayıp TYT tarzına geçiş için oldukça uygundur. Güncel kaynak karşılaştırmalarında başlangıç kaynakları arasında gösteriliyor.',
  },
  {
    id: 'tyt-fizik-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kazanım odaklı, sistemli ve kademeli soru yapısıyla konuyu öğrenme ve pekiştirme açısından güçlüdür.',
  },
  {
    id: 'tyt-fizik-3d',
    ad: '3D',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Şekil, grafik, deney düzenekleri ve yorum ağırlıklı seçici sorularıyla bilgiyi kullanma becerisini geliştirir.',
  },
  {
    id: 'tyt-fizik-toprak',
    ad: 'Toprak',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-fizik-acil',
    ad: 'Acil',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Seçici ve zorlayıcı sorularıyla özellikle yüksek net hedefleyen öğrenciler için uygundur. Güncel önerilerde ileri seviye kaynaklar arasında değerlendiriliyor.',
  },
  {
    id: 'tyt-fizik-apotemi',
    ad: 'Apotemi',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      "İleri düzey düşünme ve farklı soru yorumlama becerisi gerektirir. Ancak TYT Fizik'te temel kaynak yerine ileri aşamada kullanılmalıdır.",
  },
  {
    id: 'tyt-fizik-cap',
    ad: 'ÇAP',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Çok adımlı düşünme, grafik ve deney yorumlama gibi becerileri zorlayan seçici sorularıyla üst seviyeye hazırlar. Güncel kaynak listelerinde ileri seviye kaynaklar arasında yer alıyor.',
  },
  {
    id: 'tyt-fizik-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Konuları farklı soru tipleriyle pekiştirir; grafik, şekil ve yorum sorularıyla soru çeşitliliği sağlar.',
  },
  {
    id: 'tyt-fizik-nihat-bilgin',
    ad: 'Nihat Bilgin',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Kavramları derinlemesine düşündüren, işlemden çok fiziksel mantık ve yorumlamayı öne çıkaran sorularıyla güçlü öğrenciler için uygundur.',
  },
  {
    id: 'tyt-fizik-okyanus',
    ad: 'Okyanus',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Yeni nesil soru tarzları ve günlük hayat bağlantılarıyla fiziksel olayları yorumlama becerisini geliştirir.',
  },
  {
    id: 'tyt-fizik-karekok',
    ad: 'Karekök',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Grafik, şekil, deney ve yorum sorularıyla bilgiyi kullanma becerisini geliştirir.',
  },
  {
    id: 'tyt-fizik-aydin',
    ad: 'Aydın',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi ve yorum sorularını dengeler; özellikle konu sonrası eksiklerin görülmesi ve pekiştirilmesi için kullanılabilir.',
  },
  {
    id: 'tyt-fizik-palme',
    ad: 'Palme',
    ders: 'TYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Yeni nesil soru tarzları ve günlük hayat bağlantılarıyla fiziksel olayları yorumlama becerisini geliştirir.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'tyt-fizik-345-deneme',
    ad: '3,4,5',
    ders: 'TYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-fizik-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal',
    ders: 'TYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-fizik-3d-deneme',
    ad: '3D',
    ders: 'TYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'tyt-fizik-acil-deneme',
    ad: 'Acil',
    ders: 'TYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'tyt-fizik-limit-deneme',
    ad: 'Limit',
    ders: 'TYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-fizik-cap-deneme',
    ad: 'ÇAP',
    ders: 'TYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'tyt-fizik-hiz-ve-renk-deneme',
    ad: 'Hız ve Renk',
    ders: 'TYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-fizik-karekok-deneme',
    ad: 'Karekök',
    ders: 'TYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-fizik-ozdebir-deneme',
    ad: 'Özdebir',
    ders: 'TYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
];
export const AYT_FIZIK_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'ayt-fizik-345',
    ad: '3,4,5',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Konu + soru dengesi güçlüdür. Temel seviyeden başlayıp TYT tarzına geçiş için oldukça uygundur. Güncel kaynak karşılaştırmalarında başlangıç kaynakları arasında gösteriliyor.',
  },
  {
    id: 'ayt-fizik-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kazanım odaklı, sistemli ve kademeli soru yapısıyla konuyu öğrenme ve pekiştirme açısından güçlüdür.',
  },
  {
    id: 'ayt-fizik-3d',
    ad: '3D',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Şekil, grafik, deney düzenekleri ve yorum ağırlıklı seçici sorularıyla bilgiyi kullanma becerisini geliştirir.',
  },
  {
    id: 'ayt-fizik-toprak',
    ad: 'Toprak',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-fizik-acil',
    ad: 'Acil',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Seçici ve zorlayıcı sorularıyla özellikle yüksek net hedefleyen öğrenciler için uygundur. Güncel önerilerde ileri seviye kaynaklar arasında değerlendiriliyor.',
  },
  {
    id: 'ayt-fizik-apotemi',
    ad: 'Apotemi',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      "İleri düzey düşünme ve farklı soru yorumlama becerisi gerektirir. Ancak TYT Fizik'te temel kaynak yerine ileri aşamada kullanılmalıdır.",
  },
  {
    id: 'ayt-fizik-cap',
    ad: 'ÇAP',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Çok adımlı düşünme, grafik ve deney yorumlama gibi becerileri zorlayan seçici sorularıyla üst seviyeye hazırlar. Güncel kaynak listelerinde ileri seviye kaynaklar arasında yer alıyor.',
  },
  {
    id: 'ayt-fizik-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Konuları farklı soru tipleriyle pekiştirir; grafik, şekil ve yorum sorularıyla soru çeşitliliği sağlar.',
  },
  {
    id: 'ayt-fizik-nihat-bilgin',
    ad: 'Nihat Bilgin',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Kavramları derinlemesine düşündüren, işlemden çok fiziksel mantık ve yorumlamayı öne çıkaran sorularıyla güçlü öğrenciler için uygundur.',
  },
  {
    id: 'ayt-fizik-okyanus',
    ad: 'Okyanus',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Yeni nesil soru tarzları ve günlük hayat bağlantılarıyla fiziksel olayları yorumlama becerisini geliştirir.',
  },
  {
    id: 'ayt-fizik-karekok',
    ad: 'Karekök',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Grafik, şekil, deney ve yorum sorularıyla bilgiyi kullanma becerisini geliştirir.',
  },
  {
    id: 'ayt-fizik-aydin',
    ad: 'Aydın',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Bilgi ve yorum sorularını dengeler; özellikle konu sonrası eksiklerin görülmesi ve pekiştirilmesi için kullanılabilir.',
  },
  {
    id: 'ayt-fizik-palme',
    ad: 'Palme',
    ders: 'AYT Fizik',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Yeni nesil soru tarzları ve günlük hayat bağlantılarıyla fiziksel olayları yorumlama becerisini geliştirir.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'ayt-fizik-345-deneme',
    ad: '3,4,5',
    ders: 'AYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-fizik-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal',
    ders: 'AYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-fizik-3d-deneme',
    ad: '3D',
    ders: 'AYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-fizik-acil-deneme',
    ad: 'Acil',
    ders: 'AYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-fizik-limit-deneme',
    ad: 'Limit',
    ders: 'AYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-fizik-cap-deneme',
    ad: 'ÇAP',
    ders: 'AYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-fizik-hiz-ve-renk-deneme',
    ad: 'Hız ve Renk',
    ders: 'AYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-fizik-karekok-deneme',
    ad: 'Karekök',
    ders: 'AYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-fizik-ozdebir-deneme',
    ad: 'Özdebir',
    ders: 'AYT Fizik',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
];
export const TYT_KIMYA_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'tyt-kimya-345',
    ad: '3,4,5',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Dengeli ve ÖSYM tarzına yakın soru yapısıyla temel bilgiyi yorum ve uygulamaya dönüştürür.',
  },
  {
    id: 'tyt-kimya-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kademeli ve kazanım odaklı yapısıyla konu öğrenme ve pekiştirme için güçlüdür.',
  },
  {
    id: 'tyt-kimya-orbital',
    ad: 'Orbital',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      "Kavramsal bilgi, işlem ve yorum dengesini güçlü kurar. TYT Kimya'da ana kaynak olarak sık tercih edilen seçeneklerden biridir.",
  },
  {
    id: 'tyt-kimya-karekok',
    ad: 'Karekök',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kavram bilgisi yanında yorum ve uygulama isteyen sorularıyla seviyeyi yükseltmeye yardımcı olur.',
  },
  {
    id: 'tyt-kimya-aydin',
    ad: 'Aydın',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Daha seçici ve yer yer işlem ağırlıklı sorularıyla güçlü öğrencileri zorlar. Güncel kaynak değerlendirmelerinde zor kaynaklar arasında öne çıkıyor.',
  },
  {
    id: 'tyt-kimya-3d',
    ad: '3D',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Yeni nesil ve seçici sorularıyla bilgiyi farklı durumlarda kullanma becerisini geliştirir. Güncel listelerde ÖSYM seviyesinde/üstünde konumlandırılıyor.',
  },
  {
    id: 'tyt-kimya-cap',
    ad: 'ÇAP',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Bilgi, yorum ve işlem becerisini birleştiren seçici sorularıyla üst seviyeye hazırlık sağlar.',
  },
  {
    id: 'tyt-kimya-apotemi',
    ad: 'Apotemi',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'İleri düzey yorum, analiz ve problem çözme gerektiren sorularıyla yüksek seviyedeki öğrenciler için uygundur.',
  },
  {
    id: 'tyt-kimya-palme',
    ad: 'Palme',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Konuya yeni başlayanlar için temel bilgi ve kavramları oturtma açısından uygundur. Konu özetleri ve temel düzey soru pratiğiyle öne çıkar.',
  },
  {
    id: 'tyt-kimya-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Temel konuları pekiştirme, farklı soru tiplerini görme ve düzenli soru pratiği için uygundur.',
  },
  {
    id: 'tyt-kimya-miray',
    ad: 'Miray',
    ders: 'TYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Kimyanın temel kavramlarını öğrenmek ve soru çözme alışkanlığı kazanmak için başlangıç seviyesinde kullanılabilir.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'tyt-kimya-345-deneme',
    ad: '3,4,5',
    ders: 'TYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-kimya-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal',
    ders: 'TYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-kimya-3d-deneme',
    ad: '3D',
    ders: 'TYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'tyt-kimya-orbital-deneme',
    ad: 'Orbital',
    ders: 'TYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-kimya-cap-deneme',
    ad: 'ÇAP',
    ders: 'TYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'tyt-kimya-hiz-ve-renk-deneme',
    ad: 'Hız ve Renk',
    ders: 'TYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-kimya-miray-deneme',
    ad: 'Miray',
    ders: 'TYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'kolay-orta',
  },
  {
    id: 'tyt-kimya-apotemi-deneme',
    ad: 'Apotemi',
    ders: 'TYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
];
export const AYT_KIMYA_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'ayt-kimya-345',
    ad: '3,4,5',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Dengeli ve ÖSYM tarzına yakın soru yapısıyla temel bilgiyi yorum ve uygulamaya dönüştürür.',
  },
  {
    id: 'ayt-kimya-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kademeli ve kazanım odaklı yapısıyla konu öğrenme ve pekiştirme için güçlüdür.',
  },
  {
    id: 'ayt-kimya-orbital',
    ad: 'Orbital',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      "Kavramsal bilgi, işlem ve yorum dengesini güçlü kurar. TYT Kimya'da ana kaynak olarak sık tercih edilen seçeneklerden biridir.",
  },
  {
    id: 'ayt-kimya-karekok',
    ad: 'Karekök',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kavram bilgisi yanında yorum ve uygulama isteyen sorularıyla seviyeyi yükseltmeye yardımcı olur.',
  },
  {
    id: 'ayt-kimya-aydin',
    ad: 'Aydın',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Daha seçici ve yer yer işlem ağırlıklı sorularıyla güçlü öğrencileri zorlar. Güncel kaynak değerlendirmelerinde zor kaynaklar arasında öne çıkıyor.',
  },
  {
    id: 'ayt-kimya-3d',
    ad: '3D',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Yeni nesil ve seçici sorularıyla bilgiyi farklı durumlarda kullanma becerisini geliştirir. Güncel listelerde ÖSYM seviyesinde/üstünde konumlandırılıyor.',
  },
  {
    id: 'ayt-kimya-cap',
    ad: 'ÇAP',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Bilgi, yorum ve işlem becerisini birleştiren seçici sorularıyla üst seviyeye hazırlık sağlar.',
  },
  {
    id: 'ayt-kimya-apotemi',
    ad: 'Apotemi',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'İleri düzey yorum, analiz ve problem çözme gerektiren sorularıyla yüksek seviyedeki öğrenciler için uygundur.',
  },
  {
    id: 'ayt-kimya-palme',
    ad: 'Palme',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Konuya yeni başlayanlar için temel bilgi ve kavramları oturtma açısından uygundur. Konu özetleri ve temel düzey soru pratiğiyle öne çıkar.',
  },
  {
    id: 'ayt-kimya-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Temel konuları pekiştirme, farklı soru tiplerini görme ve düzenli soru pratiği için uygundur.',
  },
  {
    id: 'ayt-kimya-miray',
    ad: 'Miray',
    ders: 'AYT Kimya',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Kimyanın temel kavramlarını öğrenmek ve soru çözme alışkanlığı kazanmak için başlangıç seviyesinde kullanılabilir.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'ayt-kimya-345-deneme',
    ad: '3,4,5',
    ders: 'AYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-kimya-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal',
    ders: 'AYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-kimya-3d-deneme',
    ad: '3D',
    ders: 'AYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-kimya-orbital-deneme',
    ad: 'Orbital',
    ders: 'AYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-kimya-cap-deneme',
    ad: 'ÇAP',
    ders: 'AYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-kimya-hiz-ve-renk-deneme',
    ad: 'Hız ve Renk',
    ders: 'AYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-kimya-miray-deneme',
    ad: 'Miray',
    ders: 'AYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'kolay-orta',
  },
  {
    id: 'ayt-kimya-apotemi-deneme',
    ad: 'Apotemi',
    ders: 'AYT Kimya',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
];
export const TYT_BIYOLOJI_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'tyt-biyoloji-345',
    ad: '3,4,5',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Dengeli ve ÖSYM tarzına yakın soru yapısıyla temel bilgiyi yorum ve uygulamaya dönüştürür.',
  },
  {
    id: 'tyt-biyoloji-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kademeli ve kazanım odaklı yapısıyla konu öğrenme ve pekiştirme için güçlüdür.',
  },
  {
    id: 'tyt-biyoloji-orbital',
    ad: 'Orbital',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      "Kavramsal bilgi, işlem ve yorum dengesini güçlü kurar. TYT Kimya'da ana kaynak olarak sık tercih edilen seçeneklerden biridir.",
  },
  {
    id: 'tyt-biyoloji-karekok',
    ad: 'Karekök',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kavram bilgisi yanında yorum ve uygulama isteyen sorularıyla seviyeyi yükseltmeye yardımcı olur.',
  },
  {
    id: 'tyt-biyoloji-aydin',
    ad: 'Aydın',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Daha seçici ve yer yer işlem ağırlıklı sorularıyla güçlü öğrencileri zorlar. Güncel kaynak değerlendirmelerinde zor kaynaklar arasında öne çıkıyor.',
  },
  {
    id: 'tyt-biyoloji-3d',
    ad: '3D',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Yeni nesil ve seçici sorularıyla bilgiyi farklı durumlarda kullanma becerisini geliştirir. Güncel listelerde ÖSYM seviyesinde/üstünde konumlandırılıyor.',
  },
  {
    id: 'tyt-biyoloji-cap',
    ad: 'ÇAP',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Bilgi, yorum ve işlem becerisini birleştiren seçici sorularıyla üst seviyeye hazırlık sağlar.',
  },
  {
    id: 'tyt-biyoloji-apotemi',
    ad: 'Apotemi',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'İleri düzey yorum, analiz ve problem çözme gerektiren sorularıyla yüksek seviyedeki öğrenciler için uygundur.',
  },
  {
    id: 'tyt-biyoloji-palme',
    ad: 'Palme',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Konuya yeni başlayanlar için temel bilgi ve kavramları oturtma açısından uygundur. Konu özetleri ve temel düzey soru pratiğiyle öne çıkar.',
  },
  {
    id: 'tyt-biyoloji-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Temel konuları pekiştirme, farklı soru tiplerini görme ve düzenli soru pratiği için uygundur.',
  },
  {
    id: 'tyt-biyoloji-miray',
    ad: 'Miray',
    ders: 'TYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Kimyanın temel kavramlarını öğrenmek ve soru çözme alışkanlığı kazanmak için başlangıç seviyesinde kullanılabilir.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'tyt-biyoloji-345-deneme',
    ad: '3,4,5',
    ders: 'TYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-biyoloji-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal',
    ders: 'TYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-biyoloji-3d-deneme',
    ad: '3D',
    ders: 'TYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'tyt-biyoloji-orbital-deneme',
    ad: 'Orbital',
    ders: 'TYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'tyt-biyoloji-cap-deneme',
    ad: 'ÇAP',
    ders: 'TYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'tyt-biyoloji-hiz-ve-renk-deneme',
    ad: 'Hız ve Renk',
    ders: 'TYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'tyt-biyoloji-miray-deneme',
    ad: 'Miray',
    ders: 'TYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'kolay-orta',
  },
];
export const AYT_BIYOLOJI_KAYNAKLARI: Kaynak[] = [
  // SORU BANKALARI

  {
    id: 'ayt-biyoloji-345',
    ad: '3,4,5',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Dengeli ve ÖSYM tarzına yakın soru yapısıyla temel bilgiyi yorum ve uygulamaya dönüştürür.',
  },
  {
    id: 'ayt-biyoloji-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kademeli ve kazanım odaklı yapısıyla konu öğrenme ve pekiştirme için güçlüdür.',
  },
  {
    id: 'ayt-biyoloji-orbital',
    ad: 'Orbital',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      "Kavramsal bilgi, işlem ve yorum dengesini güçlü kurar. TYT Kimya'da ana kaynak olarak sık tercih edilen seçeneklerden biridir.",
  },
  {
    id: 'ayt-biyoloji-karekok',
    ad: 'Karekök',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kavram bilgisi yanında yorum ve uygulama isteyen sorularıyla seviyeyi yükseltmeye yardımcı olur.',
  },
  {
    id: 'ayt-biyoloji-aydin',
    ad: 'Aydın',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Daha seçici ve yer yer işlem ağırlıklı sorularıyla güçlü öğrencileri zorlar. Güncel kaynak değerlendirmelerinde zor kaynaklar arasında öne çıkıyor.',
  },
  {
    id: 'ayt-biyoloji-3d',
    ad: '3D',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Yeni nesil ve seçici sorularıyla bilgiyi farklı durumlarda kullanma becerisini geliştirir. Güncel listelerde ÖSYM seviyesinde/üstünde konumlandırılıyor.',
  },
  {
    id: 'ayt-biyoloji-cap',
    ad: 'ÇAP',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'zor',
    aciklama:
      'Bilgi, yorum ve işlem becerisini birleştiren seçici sorularıyla üst seviyeye hazırlık sağlar.',
  },
  {
    id: 'ayt-biyoloji-apotemi',
    ad: 'Apotemi',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'İleri düzey yorum, analiz ve problem çözme gerektiren sorularıyla yüksek seviyedeki öğrenciler için uygundur.',
  },
  {
    id: 'ayt-biyoloji-palme',
    ad: 'Palme',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Konuya yeni başlayanlar için temel bilgi ve kavramları oturtma açısından uygundur. Konu özetleri ve temel düzey soru pratiğiyle öne çıkar.',
  },
  {
    id: 'ayt-biyoloji-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Temel konuları pekiştirme, farklı soru tiplerini görme ve düzenli soru pratiği için uygundur.',
  },
  {
    id: 'ayt-biyoloji-miray',
    ad: 'Miray',
    ders: 'AYT Biyoloji',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Kimyanın temel kavramlarını öğrenmek ve soru çözme alışkanlığı kazanmak için başlangıç seviyesinde kullanılabilir.',
  },

  // BRANŞ DENEMELERİ

  {
    id: 'ayt-biyoloji-345-deneme',
    ad: '3,4,5',
    ders: 'AYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-biyoloji-bilgi-sarmal-deneme',
    ad: 'Bilgi Sarmal',
    ders: 'AYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-biyoloji-3d-deneme',
    ad: '3D',
    ders: 'AYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-biyoloji-orbital-deneme',
    ad: 'Orbital',
    ders: 'AYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'orta-zor',
  },
  {
    id: 'ayt-biyoloji-cap-deneme',
    ad: 'ÇAP',
    ders: 'AYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'zor',
  },
  {
    id: 'ayt-biyoloji-hiz-ve-renk-deneme',
    ad: 'Hız ve Renk',
    ders: 'AYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'orta',
  },
  {
    id: 'ayt-biyoloji-miray-deneme',
    ad: 'Miray',
    ders: 'AYT Biyoloji',
    tip: 'brans-denemesi',
    zorluk: 'kolay-orta',
  },
];

export const FELSEFE_KAYNAKLARI: Kaynak[] = [
  {
    id: 'felsefe-3d',
    ad: '3D',
    ders: 'Felsefe',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Daha seçici, kavram ve yorum ağırlıklı sorularıyla üst seviyeye hazırlar.',
  },
  {
    id: 'felsefe-limit',
    ad: 'Limit',
    ders: 'Felsefe',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Kavramları ilişkilendiren ve yorumlama gerektiren sorularıyla öne çıkar.',
  },
  {
    id: 'felsefe-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'Felsefe',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Temel kavramları sistemli biçimde öğretir; bilgi ve yorum sorularını dengeler.',
  },
  {
    id: 'felsefe-345',
    ad: '3,4,5',
    ders: 'Felsefe',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'ÖSYM tarzına yakın, kavram bilgisi ile paragraf yorumunu birlikte ölçer.',
  },
  {
    id: 'felsefe-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'Felsefe',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Temel oluşturmak ve konuları hızlı şekilde pekiştirmek için uygundur.',
  },
  {
    id: 'felsefe-cap',
    ad: 'ÇAP',
    ders: 'Felsefe',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Yorum, çıkarım ve kavramlar arası ilişki kurma becerisine ağırlık verir.',
  },
];

export const DIN_KAYNAKLARI: Kaynak[] = [
  {
    id: 'tyt-din-karekok',
    ad: 'Karekök',
    ders: 'TYT Din',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'Kavramları metin üzerinden yorumlatan sorularıyla anlama ve çıkarım becerisini geliştirir.',
  },
  {
    id: 'tyt-din-limit',
    ad: 'Limit',
    ders: 'TYT Din',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Kavramlar arası ilişki kurmayı ve daha dikkatli yorum yapmayı gerektiren sorularla seviyeyi yükseltir.',
  },
  {
    id: 'tyt-din-bilgi-sarmal',
    ad: 'Bilgi Sarmal',
    ders: 'TYT Din',
    tip: 'soru-bankasi',
    zorluk: 'orta-zor',
    aciklama:
      'Kavramsal düşünme ve yorum ağırlığı daha belirgindir. Temeli sağlam öğrenciler için uygundur. Güncel 2026 listelerinde zor grupta gösteriliyor.',
  },
  {
    id: 'tyt-din-345',
    ad: '3,4,5',
    ders: 'TYT Din',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'ÖSYM tarzına yakın, bilgi + yorum dengesini iyi kurar. Kavram bilgisi ile paragraf yorumunu birlikte ölçer. Güncel kaynak önerilerinde orta seviyede değerlendiriliyor.',
  },
  {
    id: 'tyt-din-hiz-ve-renk',
    ad: 'Hız ve Renk',
    ders: 'TYT Din',
    tip: 'soru-bankasi',
    zorluk: 'kolay-orta',
    aciklama:
      'Temel bilgi ile kısa yorum sorularını dengeler; düzenli soru pratiği için uygundur.',
  },
  {
    id: 'tyt-din-yargi',
    ad: 'Yargı',
    ders: 'TYT Din',
    tip: 'soru-bankasi',
    zorluk: 'orta',
    aciklama:
      'MEB kazanımlarını geniş şekilde tarayan, konu eksiklerini görmeye yardımcı olan bir kaynaktır.',
  },
];

export const KAYNAKLAR: Record<string, Kaynak[]> = {
  'TYT Türkçe': TURKCE_KAYNAKLARI,

  'TYT Matematik': TYT_MATEMATIK_KAYNAKLARI,
  'AYT Matematik': AYT_MATEMATIK_KAYNAKLARI,

  'TYT Fizik': TYT_FIZIK_KAYNAKLARI,
  'AYT Fizik': AYT_FIZIK_KAYNAKLARI,

  'TYT Kimya': TYT_KIMYA_KAYNAKLARI,
  'AYT Kimya': AYT_KIMYA_KAYNAKLARI,

  'TYT Biyoloji': TYT_BIYOLOJI_KAYNAKLARI,
  'AYT Biyoloji': AYT_BIYOLOJI_KAYNAKLARI,

  'TYT Tarih': TYT_TARIH_KAYNAKLARI,
  'AYT Tarih': AYT_TARIH_KAYNAKLARI,

  'TYT Coğrafya': TYT_COGRAFYA_KAYNAKLARI,
  'AYT Coğrafya': AYT_COGRAFYA_KAYNAKLARI,

  // Felsefe aynı kaynak listesini kullanıyor
  'TYT Felsefe': FELSEFE_KAYNAKLARI,
  'AYT Felsefe': FELSEFE_KAYNAKLARI,

  // Din yalnızca TYT
  'TYT Din': DIN_KAYNAKLARI,

  'AYT Edebiyat': [],
};