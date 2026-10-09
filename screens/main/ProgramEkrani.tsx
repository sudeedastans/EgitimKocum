import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import {
  PROGRAM,
  GUNLER,
  type Gun,
  type Durum,
  type Gorev,
  type HaftalikProgram,
} from '../../data/programData';

type ProgramEkraniProps = {
  program: HaftalikProgram;
  setProgram: React.Dispatch<React.SetStateAction<HaftalikProgram>>;
};

type GecmisHafta = {
  id: string;
  tarihAraligi: string;
  program: HaftalikProgram;
};

type GecmisAy = {
  id: string;
  baslik: string;
  haftalar: GecmisHafta[];
};


type GelecekGun = {
  gun: Gun;
  tarih: Date;
  tarihEtiketi: string;
  gorevler: Gorev[];
};

type GelecekHafta = {
  id: string;
  tarihAraligi: string;
  gunler: GelecekGun[];
};

/* ---------------------------------------------------
   GÜN İSİMLERİ
--------------------------------------------------- */

const GUN_ADLARI: Record<Gun, string> = {
  Pzt: 'Pazartesi',
  Sal: 'Salı',
  Çar: 'Çarşamba',
  Per: 'Perşembe',
  Cum: 'Cuma',
  Cmt: 'Cumartesi',
  Paz: 'Pazar',
};

/* JS getDay():
   0 = Pazar
   1 = Pazartesi
   ...
*/

const gunMap: Gun[] = [
  'Paz',
  'Pzt',
  'Sal',
  'Çar',
  'Per',
  'Cum',
  'Cmt',
];

const bugun: Gun = gunMap[new Date().getDay()];

/* ---------------------------------------------------
   ŞİMDİLİK ÖRNEK GEÇMİŞ PROGRAMLAR

   İleride bunlar Firebase / backend üzerinden gelecek.
--------------------------------------------------- */

const gecmisProgramOlustur = (
  prefix: string,
  fark: number
): HaftalikProgram => {
  const sonuc = {} as HaftalikProgram;

  GUNLER.forEach((gun, gunIndex) => {
    sonuc[gun] = (PROGRAM[gun] || []).map(
      (gorev, index) => {
        const tamamlandi =
          (index + gunIndex + fark) % 3 !== 0;

        return {
          ...gorev,
          id: `${prefix}-${gorev.id}`,
          durum: tamamlandi
            ? 'bitti'
            : 'yapilacak',
        } as Gorev;
      }
    );
  });

  return sonuc;
};

const GECMIS_AYLAR: GecmisAy[] = [
  {
    id: '2026-08',
    baslik: 'Ağustos 2026',
    haftalar: [
      {
        id: 'agustos-4',
        tarihAraligi: '24 - 30 Ağustos',
        program: gecmisProgramOlustur(
          'agustos4',
          1
        ),
      },
      {
        id: 'agustos-3',
        tarihAraligi: '17 - 23 Ağustos',
        program: gecmisProgramOlustur(
          'agustos3',
          2
        ),
      },
      {
        id: 'agustos-2',
        tarihAraligi: '10 - 16 Ağustos',
        program: gecmisProgramOlustur(
          'agustos2',
          3
        ),
      },
      {
        id: 'agustos-1',
        tarihAraligi: '3 - 9 Ağustos',
        program: gecmisProgramOlustur(
          'agustos1',
          4
        ),
      },
    ],
  },

  {
    id: '2026-07',
    baslik: 'Temmuz 2026',
    haftalar: [
      {
        id: 'temmuz-4',
        tarihAraligi: '27 Temmuz - 2 Ağustos',
        program: gecmisProgramOlustur(
          'temmuz4',
          5
        ),
      },
      {
        id: 'temmuz-3',
        tarihAraligi: '20 - 26 Temmuz',
        program: gecmisProgramOlustur(
          'temmuz3',
          6
        ),
      },
      {
        id: 'temmuz-2',
        tarihAraligi: '13 - 19 Temmuz',
        program: gecmisProgramOlustur(
          'temmuz2',
          7
        ),
      },
      {
        id: 'temmuz-1',
        tarihAraligi: '6 - 12 Temmuz',
        program: gecmisProgramOlustur(
          'temmuz1',
          8
        ),
      },
    ],
  },

  {
    id: '2026-06',
    baslik: 'Haziran 2026',
    haftalar: [
      {
        id: 'haziran-4',
        tarihAraligi: '22 - 28 Haziran',
        program: gecmisProgramOlustur(
          'haziran4',
          9
        ),
      },
      {
        id: 'haziran-3',
        tarihAraligi: '15 - 21 Haziran',
        program: gecmisProgramOlustur(
          'haziran3',
          10
        ),
      },
      {
        id: 'haziran-2',
        tarihAraligi: '8 - 14 Haziran',
        program: gecmisProgramOlustur(
          'haziran2',
          11
        ),
      },
      {
        id: 'haziran-1',
        tarihAraligi: '1 - 7 Haziran',
        program: gecmisProgramOlustur(
          'haziran1',
          12
        ),
      },
    ],
  },
];


const AY_ADLARI = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const tarihKopyala = (
  tarih: Date
) =>
  new Date(
    tarih.getFullYear(),
    tarih.getMonth(),
    tarih.getDate()
  );

const gunEkle = (
  tarih: Date,
  gunSayisi: number
) => {
  const yeni =
    tarihKopyala(tarih);

  yeni.setDate(
    yeni.getDate() +
      gunSayisi
  );

  return yeni;
};

const tarihEtiketi = (
  tarih: Date
) =>
  `${tarih.getDate()} ${
    AY_ADLARI[
      tarih.getMonth()
    ]
  }`;

const gelecekHaftalariOlustur = (
  program: HaftalikProgram,
  referansTarih = new Date()
): GelecekHafta[] => {
  const bugunTarih =
    tarihKopyala(
      referansTarih
    );

  const mevcutAy =
    bugunTarih.getMonth();

  const mevcutYil =
    bugunTarih.getFullYear();

  const aySonu =
    new Date(
      mevcutYil,
      mevcutAy + 1,
      0
    );

  /*
    Mevcut hafta zaten üstteki Haftalık Plan'da görünüyor.
    Gelecek Programlar bir sonraki pazartesiden başlıyor.
  */

  const haftaninGunu =
    bugunTarih.getDay();

  const sonrakiPazartesiIcinGun =
    haftaninGunu === 0
      ? 1
      : 8 - haftaninGunu;

  let haftaBaslangici =
    gunEkle(
      bugunTarih,
      sonrakiPazartesiIcinGun
    );

  const haftalar:
    GelecekHafta[] = [];

  while (
    haftaBaslangici <=
    aySonu
  ) {
    const normalHaftaSonu =
      gunEkle(
        haftaBaslangici,
        6
      );

    const haftaSonu =
      normalHaftaSonu >
      aySonu
        ? tarihKopyala(
            aySonu
          )
        : normalHaftaSonu;

    const gunler:
      GelecekGun[] = [];

    let cursor =
      tarihKopyala(
        haftaBaslangici
      );

    while (
      cursor <=
      haftaSonu
    ) {
      const gun =
        gunMap[
          cursor.getDay()
        ];

      const gorevler =
        (
          program[gun] ||
          []
        ).map(
          gorev => ({
            ...gorev,

            id:
              `gelecek-${cursor
                .toISOString()
                .slice(
                  0,
                  10
                )}-${gorev.id}`,

            durum:
              'yapilacak' as Durum,
          })
        );

      gunler.push({
        gun,

        tarih:
          tarihKopyala(
            cursor
          ),

        tarihEtiketi:
          tarihEtiketi(
            cursor
          ),

        gorevler,
      });

      cursor =
        gunEkle(
          cursor,
          1
        );
    }

    const ayniAy =
      haftaBaslangici.getMonth() ===
      haftaSonu.getMonth();

    const tarihAraligi =
      ayniAy
        ? `${haftaBaslangici.getDate()} - ${haftaSonu.getDate()} ${
            AY_ADLARI[
              haftaBaslangici.getMonth()
            ]
          }`
        : `${tarihEtiketi(
            haftaBaslangici
          )} - ${tarihEtiketi(
            haftaSonu
          )}`;

    haftalar.push({
      id:
        `gelecek-${haftaBaslangici
          .toISOString()
          .slice(
            0,
            10
          )}`,

      tarihAraligi,

      gunler,
    });

    haftaBaslangici =
      gunEkle(
        haftaBaslangici,
        7
      );
  }

  return haftalar;
};


export default function ProgramEkrani({
  program,
  setProgram,
}: ProgramEkraniProps) {
  const [aktifGun, setAktifGun] =
    useState<Gun>(bugun);

  const [aktifListe, setAktifListe] =
    useState<'yapilacak' | 'tamamlanan'>(
      'yapilacak'
    );

  const [aktifGecmisAy, setAktifGecmisAy] =
    useState(GECMIS_AYLAR[0].id);

  const [
    acikGecmisHafta,
    setAcikGecmisHafta,
  ] = useState<string | null>(null);


  const [
    acikGelecekHafta,
    setAcikGelecekHafta,
  ] = useState<string | null>(null);

  /* ---------------------------------------------------
     GÜNLÜK PROGRAM
  --------------------------------------------------- */

  const gunGorevleri: Gorev[] =
    program[aktifGun] || [];

  const yapilacaklar =
    gunGorevleri.filter(
      gorev => gorev.durum !== 'bitti'
    );

  const tamamlananlar =
    gunGorevleri.filter(
      gorev => gorev.durum === 'bitti'
    );

  const gunToplam = gunGorevleri.length;

  const gunBitti = tamamlananlar.length;

  const gunYuzde =
    gunToplam > 0
      ? Math.round(
          (gunBitti / gunToplam) * 100
        )
      : 0;

  /* ---------------------------------------------------
     HAFTALIK İLERLEME
  --------------------------------------------------- */

  const haftalikTumGorevler =
    GUNLER.flatMap(
      gun => program[gun] || []
    );

  const haftalikToplam =
    haftalikTumGorevler.length;

  const haftalikBitti =
    haftalikTumGorevler.filter(
      gorev => gorev.durum === 'bitti'
    ).length;

  const haftalikYuzde =
    haftalikToplam > 0
      ? Math.round(
          (haftalikBitti /
            haftalikToplam) *
            100
        )
      : 0;

  /* ---------------------------------------------------
     DURUM DEĞİŞTİR
  --------------------------------------------------- */

  const durumDegistir = (
    id: string,
    durum: Durum
  ) => {
    setProgram(prev => ({
      ...prev,

      [aktifGun]: prev[aktifGun].map(
        gorev =>
          gorev.id === id
            ? {
                ...gorev,
                durum,
              }
            : gorev
      ),
    }));
  };

  const durumSeciliMi = (
    gorev: Gorev,
    durum: Durum
  ) => gorev.durum === durum;

  /* ---------------------------------------------------
     PDF
  --------------------------------------------------- */

  const htmlEscape = (text: string) =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  /* ---------------------------------------------------
   PDF YARDIMCI FONKSİYONLARI
--------------------------------------------------- */

const dersKolonu = (
  ders: string
) => {
  return ders
    .replace(/^TYT\s+/i, '')
    .replace(/^AYT\s+/i, '')
    .trim();
};

const sinavTuru = (
  ders: string
) => {
  if (
    ders
      .toUpperCase()
      .startsWith('TYT ')
  ) {
    return 'TYT';
  }

  if (
    ders
      .toUpperCase()
      .startsWith('AYT ')
  ) {
    return 'AYT';
  }

  return '';
};

const durumPdfMetni = (
  durum: Durum
) => {
  switch (durum) {
    case 'bitti':
      return 'Yapıldı';

    case 'anlamadim':
      return 'Anlamadım';

    case 'yetismedi':
      return 'Yetişmedi';

    default:
      return 'Yapılacak';
  }
};

/* ---------------------------------------------------
   PROGRAMI PDF YAP
--------------------------------------------------- */

const programiPdfYap =
  async () => {

    try {

      /* -----------------------------------------------
         PDF'TE GÖSTERİLECEK DERSLER
      ----------------------------------------------- */

      const bulunanDersler =
        GUNLER.flatMap(
          gun =>
            (
              program[gun] ||
              []
            ).map(
              gorev =>
                dersKolonu(
                  gorev.ders
                )
            )
        );

      const dersSirasi = [
        'Türkçe',
        'Edebiyat',
        'Matematik',
        'Geometri',
        'Fizik',
        'Kimya',
        'Biyoloji',
        'Tarih',
        'Coğrafya',
        'Felsefe',
        'Din',
      ];

      const dersler =
        Array.from(
          new Set(
            bulunanDersler
          )
        ).sort(
          (
            a,
            b
          ) => {

            const aIndex =
              dersSirasi.indexOf(
                a
              );

            const bIndex =
              dersSirasi.indexOf(
                b
              );

            if (
              aIndex === -1 &&
              bIndex === -1
            ) {
              return a.localeCompare(
                b,
                'tr'
              );
            }

            if (
              aIndex === -1
            ) {
              return 1;
            }

            if (
              bIndex === -1
            ) {
              return -1;
            }

            return (
              aIndex -
              bIndex
            );
          }
        );

      /* -----------------------------------------------
         BAŞLIK SATIRI
      ----------------------------------------------- */

      const dersBasliklari =
        dersler
          .map(
            ders => `
              <th class="ders-baslik">
                ${htmlEscape(
                  ders
                )}
              </th>
            `
          )
          .join('');

      /* -----------------------------------------------
         GÜNLER
      ----------------------------------------------- */

      const gunSatirlari =
        GUNLER.map(
          gun => {

            const gunGorevleri =
              program[gun] ||
              [];

            const dersHucreleri =
              dersler
                .map(
                  ders => {

                    const gorevler =
                      gunGorevleri.filter(
                        gorev =>
                          dersKolonu(
                            gorev.ders
                          ) ===
                          ders
                      );

                    if (
                      gorevler.length ===
                      0
                    ) {

                      return `
                        <td
                          class="ders-hucre bos-hucre"
                        >
                        </td>
                      `;
                    }

                    const gorevHtml =
                      gorevler
                        .map(
                          gorev => {

                            const tur =
                              sinavTuru(
                                gorev.ders
                              );

                            const durum =
                              durumPdfMetni(
                                gorev.durum
                              );

                            const durumClass =
                              gorev.durum ===
                              'bitti'
                                ? 'durum-bitti'
                                : gorev.durum ===
                                  'anlamadim'
                                ? 'durum-anlamadim'
                                : gorev.durum ===
                                  'yetismedi'
                                ? 'durum-yetismedi'
                                : 'durum-yapilacak';

                            return `
                              <div
                                class="gorev"
                              >

                                ${
                                  tur
                                    ? `
                                      <div
                                        class="sinav-turu"
                                      >
                                        ${tur}
                                      </div>
                                    `
                                    : ''
                                }

                                <div
                                  class="gorev-konu"
                                >
                                  ${htmlEscape(
                                    gorev.konu
                                  )}
                                </div>

                                ${
                                  gorev.saat !==
                                  '—'
                                    ? `
                                      <div
                                        class="gorev-saat"
                                      >
                                        ${htmlEscape(
                                          gorev.saat
                                        )}
                                      </div>
                                    `
                                    : ''
                                }

                                <div
                                  class="gorev-durum ${durumClass}"
                                >
                                  ${durum}
                                </div>

                              </div>
                            `;
                          }
                        )
                        .join('');

                    return `
                      <td
                        class="ders-hucre"
                      >
                        ${gorevHtml}
                      </td>
                    `;
                  }
                )
                .join('');

            return `
              <tr>

                <td
                  class="gun-hucre"
                >
                  ${
                    GUN_ADLARI[
                      gun
                    ]
                  }
                </td>

                ${dersHucreleri}

              </tr>
            `;
          }
        ).join('');

      /* -----------------------------------------------
         TARİH
      ----------------------------------------------- */

      const bugununTarihi =
        new Date()
          .toLocaleDateString(
            'tr-TR',
            {
              day:
                'numeric',

              month:
                'long',

              year:
                'numeric',
            }
          );

      /* -----------------------------------------------
         PDF İÇERİĞİ
      ----------------------------------------------- */

      const pdfContent = `
        <style>

          * {
            box-sizing:
              border-box;
          }

          .pdf-page {
  width: 1050px;
  min-height: 700px;
  background: #FFFFFF;
  color: #111111;
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

          .ust-alan {

            display:
              flex;

            justify-content:
              space-between;

            align-items:
              flex-end;

            margin-bottom:
              13px;
          }

          .logo {

            color:
              #F97316;

            font-size:
              10px;

            font-weight:
              800;

            letter-spacing:
              1.5px;

            margin-bottom:
              4px;
          }

          .baslik {

            color:
              #111111;

            font-size:
              20px;

            font-weight:
              800;

            margin:
              0;
          }

          .alt-baslik {

            color:
              #666666;

            font-size:
              8px;

            margin-top:
              4px;
          }

          .tarih {

            color:
              #666666;

            font-size:
              8px;

            text-align:
              right;
          }

          .hafta-ozet {

            display:
              flex;

            gap:
              8px;

            margin-bottom:
              12px;
          }

          .ozet-kutu {

            background:
              #FFF7ED;

            border:
              1px solid #FED7AA;

            border-radius:
              5px;

            padding:
              6px 10px;

            font-size:
              8px;

            color:
              #9A3412;
          }

          .ozet-kutu strong {

            color:
              #202939;
          }

          table {

            width:
              100%;

            border-collapse:
              collapse;

            table-layout:
              fixed;

            border:
              1.2px solid #222222;
          }

          th,
          td {

            border:
              1px solid #222222;
          }

          .gun-baslik {

            width:
              78px;

            background:
              #F5F5F5;

            color:
              #111111;

            font-size:
              8px;

            font-weight:
              800;

            padding:
              7px 3px;

            text-align:
              center;
          }

          .ders-baslik {

            background:
              #F5F5F5;

            color:
              #111111;

            font-size:
              7px;

            font-weight:
              800;

            padding:
              7px 3px;

            text-align:
              center;
          }

          .gun-hucre {

            width:
              78px;

            background:
              #FAFAFA;

            color:
              #111111;

            font-size:
              7px;

            font-weight:
              800;

            text-align:
              center;

            vertical-align:
              middle;

            padding:
              6px 3px;
          }

          .ders-hucre {

            min-height:
              78px;

            height:
              78px;

            padding:
              4px;

            vertical-align:
              top;

            background:
              #FFFFFF;
          }

          .bos-hucre {

            background:
              #FFFFFF;
          }

          .gorev {

            padding:
              3px 2px
              5px 2px;

            margin-bottom:
              3px;

            border-bottom:
              1px dashed
              #D0D0D0;
          }

          .gorev:last-child {

            border-bottom:
              none;

            margin-bottom:
              0;
          }

          .sinav-turu {

            display:
              inline-block;

            color:
              #F97316;

            font-size:
              5.5px;

            font-weight:
              800;

            margin-bottom:
              2px;
          }

          .gorev-konu {

            color:
              #111111;

            font-size:
              6.7px;

            font-weight:
              700;

            line-height:
              1.25;
          }

          .gorev-saat {

            color:
              #777777;

            font-size:
              5.5px;

            margin-top:
              3px;
          }

          .gorev-durum {

            margin-top:
              4px;

            border-top:
              1px solid
              #E4E4E4;

            padding-top:
              3px;

            font-size:
              5.5px;

            text-align:
              center;

            font-weight:
              700;
          }

          .durum-bitti {

            color:
              #15803D;
          }

          .durum-anlamadim {

            color:
              #B91C1C;
          }

          .durum-yetismedi {

            color:
              #B45309;
          }

          .durum-yapilacak {

            color:
              #667085;
          }

          .footer {

            display:
              flex;

            justify-content:
              space-between;

            color:
              #9CA3AF;

            font-size:
              6px;

            margin-top:
              10px;
          }

        </style>

        <div
          class="pdf-page"
        >

          <div
            class="ust-alan"
          >

            <div>

              <div
                class="logo"
              >
                EĞİTİM KOÇUM
              </div>

              <h1
                class="baslik"
              >
                HAFTALIK ÇALIŞMA PROGRAMI
              </h1>

              <div
                class="alt-baslik"
              >
                Haftalık soru, konu ve çalışma planı
              </div>

            </div>

            <div
              class="tarih"
            >
              ${bugununTarihi}
            </div>

          </div>

          <div
            class="hafta-ozet"
          >

            <div
              class="ozet-kutu"
            >
              Toplam görev:
              <strong>
                ${haftalikToplam}
              </strong>
            </div>

            <div
              class="ozet-kutu"
            >
              Tamamlanan:
              <strong>
                ${haftalikBitti}
              </strong>
            </div>

            <div
              class="ozet-kutu"
            >
              İlerleme:
              <strong>
                %${haftalikYuzde}
              </strong>
            </div>

          </div>

          <table>

            <thead>

              <tr>

                <th
                  class="gun-baslik"
                >
                  Gün
                </th>

                ${dersBasliklari}

              </tr>

            </thead>

            <tbody>

              ${gunSatirlari}

            </tbody>

          </table>

          <div
            class="footer"
          >

            <span>
              Eğitim Koçum
            </span>

            <span>
              Kişiselleştirilmiş haftalık plan
            </span>

          </div>

        </div>
      `;

      /* -----------------------------------------------
         WEB
         Print penceresi AÇILMAZ.
         PDF direkt indirilir.
      ----------------------------------------------- */

      /* -----------------------------------------------
   WEB
   PDF direkt indirilir
----------------------------------------------- */

if (Platform.OS === 'web') {
        try {
          /*
            WEB'DE html2pdf/html2canvas KULLANMIYORUZ.
            PDF'yi doğrudan pdfmake ile çiziyoruz.
            Böylece boş/beyaz PDF sorunu ortadan kalkıyor.
          */

          // @ts-ignore
          const pdfMakeModule =
            await import('pdfmake/build/pdfmake');

          // @ts-ignore
          const pdfFontsModule =
            await import('pdfmake/build/vfs_fonts');

          const pdfMake: any =
            (pdfMakeModule as any).default ??
            pdfMakeModule;

          const pdfFonts: any =
            (pdfFontsModule as any).default ??
            pdfFontsModule;

          pdfMake.vfs =
            pdfFonts.vfs ??
            pdfFonts.pdfMake?.vfs;

          const tarihDosya =
            new Date()
              .toISOString()
              .slice(0, 10);

          const tabloBasliklari = [
            {
              text: 'Gün',
              style: 'tableHeader',
            },
            ...dersler.map(ders => ({
              text: ders,
              style: 'tableHeader',
            })),
          ];

          const tabloSatirlari =
            GUNLER.map(gun => {
              const gunGorevleri =
                program[gun] || [];

              const dersHucreleri =
                dersler.map(ders => {
                  const gorevler =
                    gunGorevleri.filter(
                      gorev =>
                        dersKolonu(
                          gorev.ders
                        ) === ders
                    );

                  if (
                    gorevler.length ===
                    0
                  ) {
                    return {
                      text: '',
                    };
                  }

                  const satirlar =
                    gorevler.map(
                      gorev => {
                        const tur =
                          sinavTuru(
                            gorev.ders
                          );

                        const saat =
                          gorev.saat ===
                          '—'
                            ? ''
                            : `\n${gorev.saat}`;

                        const durum =
                          durumPdfMetni(
                            gorev.durum
                          );

                        return {
                          stack: [
                            tur
                              ? {
                                  text: tur,
                                  color:
                                    '#F97316',
                                  bold: true,
                                  fontSize:
                                    5.5,
                                  margin: [
                                    0,
                                    0,
                                    0,
                                    2,
                                  ],
                                }
                              : {
                                  text: '',
                                  fontSize: 1,
                                },

                            {
                              text:
                                gorev.konu,
                              bold: true,
                              color:
                                '#202939',
                              fontSize:
                                6.4,
                              lineHeight:
                                1.1,
                            },

                            saat
                              ? {
                                  text:
                                    gorev.saat,
                                  color:
                                    '#667085',
                                  fontSize:
                                    5.4,
                                  margin: [
                                    0,
                                    3,
                                    0,
                                    0,
                                  ],
                                }
                              : {
                                  text: '',
                                  fontSize: 1,
                                },

                            {
                              text:
                                durum,
                              color:
                                gorev.durum ===
                                'bitti'
                                  ? '#15803D'
                                  : gorev.durum ===
                                    'anlamadim'
                                  ? '#B91C1C'
                                  : gorev.durum ===
                                    'yetismedi'
                                  ? '#B45309'
                                  : '#667085',
                              fontSize:
                                5.3,
                              bold: true,
                              margin: [
                                0,
                                3,
                                0,
                                4,
                              ],
                            },
                          ],
                          margin: [
                            0,
                            0,
                            0,
                            3,
                          ],
                        };
                      }
                    );

                  return {
                    stack:
                      satirlar,
                  };
                });

              return [
                {
                  text:
                    GUN_ADLARI[
                      gun
                    ],
                  bold: true,
                  alignment:
                    'center',
                  color:
                    '#202939',
                  fontSize:
                    6.5,
                  fillColor:
                    '#FAFAFA',
                  margin: [
                    0,
                    6,
                    0,
                    6,
                  ],
                },

                ...dersHucreleri,
              ];
            });

          const docDefinition: any = {
            pageSize: 'A4',

            pageOrientation:
              'landscape',

            pageMargins: [
              20,
              20,
              20,
              20,
            ],

            defaultStyle: {
              fontSize: 6,
              color:
                '#202939',
            },

            content: [
              {
                columns: [
                  {
                    width: '*',
                    stack: [
                      {
                        text:
                          'EĞİTİM KOÇUM',
                        color:
                          '#F97316',
                        bold: true,
                        fontSize:
                          9,
                        characterSpacing:
                          1.2,
                      },

                      {
                        text:
                          'HAFTALIK ÇALIŞMA PROGRAMI',
                        bold: true,
                        fontSize:
                          18,
                        margin: [
                          0,
                          4,
                          0,
                          2,
                        ],
                      },

                      {
                        text:
                          'Haftalık soru, konu ve çalışma planı',
                        color:
                          '#667085',
                        fontSize:
                          7,
                      },
                    ],
                  },

                  {
                    width: 'auto',
                    text:
                      bugununTarihi,
                    alignment:
                      'right',
                    color:
                      '#667085',
                    fontSize:
                      7,
                    margin: [
                      0,
                      4,
                      0,
                      0,
                    ],
                  },
                ],
              },

              {
                columns: [
                  {
                    text:
                      `Toplam görev: ${haftalikToplam}`,
                    style:
                      'summaryBox',
                  },

                  {
                    text:
                      `Tamamlanan: ${haftalikBitti}`,
                    style:
                      'summaryBox',
                  },

                  {
                    text:
                      `İlerleme: %${haftalikYuzde}`,
                    style:
                      'summaryBox',
                  },
                ],

                columnGap: 6,

                margin: [
                  0,
                  12,
                  0,
                  12,
                ],
              },

              {
                table: {
                  headerRows: 1,

                  widths: [
                    52,
                    ...dersler.map(
                      () => '*'
                    ),
                  ],

                  body: [
                    tabloBasliklari,
                    ...tabloSatirlari,
                  ],
                },

                layout: {
                  hLineWidth: () =>
                    0.7,

                  vLineWidth: () =>
                    0.7,

                  hLineColor: () =>
                    '#2F3540',

                  vLineColor: () =>
                    '#2F3540',

                  paddingLeft: () =>
                    4,

                  paddingRight: () =>
                    4,

                  paddingTop: () =>
                    4,

                  paddingBottom: () =>
                    4,
                },
              },

              {
                columns: [
                  {
                    text:
                      'Eğitim Koçum',
                  },

                  {
                    text:
                      'Kişiselleştirilmiş haftalık plan',
                    alignment:
                      'right',
                  },
                ],

                color:
                  '#98A2B3',

                fontSize: 5.5,

                margin: [
                  0,
                  8,
                  0,
                  0,
                ],
              },
            ],

            styles: {
              tableHeader: {
                bold: true,
                fontSize: 6.3,
                color:
                  '#7C2D12',
                fillColor:
                  '#FFF7ED',
                alignment:
                  'center',
                margin: [
                  0,
                  3,
                  0,
                  3,
                ],
              },

              summaryBox: {
                bold: true,
                fontSize: 7,
                color:
                  '#9A3412',
                fillColor:
                  '#FFF7ED',
                margin: [
                  7,
                  6,
                  7,
                  6,
                ],
              },
            },
          };

          pdfMake
            .createPdf(
              docDefinition
            )
            .download(
              `Egitim-Kocum-Haftalik-Program-${tarihDosya}.pdf`
            );

        } catch (error) {
          console.log(
            'Web PDF hatası:',
            error
          );

          Alert.alert(
            'PDF oluşturulamadı',
            'Web PDF hazırlanırken bir sorun oluştu.'
          );
        }

        return;
      }

      /* -----------------------------------------------
         iPHONE / ANDROID
      ----------------------------------------------- */

      const html = `
        <!DOCTYPE html>

        <html lang="tr">

          <head>

            <meta
              charset="UTF-8"
            />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

          </head>

          <body>

            ${pdfContent}

          </body>

        </html>
      `;

      const {
        uri,
      } =
        await Print.printToFileAsync(
          {
            html,
          }
        );

      const paylasimVar =
        await Sharing.isAvailableAsync();

      if (
        paylasimVar
      ) {

        await Sharing.shareAsync(
          uri,
          {
            mimeType:
              'application/pdf',

            dialogTitle:
              'Programımı Kaydet',

            UTI:
              'com.adobe.pdf',
          }
        );

      } else {

        Alert.alert(
          'PDF hazır',
          'Programın PDF olarak oluşturuldu.'
        );

      }

    } catch (
      error
    ) {

      console.log(
        'PDF oluşturma hatası:',
        error
      );

      Alert.alert(
        'PDF oluşturulamadı',
        'Lütfen tekrar dene.'
      );
    }
  };
  const liste: Gorev[] =
    aktifListe === 'yapilacak'
      ? yapilacaklar
      : tamamlananlar;

  const gelecekHaftalar =
    gelecekHaftalariOlustur(
      program
    );

  const seciliGecmisAy =
    GECMIS_AYLAR.find(
      ay =>
        ay.id === aktifGecmisAy
    ) ?? GECMIS_AYLAR[0];

  return (
    <SafeAreaView
      style={s.container}
    >

      <StatusBar
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          s.scroll
        }
      >

        {/* HEADER */}

        <View style={s.header}>

          <View>

            <Text style={s.headerMini}>
              ÇALIŞMA PROGRAMIN
            </Text>

            <Text
              style={s.headerBaslik}
            >
              Haftalık Plan
            </Text>

            <Text style={s.headerAlt}>
              Hedeflerini takip et,
              ilerlemeni gör.
            </Text>

          </View>

          <View style={s.headerIcon}>

            <Ionicons
              name="calendar-outline"
              size={24}
              color="#F97316"
            />

          </View>

        </View>

        {/* HAFTALIK ÖZET */}

        <View style={s.ozetKart}>

          <View style={s.ozetUst}>

            <View>

              <Text
                style={s.ozetLabel}
              >
                BU HAFTA
              </Text>

              <Text
                style={s.ozetBaslik}
              >
                {haftalikBitti}/
                {haftalikToplam}{' '}
                görev tamamlandı
              </Text>

            </View>

            <View
              style={s.yuzdeKutusu}
            >
              <Text
                style={s.yuzdeText}
              >
                %{haftalikYuzde}
              </Text>
            </View>

          </View>

          <View
            style={s.progressTrack}
          >

            <View
              style={[
                s.progressFill,
                {
                  width:
                    `${haftalikYuzde}%`,
                },
              ]}
            />

          </View>

          <Text style={s.ozetAlt}>

            {haftalikToplam === 0
              ? 'Bu hafta için henüz görev oluşturulmadı.'
              : haftalikYuzde ===
                100
              ? '🎉 Haftalık programını tamamladın!'
              : `🔥 ${
                  haftalikToplam -
                  haftalikBitti
                } görev daha seni bekliyor.`}

          </Text>

        </View>

        {/* PDF */}

        <TouchableOpacity
          style={s.pdfKart}
          activeOpacity={0.85}
          onPress={programiPdfYap}
        >

          <View style={s.pdfIcon}>

            <Ionicons
              name="document-text-outline"
              size={22}
              color="#F97316"
            />

          </View>

          <View
            style={{ flex: 1 }}
          >

            <Text
              style={s.pdfBaslik}
            >
              Programı PDF Olarak Kaydet
            </Text>

            <Text
              style={s.pdfAlt}
            >
              Haftalık programını
              kaydet veya paylaş
            </Text>

          </View>

          <View
            style={
              s.pdfDownloadIcon
            }
          >

            <Ionicons
              name="download-outline"
              size={19}
              color="#F97316"
            />

          </View>

        </TouchableOpacity>

        {/* GÜNLER */}

        <View
          style={s.sectionHeader}
        >

          <Text
            style={s.sectionTitle}
          >
            Günler
          </Text>

          <Text
            style={s.sectionSub}
          >
            Bir gün seç
          </Text>

        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            s.gunRow
          }
        >

          {GUNLER.map(gun => {

            const gorevSayisi =
              program[gun]?.length ??
              0;

            const biten =
              program[
                gun
              ]?.filter(
                gorev =>
                  gorev.durum ===
                  'bitti'
              ).length ?? 0;

            const aktif =
              gun === aktifGun;

            const bugunMu =
              gun === bugun;

            return (

              <TouchableOpacity
                key={gun}
                style={[
                  s.gunKart,
                  aktif &&
                    s.gunKartAktif,
                ]}
                onPress={() =>
                  setAktifGun(gun)
                }
              >

                {bugunMu && (

                  <Text
                    style={[
                      s.bugunLabel,

                      aktif &&
                        s.bugunLabelAktif,
                    ]}
                  >
                    BUGÜN
                  </Text>

                )}

                <Text
                  style={[
                    s.gunAdi,

                    aktif &&
                      s.gunAdiAktif,
                  ]}
                >
                  {
                    GUN_ADLARI[
                      gun
                    ]
                  }
                </Text>

                <Text
                  style={[
                    s.gunGorevSayisi,

                    aktif &&
                      s.gunGorevSayisiAktif,
                  ]}
                >
                  {biten}/
                  {gorevSayisi}
                </Text>

                <View
                  style={[
                    s.gunNokta,

                    aktif &&
                      s.gunNoktaAktif,
                  ]}
                />

              </TouchableOpacity>

            );
          })}

        </ScrollView>

        {/* GÜNLÜK ÖZET */}

        <View
          style={s.gunlukOzet}
        >

          <View>

            <Text
              style={s.gunlukBaslik}
            >
              {
                GUN_ADLARI[
                  aktifGun
                ]
              }{' '}
              Programı
            </Text>

            <Text
              style={s.gunlukAlt}
            >
              {gunBitti}/
              {gunToplam}{' '}
              görev tamamlandı
            </Text>

          </View>

          <View
            style={
              s.gunlukYuzdeKutusu
            }
          >

            <Text
              style={s.gunlukYuzde}
            >
              %{gunYuzde}
            </Text>

          </View>

        </View>

        {/* TAB */}

        <View
          style={s.tabContainer}
        >

          <TouchableOpacity
            style={[
              s.tab,

              aktifListe ===
                'yapilacak' &&
                s.tabAktif,
            ]}
            onPress={() =>
              setAktifListe(
                'yapilacak'
              )
            }
          >

            <Text
              style={[
                s.tabText,

                aktifListe ===
                  'yapilacak' &&
                  s.tabTextAktif,
              ]}
            >
              Yapılacaklar
            </Text>

            <View
              style={[
                s.tabCount,

                aktifListe ===
                  'yapilacak' &&
                  s.tabCountAktif,
              ]}
            >

              <Text
                style={[
                  s.tabCountText,

                  aktifListe ===
                    'yapilacak' &&
                    s.tabCountTextAktif,
                ]}
              >
                {yapilacaklar.length}
              </Text>

            </View>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              s.tab,

              aktifListe ===
                'tamamlanan' &&
                s.tabAktif,
            ]}
            onPress={() =>
              setAktifListe(
                'tamamlanan'
              )
            }
          >

            <Text
              style={[
                s.tabText,

                aktifListe ===
                  'tamamlanan' &&
                  s.tabTextAktif,
              ]}
            >
              Tamamlananlar
            </Text>

            <View
              style={[
                s.tabCount,

                aktifListe ===
                  'tamamlanan' &&
                  s.tabCountAktif,
              ]}
            >

              <Text
                style={[
                  s.tabCountText,

                  aktifListe ===
                    'tamamlanan' &&
                    s.tabCountTextAktif,
                ]}
              >
                {
                  tamamlananlar.length
                }
              </Text>

            </View>

          </TouchableOpacity>

        </View>

        {/* GÖREV YOK */}

        {liste.length === 0 && (

          <View style={s.emptyCard}>

            <View style={s.emptyIcon}>

              <Ionicons
                name={
                  aktifListe ===
                  'tamamlanan'
                    ? 'trophy-outline'
                    : 'checkmark-done-outline'
                }
                size={29}
                color="#F97316"
              />

            </View>

            <Text
              style={s.emptyTitle}
            >
              {aktifListe ===
              'yapilacak'
                ? 'Görev kalmadı!'
                : 'Henüz tamamlanan görev yok'}
            </Text>

            <Text
              style={s.emptyText}
            >
              {aktifListe ===
              'yapilacak'
                ? 'Bugünün planını tamamladın.'
                : 'Bir görevi bitirdiğinde burada görünecek.'}
            </Text>

          </View>

        )}

        {/* GÖREVLER */}

        {liste.map(
          (
            gorev,
            index
          ) => (

            <View
              key={gorev.id}
              style={s.gorevKart}
            >

              <View
                style={
                  s.gorevTopRow
                }
              >

                <View
                  style={s.dersIcon}
                >

                  <Ionicons
                    name="book-outline"
                    size={20}
                    color="#F97316"
                  />

                </View>

                <View
                  style={
                    s.gorevBilgi
                  }
                >

                  <View
                    style={s.dersRow}
                  >

                    <Text
                      style={
                        s.gorevDers
                      }
                    >
                      {gorev.ders}
                    </Text>

                    <Text
                      style={
                        s.gorevNo
                      }
                    >
                      #{index + 1}
                    </Text>

                  </View>

                  <Text
                    style={
                      s.gorevKonu
                    }
                  >
                    {gorev.konu}
                  </Text>

                  {gorev.saat !==
                    '—' && (

                    <View
                      style={
                        s.saatRow
                      }
                    >

                      <Ionicons
                        name="time-outline"
                        size={12}
                        color="#98A2B3"
                      />

                      <Text
                        style={
                          s.saatYazi
                        }
                      >
                        {
                          gorev.saat
                        }
                      </Text>

                    </View>

                  )}

                </View>

              </View>

              {aktifListe ===
              'yapilacak' ? (

                <View
                  style={
                    s.durumButtons
                  }
                >

                  <TouchableOpacity
                    style={[
                      s.durumBtn,

                      durumSeciliMi(
                        gorev,
                        'anlamadim'
                      ) &&
                        s.anlamadimAktif,
                    ]}
                    onPress={() =>
                      durumDegistir(
                        gorev.id,

                        gorev.durum ===
                          'anlamadim'
                          ? 'yapilacak'
                          : 'anlamadim'
                      )
                    }
                  >

                    <Ionicons
                      name="help-circle-outline"
                      size={14}
                      color={
                        durumSeciliMi(
                          gorev,
                          'anlamadim'
                        )
                          ? '#C84B4B'
                          : '#667085'
                      }
                    />

                    <Text
                      style={[
                        s.durumBtnText,

                        durumSeciliMi(
                          gorev,
                          'anlamadim'
                        ) && {
                          color:
                            '#C84B4B',
                        },
                      ]}
                    >
                      Anlamadım
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      s.durumBtn,

                      durumSeciliMi(
                        gorev,
                        'yetismedi'
                      ) &&
                        s.yetismediAktif,
                    ]}
                    onPress={() =>
                      durumDegistir(
                        gorev.id,

                        gorev.durum ===
                          'yetismedi'
                          ? 'yapilacak'
                          : 'yetismedi'
                      )
                    }
                  >

                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={
                        durumSeciliMi(
                          gorev,
                          'yetismedi'
                        )
                          ? '#B76C17'
                          : '#667085'
                      }
                    />

                    <Text
                      style={[
                        s.durumBtnText,

                        durumSeciliMi(
                          gorev,
                          'yetismedi'
                        ) && {
                          color:
                            '#B76C17',
                        },
                      ]}
                    >
                      Yetişmedi
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      s.durumBtn
                    }
                    onPress={() =>
                      durumDegistir(
                        gorev.id,
                        'bitti'
                      )
                    }
                  >

                    <Ionicons
                      name="checkmark-circle-outline"
                      size={14}
                      color="#667085"
                    />

                    <Text
                      style={
                        s.durumBtnText
                      }
                    >
                      Bitti
                    </Text>

                  </TouchableOpacity>

                </View>

              ) : (

                <View
                  style={
                    s.tamamlandiRow
                  }
                >

                  <View
                    style={
                      s.tamamlandiBadge
                    }
                  >

                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#13845B"
                    />

                    <Text
                      style={
                        s.tamamlandiText
                      }
                    >
                      Tamamlandı
                    </Text>

                  </View>

                  <TouchableOpacity
                    style={
                      s.geriAlBtn
                    }
                    onPress={() =>
                      durumDegistir(
                        gorev.id,
                        'yapilacak'
                      )
                    }
                  >

                    <Ionicons
                      name="arrow-undo-outline"
                      size={13}
                      color="#667085"
                    />

                    <Text
                      style={
                        s.geriAlText
                      }
                    >
                      Geri al
                    </Text>

                  </TouchableOpacity>

                </View>

              )}

            </View>

          )
        )}

        {/* ======================================================
            GELECEK PROGRAMLAR
        ====================================================== */}

        <View
          style={s.gelecekHeader}
        >

          <View>

            <Text
              style={s.sectionTitle}
            >
              Gelecek Programlar
            </Text>

            <Text
              style={s.sectionSub}
            >
              Sadece bu ayın kalan
              haftalarını görüntüleyebilirsin
            </Text>

          </View>

          <View
            style={
              s.gelecekHeaderIcon
            }
          >

            <Ionicons
              name="calendar-outline"
              size={19}
              color="#4776E6"
            />

          </View>

        </View>

        {gelecekHaftalar.length ===
        0 ? (

          <View
            style={
              s.gelecekBosKart
            }
          >

            <View
              style={
                s.gelecekBosIcon
              }
            >

              <Ionicons
                name="calendar-clear-outline"
                size={25}
                color="#4776E6"
              />

            </View>

            <Text
              style={
                s.gelecekBosBaslik
              }
            >
              Bu ay için başka program yok
            </Text>

            <Text
              style={
                s.gelecekBosText
              }
            >
              Yeni ay başladığında o aya ait
              gelecek programlar burada görünecek.
            </Text>

          </View>

        ) : (

          gelecekHaftalar.map(
            hafta => {

              const acik =
                acikGelecekHafta ===
                hafta.id;

              const toplamGorev =
                hafta.gunler.reduce(
                  (
                    toplam,
                    gun
                  ) =>
                    toplam +
                    gun.gorevler.length,
                  0
                );

              return (

                <View
                  key={hafta.id}
                  style={
                    s.gelecekHaftaKart
                  }
                >

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                      setAcikGelecekHafta(
                        acik
                          ? null
                          : hafta.id
                      )
                    }
                  >

                    <View
                      style={
                        s.gelecekHaftaUst
                      }
                    >

                      <View
                        style={
                          s.gelecekTakvimIcon
                        }
                      >

                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color="#4776E6"
                        />

                      </View>

                      <View
                        style={{
                          flex: 1,
                        }}
                      >

                        <Text
                          style={
                            s.gelecekHaftaTarih
                          }
                        >
                          {
                            hafta.tarihAraligi
                          }
                        </Text>

                        <Text
                          style={
                            s.gelecekHaftaAlt
                          }
                        >
                          {toplamGorev}{' '}
                          görev planlandı
                        </Text>

                      </View>

                      <View
                        style={
                          s.gelecekAcIkon
                        }
                      >

                        <Ionicons
                          name={
                            acik
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={17}
                          color="#4776E6"
                        />

                      </View>

                    </View>

                  </TouchableOpacity>

                  {acik && (

                    <View
                      style={
                        s.gelecekDetay
                      }
                    >

                      {hafta.gunler.map(
                        gunBilgisi => (

                          <View
                            key={
                              `${hafta.id}-${gunBilgisi.gun}`
                            }
                            style={
                              s.gelecekGunBolum
                            }
                          >

                            <View
                              style={
                                s.gelecekGunUst
                              }
                            >

                              <Text
                                style={
                                  s.gelecekGunBaslik
                                }
                              >
                                {
                                  GUN_ADLARI[
                                    gunBilgisi.gun
                                  ]
                                }
                              </Text>

                              <Text
                                style={
                                  s.gelecekGunTarih
                                }
                              >
                                {
                                  gunBilgisi.tarihEtiketi
                                }
                              </Text>

                            </View>

                            {gunBilgisi.gorevler.length ===
                            0 ? (

                              <Text
                                style={
                                  s.gelecekGorevYok
                                }
                              >
                                Bu gün için görev yok
                              </Text>

                            ) : (

                              gunBilgisi.gorevler.map(
                                gorev => (

                                  <View
                                    key={
                                      gorev.id
                                    }
                                    style={
                                      s.gelecekGorev
                                    }
                                  >

                                    <View
                                      style={
                                        s.gelecekGorevIcon
                                      }
                                    >

                                      <Ionicons
                                        name="book-outline"
                                        size={14}
                                        color="#4776E6"
                                      />

                                    </View>

                                    <View
                                      style={{
                                        flex: 1,
                                      }}
                                    >

                                      <Text
                                        style={
                                          s.gelecekGorevDers
                                        }
                                      >
                                        {
                                          gorev.ders
                                        }
                                      </Text>

                                      <Text
                                        style={
                                          s.gelecekGorevKonu
                                        }
                                      >
                                        {
                                          gorev.konu
                                        }
                                      </Text>

                                    </View>

                                    {gorev.saat !==
                                      '—' && (

                                      <View
                                        style={
                                          s.gelecekSaatBadge
                                        }
                                      >

                                        <Ionicons
                                          name="time-outline"
                                          size={11}
                                          color="#4776E6"
                                        />

                                        <Text
                                          style={
                                            s.gelecekSaatText
                                          }
                                        >
                                          {
                                            gorev.saat
                                          }
                                        </Text>

                                      </View>

                                    )}

                                  </View>

                                )
                              )

                            )}

                          </View>

                        )
                      )}

                      <View
                        style={
                          s.aySiniriBilgi
                        }
                      >

                        <Ionicons
                          name="information-circle-outline"
                          size={14}
                          color="#667085"
                        />

                        <Text
                          style={
                            s.aySiniriText
                          }
                        >
                          Sonraki aya ait günler,
                          yeni ay başlayana kadar gösterilmez.
                        </Text>

                      </View>

                    </View>

                  )}

                </View>

              );
            }
          )

        )}

        {/* ======================================================
            GEÇMİŞ PROGRAMLAR
        ====================================================== */}

        <View
          style={s.gecmisHeader}
        >

          <View>

            <Text
              style={s.sectionTitle}
            >
              Geçmiş Programlar
            </Text>

            <Text
              style={s.sectionSub}
            >
              Önceki aylardaki
              çalışma planlarını incele
            </Text>

          </View>

          <View
            style={
              s.historyIcon
            }
          >
            <Ionicons
              name="time-outline"
              size={19}
              color="#F97316"
            />
          </View>

        </View>

        {/* AY SEÇİCİ */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            s.ayRow
          }
        >

          {GECMIS_AYLAR.map(
            ay => {

              const aktif =
                ay.id ===
                aktifGecmisAy;

              return (

                <TouchableOpacity
                  key={ay.id}
                  style={[
                    s.ayButton,

                    aktif &&
                      s.ayButtonAktif,
                  ]}
                  onPress={() => {
                    setAktifGecmisAy(
                      ay.id
                    );

                    setAcikGecmisHafta(
                      null
                    );
                  }}
                >

                  <Text
                    style={[
                      s.ayButtonText,

                      aktif &&
                        s.ayButtonTextAktif,
                    ]}
                  >
                    {ay.baslik}
                  </Text>

                </TouchableOpacity>

              );
            }
          )}

        </ScrollView>

        {/* AYIN HAFTALARI */}

        {seciliGecmisAy.haftalar.map(
          hafta => {

            const tumGorevler =
              GUNLER.flatMap(
                gun =>
                  hafta.program[
                    gun
                  ] || []
              );

            const toplam =
              tumGorevler.length;

            const biten =
              tumGorevler.filter(
                gorev =>
                  gorev.durum ===
                  'bitti'
              ).length;

            const yuzde =
              toplam > 0
                ? Math.round(
                    (biten /
                      toplam) *
                      100
                  )
                : 0;

            const acik =
              acikGecmisHafta ===
              hafta.id;

            return (

              <View
                key={hafta.id}
                style={
                  s.gecmisHaftaKart
                }
              >

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    setAcikGecmisHafta(
                      acik
                        ? null
                        : hafta.id
                    )
                  }
                >

                  <View
                    style={
                      s.gecmisHaftaUst
                    }
                  >

                    <View>

                      <Text
                        style={
                          s.gecmisHaftaTarih
                        }
                      >
                        {
                          hafta.tarihAraligi
                        }
                      </Text>

                      <Text
                        style={
                          s.gecmisHaftaAlt
                        }
                      >
                        {biten}/{toplam}{' '}
                        görev tamamlandı
                      </Text>

                    </View>

                    <View
                      style={
                        s.gecmisYuzde
                      }
                    >

                      <Text
                        style={
                          s.gecmisYuzdeText
                        }
                      >
                        %{yuzde}
                      </Text>

                    </View>

                  </View>

                  <View
                    style={
                      s.gecmisProgress
                    }
                  >

                    <View
                      style={[
                        s.gecmisProgressFill,

                        {
                          width:
                            `${yuzde}%`,
                        },
                      ]}
                    />

                  </View>

                  <View
                    style={
                      s.gecmisAcButton
                    }
                  >

                    <Text
                      style={
                        s.gecmisAcText
                      }
                    >
                      {acik
                        ? 'Programı Kapat'
                        : 'Programı Gör'}
                    </Text>

                    <Ionicons
                      name={
                        acik
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={15}
                      color="#F97316"
                    />

                  </View>

                </TouchableOpacity>

                {/* GEÇMİŞ HAFTA DETAY */}

                {acik && (

                  <View
                    style={
                      s.gecmisDetay
                    }
                  >

                    {GUNLER.map(
                      gun => {

                        const gununGorevleri =
                          hafta.program[
                            gun
                          ] || [];

                        return (

                          <View
                            key={gun}
                            style={
                              s.gecmisGunBolum
                            }
                          >

                            <Text
                              style={
                                s.gecmisGunBaslik
                              }
                            >
                              {
                                GUN_ADLARI[
                                  gun
                                ]
                              }
                            </Text>

                            {gununGorevleri.length ===
                            0 ? (

                              <Text
                                style={
                                  s.gecmisBos
                                }
                              >
                                Görev yok
                              </Text>

                            ) : (

                              gununGorevleri.map(
                                gorev => (

                                  <View
                                    key={
                                      gorev.id
                                    }
                                    style={
                                      s.gecmisGorev
                                    }
                                  >

                                    <View
                                      style={
                                        s.gecmisGorevIcon
                                      }
                                    >

                                      <Ionicons
                                        name="book-outline"
                                        size={14}
                                        color="#F97316"
                                      />

                                    </View>

                                    <View
                                      style={{
                                        flex: 1,
                                      }}
                                    >

                                      <Text
                                        style={
                                          s.gecmisGorevDers
                                        }
                                      >
                                        {
                                          gorev.ders
                                        }
                                      </Text>

                                      <Text
                                        style={
                                          s.gecmisGorevKonu
                                        }
                                      >
                                        {
                                          gorev.konu
                                        }
                                      </Text>

                                    </View>

                                    {gorev.durum ===
                                    'bitti' ? (

                                      <Ionicons
                                        name="checkmark-circle"
                                        size={17}
                                        color="#18A66A"
                                      />

                                    ) : (

                                      <Ionicons
                                        name="ellipse-outline"
                                        size={17}
                                        color="#C5CAD1"
                                      />

                                    )}

                                  </View>

                                )
                              )

                            )}

                          </View>

                        );
                      }
                    )}

                  </View>

                )}

              </View>

            );
          }
        )}

      </ScrollView>

    </SafeAreaView>
  );
}

/* ============================================================
   STYLES
============================================================ */

const s = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },

  scroll: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  headerMini: {
    color: '#F97316',
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: '900',
  },

  headerBaslik: {
    color: '#202939',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 3,
  },

  headerAlt: {
    color: '#98A2B3',
    fontSize: 11,
    marginTop: 3,
  },

  headerIcon: {
    width: 53,
    height: 53,
    borderRadius: 18,
    backgroundColor: '#FFF1E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ozetKart: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0EFED',
  },

  ozetUst: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  ozetLabel: {
    color: '#18A66A',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  ozetBaslik: {
    color: '#202939',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 4,
  },

  yuzdeKutusu: {
    backgroundColor: '#E7F8F0',
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  yuzdeText: {
    color: '#13845B',
    fontSize: 13,
    fontWeight: '900',
  },

  progressTrack: {
    backgroundColor: '#EEF1F4',
    height: 7,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 15,
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#18A66A',
  },

  ozetAlt: {
    color: '#667085',
    fontSize: 10,
    marginTop: 9,
  },

  pdfKart: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E7',
    borderRadius: 19,
    padding: 14,
    marginBottom: 24,
  },

  pdfIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  pdfBaslik: {
    color: '#202939',
    fontSize: 12,
    fontWeight: '900',
  },

  pdfAlt: {
    color: '#667085',
    fontSize: 10,
    marginTop: 2,
  },

  pdfDownloadIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },

  sectionTitle: {
    color: '#202939',
    fontSize: 18,
    fontWeight: '900',
  },

  sectionSub: {
    color: '#98A2B3',
    fontSize: 10,
    marginTop: 2,
  },

  gunRow: {
    gap: 8,
    paddingRight: 18,
    marginBottom: 21,
  },

  // Tam gün isimleri için genişlettik.
  gunKart: {
    width: 96,
    height: 83,
    borderRadius: 18,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEEDEB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gunKartAktif: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },

  bugunLabel: {
    color: '#F97316',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  bugunLabelAktif: {
    color:
      'rgba(255,255,255,0.75)',
  },

  gunAdi: {
    color: '#667085',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },

  gunAdiAktif: {
    color: '#FFF',
  },

  gunGorevSayisi: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 5,
  },

  gunGorevSayisiAktif: {
    color: '#FFF',
  },

  gunNokta: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E5E9',
    marginTop: 5,
  },

  gunNoktaAktif: {
    backgroundColor: '#FFF',
  },

  gunlukOzet: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },

  gunlukBaslik: {
    color: '#202939',
    fontSize: 17,
    fontWeight: '900',
  },

  gunlukAlt: {
    color: '#98A2B3',
    fontSize: 10,
    marginTop: 2,
  },

  gunlukYuzdeKutusu: {
    backgroundColor: '#FFF1E7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 11,
  },

  gunlukYuzde: {
    color: '#F97316',
    fontSize: 11,
    fontWeight: '900',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFEEEB',
    borderRadius: 16,
    padding: 4,
    marginBottom: 14,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 13,
  },

  tabAktif: {
    backgroundColor: '#FFF',
  },

  tabText: {
    color: '#98A2B3',
    fontSize: 11,
    fontWeight: '700',
  },

  tabTextAktif: {
    color: '#202939',
    fontWeight: '900',
  },

  tabCount: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDBD7',
  },

  tabCountAktif: {
    backgroundColor: '#FFF1E7',
  },

  tabCountText: {
    color: '#667085',
    fontSize: 8,
    fontWeight: '800',
  },

  tabCountTextAktif: {
    color: '#F97316',
  },

  gorevKart: {
    backgroundColor: '#FFF',
    borderRadius: 19,
    padding: 15,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#F0EFED',
  },

  gorevTopRow: {
    flexDirection: 'row',
  },

  dersIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF1E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  gorevBilgi: {
    flex: 1,
  },

  dersRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  gorevDers: {
    color: '#202939',
    fontSize: 14,
    fontWeight: '900',
  },

  gorevNo: {
    color: '#C5CAD1',
    fontSize: 9,
    fontWeight: '700',
  },

  gorevKonu: {
    color: '#667085',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  saatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 7,
  },

  saatYazi: {
    color: '#98A2B3',
    fontSize: 9,
  },

  durumButtons: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 14,
  },

  durumBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F5F6F7',
  },

  durumBtnText: {
    color: '#667085',
    fontSize: 9,
    fontWeight: '800',
  },

  anlamadimAktif: {
    backgroundColor: '#FFE8E8',
  },

  yetismediAktif: {
    backgroundColor: '#FFF1D8',
  },

  tamamlandiRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop: 13,
  },

  tamamlandiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E7F8F0',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 11,
  },

  tamamlandiText: {
    color: '#13845B',
    fontSize: 9,
    fontWeight: '800',
  },

  geriAlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },

  geriAlText: {
    color: '#667085',
    fontSize: 9,
    fontWeight: '700',
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 28,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#F0EFED',
  },

  emptyIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFF1E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 9,
  },

  emptyText: {
    color: '#98A2B3',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },

  /* GELECEK PROGRAMLAR */

  gelecekHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 14,
  },

  gelecekHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#EEF3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gelecekBosKart: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E4EAF7',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 10,
  },

  gelecekBosIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#EEF3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gelecekBosBaslik: {
    color: '#202939',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 9,
  },

  gelecekBosText: {
    color: '#98A2B3',
    fontSize: 9,
    lineHeight: 13,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 260,
  },

  gelecekHaftaKart: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E4EAF7',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },

  gelecekHaftaUst: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  gelecekTakvimIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: '#EEF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  gelecekHaftaTarih: {
    color: '#202939',
    fontSize: 12,
    fontWeight: '900',
  },

  gelecekHaftaAlt: {
    color: '#98A2B3',
    fontSize: 9,
    marginTop: 3,
  },

  gelecekAcIkon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: '#F5F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gelecekDetay: {
    borderTopWidth: 1,
    borderTopColor: '#EEF1F4',
    marginTop: 13,
    paddingTop: 5,
  },

  gelecekGunBolum: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },

  gelecekGunUst: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },

  gelecekGunBaslik: {
    color: '#202939',
    fontSize: 11,
    fontWeight: '900',
  },

  gelecekGunTarih: {
    color: '#4776E6',
    fontSize: 8,
    fontWeight: '800',
  },

  gelecekGorevYok: {
    color: '#B4BBC5',
    fontSize: 9,
  },

  gelecekGorev: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  gelecekGorevIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#EEF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  gelecekGorevDers: {
    color: '#202939',
    fontSize: 10,
    fontWeight: '800',
  },

  gelecekGorevKonu: {
    color: '#98A2B3',
    fontSize: 9,
    marginTop: 1,
  },

  gelecekSaatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EEF3FF',
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  gelecekSaatText: {
    color: '#4776E6',
    fontSize: 8,
    fontWeight: '800',
  },

  aySiniriBilgi: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F7F7F6',
    borderRadius: 11,
    padding: 9,
    marginTop: 10,
  },

  aySiniriText: {
    flex: 1,
    color: '#667085',
    fontSize: 8,
    lineHeight: 12,
  },

  /* GEÇMİŞ PROGRAMLAR */

  gecmisHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 14,
  },

  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#FFF1E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ayRow: {
    gap: 8,
    paddingRight: 20,
    marginBottom: 14,
  },

  ayButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEEDEB',
  },

  ayButtonAktif: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },

  ayButtonText: {
    color: '#667085',
    fontSize: 10,
    fontWeight: '800',
  },

  ayButtonTextAktif: {
    color: '#FFF',
  },

  gecmisHaftaKart: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0EFED',
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
  },

  gecmisHaftaUst: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  gecmisHaftaTarih: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
  },

  gecmisHaftaAlt: {
    color: '#98A2B3',
    fontSize: 9,
    marginTop: 3,
  },

  gecmisYuzde: {
    backgroundColor: '#E7F8F0',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 11,
  },

  gecmisYuzdeText: {
    color: '#13845B',
    fontSize: 10,
    fontWeight: '900',
  },

  gecmisProgress: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#EEF1F4',
    overflow: 'hidden',
    marginTop: 12,
  },

  gecmisProgressFill: {
    height: '100%',
    backgroundColor: '#18A66A',
    borderRadius: 3,
  },

  gecmisAcButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 11,
  },

  gecmisAcText: {
    color: '#F97316',
    fontSize: 9,
    fontWeight: '800',
  },

  gecmisDetay: {
    borderTopWidth: 1,
    borderTopColor: '#F0EFED',
    marginTop: 13,
    paddingTop: 6,
  },

  gecmisGunBolum: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },

  gecmisGunBaslik: {
    color: '#202939',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 7,
  },

  gecmisBos: {
    color: '#B4BBC5',
    fontSize: 9,
  },

  gecmisGorev: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  gecmisGorevIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#FFF1E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  gecmisGorevDers: {
    color: '#202939',
    fontSize: 10,
    fontWeight: '800',
  },

  gecmisGorevKonu: {
    color: '#98A2B3',
    fontSize: 9,
    marginTop: 1,
  },

});