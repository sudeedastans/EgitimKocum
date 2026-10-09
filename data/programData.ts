export type Durum = 'yapilacak' | 'anlamadim' | 'yetismedi' | 'bitti';

export type Gorev = {
  id: string;
  ders: string;
  konu: string;
  saat: string;
  durum: Durum;
};

export type Gun = 'Pzt' | 'Sal' | 'Çar' | 'Per' | 'Cum' | 'Cmt' | 'Paz';

export type HaftalikProgram = Record<Gun, Gorev[]>;

export const GUNLER: Gun[] = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export const PROGRAM: HaftalikProgram = {
  Pzt: [
    { id: 'p1', ders: 'Türkçe', konu: '345 Soru Bankası syf: 38-46', saat: '09:00-10:30', durum: 'yapilacak' },
    { id: 'p2', ders: 'Matematik', konu: 'Türev soru çözümü', saat: '11:00-12:30', durum: 'yapilacak' },
    { id: 'p3', ders: 'Fizik', konu: 'Kuvvet ve Hareket tekrar', saat: '14:00-15:30', durum: 'yapilacak' },
  ],
  Sal: [
    { id: 'p4', ders: 'Kimya', konu: 'Atom modelleri konu anlatımı', saat: '09:00-10:00', durum: 'yapilacak' },
    { id: 'p5', ders: 'Biyoloji', konu: 'Hücre yapısı soru çözümü', saat: '11:00-12:00', durum: 'yapilacak' },
    { id: 'p6', ders: 'Türkçe', konu: 'Paragraf denemesi', saat: '15:00-16:00', durum: 'yapilacak' },
  ],
  Çar: [
    { id: 'p7', ders: 'Matematik', konu: 'İntegral giriş', saat: '09:00-10:30', durum: 'yapilacak' },
    { id: 'p8', ders: 'Edebiyat', konu: 'Servet-i Fünun özeti', saat: '11:00-12:00', durum: 'yapilacak' },
    { id: 'p9', ders: 'Fizik', konu: 'Elektrik test çözümü', saat: '14:00-15:00', durum: 'yapilacak' },
  ],
  Per: [
    { id: 'p10', ders: 'Tarih', konu: 'İnkılap Tarihi tekrar', saat: '09:00-10:00', durum: 'yapilacak' },
    { id: 'p11', ders: 'Matematik', konu: 'İntegral soru çözümü', saat: '11:00-12:30', durum: 'yapilacak' },
    { id: 'p12', ders: 'Coğrafya', konu: 'Türkiye iklimi konu anlatımı', saat: '15:00-16:00', durum: 'yapilacak' },
  ],
  Cum: [
    { id: 'p13', ders: 'Deneme', konu: 'TYT Genel Deneme', saat: '10:00-12:45', durum: 'yapilacak' },
    { id: 'p14', ders: 'Deneme Analizi', konu: 'Yanlış soruların analizi', saat: '14:00-15:30', durum: 'yapilacak' },
  ],
  Cmt: [
    { id: 'p15', ders: 'Tekrar', konu: 'Haftalık matematik tekrar', saat: '10:00-11:30', durum: 'yapilacak' },
    { id: 'p16', ders: 'Türkçe', konu: 'Paragraf kampı', saat: '13:00-14:30', durum: 'yapilacak' },
    { id: 'p17', ders: 'Biyoloji', konu: 'Sistemler tekrar', saat: '16:00-17:00', durum: 'yapilacak' },
  ],
  Paz: [
    { id: 'p18', ders: 'Dinlenme', konu: 'Hafif tekrar ve mola', saat: '—', durum: 'yapilacak' },
    { id: 'p19', ders: 'Planlama', konu: 'Yeni hafta planı oluştur', saat: '18:00-19:00', durum: 'yapilacak' },
  ],
};