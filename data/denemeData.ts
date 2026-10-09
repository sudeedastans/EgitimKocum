export type DenemeDersSonucu = {
  ders: string;
  soru: number;
  dogru: number;
  yanlis: number;
  bos: number;
  net: number;
};

export type DenemeSonucu = {
  id: string;
  tarih: string;
  ad: string;
  tur: 'TYT' | 'AYT';
  toplamNet: number;
  dersler: DenemeDersSonucu[];
};

export const DENEMELER: DenemeSonucu[] = [
  {
    id: 'd5',
    tarih: '11 Eylül 2026',
    ad: 'TYT Genel Deneme',
    tur: 'TYT',
    toplamNet: 63.75,
    dersler: [
      {
        ders: 'Türkçe',
        soru: 40,
        dogru: 34,
        yanlis: 5,
        bos: 1,
        net: 32.75,
      },
      {
        ders: 'Matematik',
        soru: 40,
        dogru: 21,
        yanlis: 4,
        bos: 15,
        net: 20,
      },
      {
        ders: 'Sosyal',
        soru: 20,
        dogru: 10,
        yanlis: 4,
        bos: 6,
        net: 9,
      },
      {
        ders: 'Fen',
        soru: 20,
        dogru: 4,
        yanlis: 8,
        bos: 8,
        net: 2,
      },
    ],
  },

  {
    id: 'd4',
    tarih: '4 Eylül 2026',
    ad: 'TYT Genel Deneme',
    tur: 'TYT',
    toplamNet: 59.25,
    dersler: [
      {
        ders: 'Türkçe',
        soru: 40,
        dogru: 32,
        yanlis: 6,
        bos: 2,
        net: 30.5,
      },
      {
        ders: 'Matematik',
        soru: 40,
        dogru: 20,
        yanlis: 5,
        bos: 15,
        net: 18.75,
      },
      {
        ders: 'Sosyal',
        soru: 20,
        dogru: 10,
        yanlis: 5,
        bos: 5,
        net: 8.75,
      },
      {
        ders: 'Fen',
        soru: 20,
        dogru: 4,
        yanlis: 11,
        bos: 5,
        net: 1.25,
      },
    ],
  },

  {
    id: 'd3',
    tarih: '28 Ağustos 2026',
    ad: 'TYT Genel Deneme',
    tur: 'TYT',
    toplamNet: 56.5,
    dersler: [
      {
        ders: 'Türkçe',
        soru: 40,
        dogru: 31,
        yanlis: 6,
        bos: 3,
        net: 29.5,
      },
      {
        ders: 'Matematik',
        soru: 40,
        dogru: 19,
        yanlis: 6,
        bos: 15,
        net: 17.5,
      },
      {
        ders: 'Sosyal',
        soru: 20,
        dogru: 9,
        yanlis: 4,
        bos: 7,
        net: 8,
      },
      {
        ders: 'Fen',
        soru: 20,
        dogru: 4,
        yanlis: 10,
        bos: 6,
        net: 1.5,
      },
    ],
  },

  {
    id: 'd2',
    tarih: '21 Ağustos 2026',
    ad: 'TYT Genel Deneme',
    tur: 'TYT',
    toplamNet: 53.25,
    dersler: [
      {
        ders: 'Türkçe',
        soru: 40,
        dogru: 30,
        yanlis: 7,
        bos: 3,
        net: 28.25,
      },
      {
        ders: 'Matematik',
        soru: 40,
        dogru: 18,
        yanlis: 6,
        bos: 16,
        net: 16.5,
      },
      {
        ders: 'Sosyal',
        soru: 20,
        dogru: 9,
        yanlis: 6,
        bos: 5,
        net: 7.5,
      },
      {
        ders: 'Fen',
        soru: 20,
        dogru: 4,
        yanlis: 12,
        bos: 4,
        net: 1,
      },
    ],
  },
];