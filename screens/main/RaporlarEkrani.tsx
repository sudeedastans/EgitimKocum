import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';


import {
  type Gun,
  type Gorev,
  type HaftalikProgram,
} from '../../data/programData';

/* ============================================================
   TYPES
============================================================ */

type CalismaKayitlari =
  Record<Gun, number>;

type KonuIlerlemesi = {
  ders: string;

  konular: {
    konu: string;
    durum: Gorev['durum'];
  }[];

  tamamlanan: number;
  toplam: number;
};

type DenemeSonucu = {
  id: string;
  tarih: string;
  ad: string;
  toplamNet: number;

  tur?: string;

  dersler: {
    ders: string;
    soru: number;
    dogru: number;
    yanlis: number;
    bos: number;
    net: number;
  }[];
};

type KayitliHaftalikRapor = {
  id: string;

  haftaKey: string;

  baslangic: string;
  bitis: string;

  toplamCalismaDakika: number;

  tamamlananGorev: number;
  toplamGorev: number;

  islenenKonu: number;
  tekrarGereken: number;

  performans: number;

  konuIlerlemeleri:
    KonuIlerlemesi[];

  kayitTarihi: string;
};

/* ============================================================
   CONSTANTS
============================================================ */

const GUNLER: Gun[] = [
  'Pzt',
  'Sal',
  'Çar',
  'Per',
  'Cum',
  'Cmt',
  'Paz',
];

/* ============================================================
   DATE
============================================================ */

const bugunGunGetir = (): Gun => {
  const map: Gun[] = [
    'Paz',
    'Pzt',
    'Sal',
    'Çar',
    'Per',
    'Cum',
    'Cmt',
  ];

  return map[
    new Date().getDay()
  ];
};

const haftayiGetir = () => {
  const bugun =
    new Date();

  const gun =
    bugun.getDay();

  const pazartesiFarki =
    gun === 0
      ? -6
      : 1 - gun;

  const baslangic =
    new Date(bugun);

  baslangic.setDate(
    bugun.getDate() +
      pazartesiFarki
  );

  baslangic.setHours(
    0,
    0,
    0,
    0
  );

  const bitis =
    new Date(baslangic);

  bitis.setDate(
    baslangic.getDate() + 6
  );

  const key = [
    baslangic.getFullYear(),

    String(
      baslangic.getMonth() + 1
    ).padStart(2, '0'),

    String(
      baslangic.getDate()
    ).padStart(2, '0'),
  ].join('-');

  const tarihYaz = (
    tarih: Date
  ) =>
    tarih.toLocaleDateString(
      'tr-TR',
      {
        day: 'numeric',
        month: 'long',
      }
    );

  return {
    key,

    baslangic:
      tarihYaz(baslangic),

    bitis:
      `${tarihYaz(
        bitis
      )} ${bitis.getFullYear()}`,
  };
};

/* ============================================================
   HELPERS
============================================================ */

const dakikaMetni = (
  dakika: number
) => {
  const saat =
    Math.floor(
      dakika / 60
    );

  const dk =
    dakika % 60;

  if (saat === 0)
    return `${dk} dk`;

  if (dk === 0)
    return `${saat} sa`;

  return `${saat} sa ${dk} dk`;
};

const yuzde = (
  deger: number,
  toplam: number
) => {
  if (!toplam)
    return 0;

  return Math.round(
    (deger / toplam) *
      100
  );
};

const netMetni = (
  net: number
) =>
  net.toLocaleString(
    'tr-TR',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );


const storageIdOlustur = (
  deger: unknown
) => {
  const metin =
    String(
      deger ??
        'ogrenci'
    )
      .trim()
      .toLocaleLowerCase(
        'tr-TR'
      )
      .replace(
        /\s+/g,
        '-'
      )
      .replace(
        /[^a-z0-9ğüşöçı-]/gi,
        ''
      );

  return metin ||
    'ogrenci';
};

/* ============================================================
   SCREEN
============================================================ */

type Props = {
  navigation: any;
  route: any;

  program:
    HaftalikProgram;
};

export default function RaporlarEkrani({
  navigation,
  route,
  program,
}: Props) {
  const adSoyad =
    route?.params
      ?.adSoyad ??
    'Öğrenci';


  const hesapKimligi =
    route?.params?.userId ??
    route?.params?.email ??
    route?.params?.secimler?.email ??
    adSoyad;

  const kullaniciStorageId =
    route?.params?.storageUserKey ??
    storageIdOlustur(
      hesapKimligi
    );

  const DENEME_STORAGE_KEY =
    `deneme-sonuclari-${kullaniciStorageId}`;

  const hafta =
    useMemo(
      () =>
        haftayiGetir(),
      []
    );

  const bugunGun =
    bugunGunGetir();

  const [
    saatInput,
    setSaatInput,
  ] =
    useState('');

  const [
    dakikaInput,
    setDakikaInput,
  ] =
    useState('');

  const [
    calismaKayitlari,
    setCalismaKayitlari,
  ] =
    useState<CalismaKayitlari>({
      Pzt: 0,
      Sal: 0,
      Çar: 0,
      Per: 0,
      Cum: 0,
      Cmt: 0,
      Paz: 0,
    });

  const [
    gecmisRaporlar,
    setGecmisRaporlar,
  ] =
    useState<
      KayitliHaftalikRapor[]
    >([]);

  const [
    denemeler,
    setDenemeler,
  ] =
    useState<
      DenemeSonucu[]
    >([]);


  const [
    storageHazir,
    setStorageHazir,
  ] =
    useState(false);

  /* ============================================================
     PROGRAM
  ============================================================ */

  const haftalikGorevler =
    useMemo(
      () =>
        Object.values(
          program
        ).flat() as Gorev[],
      [program]
    );

  const toplamGorev =
    haftalikGorevler.length;

  const tamamlananGorev =
    haftalikGorevler.filter(
      gorev =>
        gorev.durum ===
        'bitti'
    ).length;

  const tekrarGereken =
    haftalikGorevler.filter(
      gorev =>
        gorev.durum ===
          'anlamadim' ||
        gorev.durum ===
          'yetismedi'
    ).length;

  const tumKonular =
    useMemo(
      () =>
        new Set(
          haftalikGorevler.map(
            gorev =>
              `${gorev.ders}|${gorev.konu}`
          )
        ),
      [haftalikGorevler]
    );

  const bitenKonular =
    useMemo(
      () =>
        new Set(
          haftalikGorevler
            .filter(
              gorev =>
                gorev.durum ===
                'bitti'
            )
            .map(
              gorev =>
                `${gorev.ders}|${gorev.konu}`
            )
        ),
      [haftalikGorevler]
    );

  const islenenKonu =
    bitenKonular.size;

  const toplamKonu =
    tumKonular.size;

  const performans =
    yuzde(
      tamamlananGorev,
      toplamGorev
    );

  /* ============================================================
     KONU İLERLEMESİ
  ============================================================ */

  const konuIlerlemeleri:
    KonuIlerlemesi[] =
    useMemo(() => {
      const dersMap:
        Record<
          string,
          {
            konu: string;
            durum:
              Gorev['durum'];
          }[]
        > = {};

      const durumOnceligi:
        Record<
          Gorev['durum'],
          number
        > = {
        yapilacak: 0,
        yetismedi: 1,
        anlamadim: 2,
        bitti: 3,
      };

      haftalikGorevler.forEach(
        gorev => {
          if (
            !dersMap[
              gorev.ders
            ]
          ) {
            dersMap[
              gorev.ders
            ] = [];
          }

          const mevcut =
            dersMap[
              gorev.ders
            ].find(
              item =>
                item.konu ===
                gorev.konu
            );

          if (!mevcut) {
            dersMap[
              gorev.ders
            ].push({
              konu:
                gorev.konu,

              durum:
                gorev.durum,
            });
          } else if (
            durumOnceligi[
              gorev.durum
            ] >
            durumOnceligi[
              mevcut.durum
            ]
          ) {
            mevcut.durum =
              gorev.durum;
          }
        }
      );

      return Object.entries(
        dersMap
      ).map(
        ([ders, konular]) => {
          const tamamlanan =
            konular.filter(
              konu =>
                konu.durum ===
                'bitti'
            ).length;

          return {
            ders,
            konular,
            tamamlanan,
            toplam:
              konular.length,
          };
        }
      );
    }, [
      haftalikGorevler,
    ]);

  /* ============================================================
     ÇALIŞMA
  ============================================================ */

  const toplamCalismaDakika =
    useMemo(
      () =>
        Object.values(
          calismaKayitlari
        ).reduce(
          (
            toplam,
            dakika
          ) =>
            toplam +
            dakika,
          0
        ),
      [calismaKayitlari]
    );

  const maxCalismaDakika =
    useMemo(
      () =>
        Math.max(
          60,
          ...Object.values(
            calismaKayitlari
          )
        ),
      [calismaKayitlari]
    );

  /* ============================================================
     STORAGE
     Her hesap kendi çalışma süresi ve raporlarını tutar.
  ============================================================ */

  const calismaStorageKey =
    `calisma-${kullaniciStorageId}-${hafta.key}`;

  const raporStorageKey =
    `haftalik-raporlar-${kullaniciStorageId}`;

  useEffect(() => {
    let aktif = true;

    const yukle =
      async () => {
        setStorageHazir(
          false
        );

        /*
          Hesap değiştiğinde önceki hesabın
          verisini ekranda bırakmıyoruz.
        */
        setCalismaKayitlari({
          Pzt: 0,
          Sal: 0,
          Çar: 0,
          Per: 0,
          Cum: 0,
          Cmt: 0,
          Paz: 0,
        });

        setGecmisRaporlar(
          []
        );

        try {
          const [
            calisma,
            raporlar,
          ] =
            await Promise.all([
              AsyncStorage.getItem(
                calismaStorageKey
              ),

              AsyncStorage.getItem(
                raporStorageKey
              ),
            ]);

          if (!aktif) {
            return;
          }

          if (calisma) {
            setCalismaKayitlari(
              JSON.parse(
                calisma
              )
            );
          }

          if (raporlar) {
            setGecmisRaporlar(
              JSON.parse(
                raporlar
              )
            );
          }
        } catch (error) {
          console.log(
            'Rapor verileri yüklenemedi:',
            error
          );
        } finally {
          if (aktif) {
            setStorageHazir(
              true
            );
          }
        }
      };

    yukle();

    return () => {
      aktif = false;
    };
  }, [
    calismaStorageKey,
    raporStorageKey,
  ]);

  useEffect(() => {
    if (!storageHazir) {
      return;
    }

    AsyncStorage.setItem(
      calismaStorageKey,
      JSON.stringify(
        calismaKayitlari
      )
    ).catch(error => {
      console.log(
        'Çalışma süresi kaydedilemedi:',
        error
      );
    });
  }, [
    calismaKayitlari,
    calismaStorageKey,
    storageHazir,
  ]);

  /* ============================================================
     DENEMELERİ HER GELDİĞİNDE YÜKLE
  ============================================================ */

  useFocusEffect(
    useCallback(() => {
      const denemeleriGetir =
        async () => {
          try {
            const kayitli =
              await AsyncStorage.getItem(
                DENEME_STORAGE_KEY
              );

            if (kayitli) {
              setDenemeler(
                JSON.parse(
                  kayitli
                )
              );
            } else {
              /*
                Yeni hesapta deneme geçmişi boş başlar.
              */
              setDenemeler(
                []
              );
            }
          } catch (error) {
            console.log(
              'Denemeler yüklenemedi:',
              error
            );

            setDenemeler(
              []
            );
          }
        };

      denemeleriGetir();
    }, [
      DENEME_STORAGE_KEY,
    ])
  );

  /* ============================================================
     RAPOR STORAGE
  ============================================================ */

  useEffect(() => {
    if (!storageHazir) {
      return;
    }

    const kaydet =
      async () => {
        const rapor:
          KayitliHaftalikRapor =
          {
            id:
              `rapor-${kullaniciStorageId}-${hafta.key}`,

            haftaKey:
              hafta.key,

            baslangic:
              hafta.baslangic,

            bitis:
              hafta.bitis,

            toplamCalismaDakika,

            tamamlananGorev,
            toplamGorev,

            islenenKonu,

            tekrarGereken,

            performans,

            konuIlerlemeleri,

            kayitTarihi:
              new Date().toISOString(),
          };

        try {
          const kayitli =
            await AsyncStorage.getItem(
              raporStorageKey
            );

          const mevcut:
            KayitliHaftalikRapor[] =
            kayitli
              ? JSON.parse(
                  kayitli
                )
              : [];

          const mevcutIndex =
            mevcut.findIndex(
              item =>
                item.haftaKey ===
                hafta.key
            );

          let yeniRaporlar =
            [...mevcut];

          if (
            mevcutIndex >= 0
          ) {
            yeniRaporlar[
              mevcutIndex
            ] = rapor;
          } else {
            yeniRaporlar = [
              rapor,
              ...yeniRaporlar,
            ];
          }

          setGecmisRaporlar(
            yeniRaporlar
          );

          await AsyncStorage.setItem(
            raporStorageKey,
            JSON.stringify(
              yeniRaporlar
            )
          );
        } catch (error) {
          console.log(
            'Haftalık rapor kaydedilemedi:',
            error
          );
        }
      };

    kaydet();
  }, [
    storageHazir,
    raporStorageKey,
    kullaniciStorageId,
    hafta.key,
    hafta.baslangic,
    hafta.bitis,
    toplamCalismaDakika,
    toplamGorev,
    tamamlananGorev,
    islenenKonu,
    tekrarGereken,
    performans,
    konuIlerlemeleri,
  ]);

  /* ============================================================
     ÇALIŞMA SÜRESİ
     Bir gün toplamda en fazla 24 saat / 1440 dakika olabilir.
  ============================================================ */

  const calismaSuresiKaydet =
    () => {
      const saat =
        Number(
          saatInput || 0
        );

      const dakika =
        Number(
          dakikaInput || 0
        );

      if (
        Number.isNaN(
          saat
        ) ||
        Number.isNaN(
          dakika
        ) ||
        saat < 0 ||
        dakika < 0 ||
        dakika > 59
      ) {
        Alert.alert(
          'Süreyi kontrol et',
          'Geçerli bir saat ve dakika gir.'
        );

        return;
      }

      if (
        saat > 24 ||
        (
          saat === 24 &&
          dakika > 0
        )
      ) {
        Alert.alert(
          '24 saat sınırı',
          'Bir günlük çalışma süresi 24 saati geçemez.'
        );

        return;
      }

      const toplam =
        saat * 60 +
        dakika;

      if (toplam <= 0) {
        Alert.alert(
          'Süre eklenmedi',
          'En az 1 dakika çalışma süresi girmelisin.'
        );

        return;
      }

      const bugunkuMevcut =
        calismaKayitlari[
          bugunGun
        ] ?? 0;

      if (
        bugunkuMevcut +
          toplam >
        24 * 60
      ) {
        const kalanDakika =
          Math.max(
            0,
            24 * 60 -
              bugunkuMevcut
          );

        Alert.alert(
          '24 saat sınırı',
          `Bugün için en fazla ${dakikaMetni(
            kalanDakika
          )} daha ekleyebilirsin.`
        );

        return;
      }

      setCalismaKayitlari(
        prev => ({
          ...prev,

          [bugunGun]:
            (
              prev[
                bugunGun
              ] ?? 0
            ) + toplam,
        })
      );

      setSaatInput('');
      setDakikaInput('');

      Alert.alert(
        'Kaydedildi',
        `Bugüne ${dakikaMetni(
          toplam
        )} çalışma eklendi.`
      );
    };

  /* ============================================================
     DENEME
  ============================================================ */

  const sonDeneme =
    denemeler[0];

  const oncekiDeneme =
    denemeler[1];

  const netDegisimi =
    sonDeneme &&
    oncekiDeneme
      ? sonDeneme.toplamNet -
        oncekiDeneme.toplamNet
      : 0;

  /* ============================================================
     PDF
     Gönderilen örneğe benzer:
     - Öğrenci / hafta bilgisi
     - Haftalık genel özet
     - Ders bazlı değerlendirme tablosu
     - Son deneme tablosu
     - Gelecek hafta odak noktaları
  ============================================================ */

  const pdfHtmlEscape = (
    value: string
  ) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const durumEtiketi = (
    durum: Gorev['durum']
  ) => {
    if (
      durum === 'bitti'
    ) {
      return 'Bitti';
    }

    if (
      durum === 'anlamadim'
    ) {
      return 'Anlamadım';
    }

    if (
      durum === 'yetismedi'
    ) {
      return 'Yetişmedi';
    }

    return 'Yapılacak';
  };

  const dersDegerlendirmeMetni = (
    item: KonuIlerlemesi
  ) => {
    const biten =
      item.konular
        .filter(
          konu =>
            konu.durum ===
            'bitti'
        )
        .map(
          konu =>
            konu.konu
        );

    const anlamadim =
      item.konular
        .filter(
          konu =>
            konu.durum ===
            'anlamadim'
        )
        .map(
          konu =>
            konu.konu
        );

    const yetismedi =
      item.konular
        .filter(
          konu =>
            konu.durum ===
            'yetismedi'
        )
        .map(
          konu =>
            konu.konu
        );

    const yapilacak =
      item.konular
        .filter(
          konu =>
            konu.durum ===
            'yapilacak'
        )
        .map(
          konu =>
            konu.konu
        );

    const cumleler:
      string[] = [];

    if (
      biten.length > 0
    ) {
      cumleler.push(
        `${biten.join(
          ', '
        )} ${
          biten.length === 1
            ? 'konusu'
            : 'konuları'
        } tamamlandı.`
      );
    }

    if (
      anlamadim.length > 0
    ) {
      cumleler.push(
        `${anlamadim.join(
          ', '
        )} ${
          anlamadim.length === 1
            ? 'konusunda'
            : 'konularında'
        } tekrar ihtiyacı bulunuyor.`
      );
    }

    if (
      yetismedi.length > 0
    ) {
      cumleler.push(
        `${yetismedi.join(
          ', '
        )} ${
          yetismedi.length === 1
            ? 'konusu'
            : 'konuları'
        } bu hafta yetişmedi; gelecek haftaya aktarılması önerilir.`
      );
    }

    if (
      yapilacak.length > 0
    ) {
      cumleler.push(
        `${yapilacak.join(
          ', '
        )} ${
          yapilacak.length === 1
            ? 'konusu'
            : 'konuları'
        } programda sırada bekliyor.`
      );
    }

    if (
      cumleler.length === 0
    ) {
      return 'Bu ders için bu hafta kayıtlı konu bulunmuyor.';
    }

    return cumleler.join(
      ' '
    );
  };

  const dersDegerlendirmeleri =
    konuIlerlemeleri.map(
      item => ({
        ders:
          item.ders,

        tamamlanan:
          item.tamamlanan,

        toplam:
          item.toplam,

        metin:
          dersDegerlendirmeMetni(
            item
          ),
      })
    );

  const gelecekHaftaOdaklari =
    konuIlerlemeleri.flatMap(
      item =>
        item.konular
          .filter(
            konu =>
              konu.durum ===
                'anlamadim' ||
              konu.durum ===
                'yetismedi'
          )
          .map(
            konu => ({
              ders:
                item.ders,

              konu:
                konu.konu,

              neden:
                konu.durum ===
                'anlamadim'
                  ? 'Tekrar'
                  : 'Tamamlama',
            })
          )
    );

  const haftalikRaporHtml =
    () => {
      const dersTablosu =
        dersDegerlendirmeleri.length >
        0
          ? dersDegerlendirmeleri
              .map(
                item => `
                  <tr>
                    <td class="lesson-name">
                      ${pdfHtmlEscape(
                        item.ders
                      )}
                      <div class="lesson-count">
                        ${item.tamamlanan}/${item.toplam} konu tamamlandı
                      </div>
                    </td>

                    <td class="lesson-evaluation">
                      ${pdfHtmlEscape(
                        item.metin
                      )}
                    </td>
                  </tr>
                `
              )
              .join('')
          : `
              <tr>
                <td colspan="2" class="empty-cell">
                  Bu hafta için ders değerlendirmesi bulunmuyor.
                </td>
              </tr>
            `;

      const denemeBasliklari =
        sonDeneme
          ? sonDeneme.dersler
              .map(
                ders => `
                  <th>
                    ${pdfHtmlEscape(
                      ders.ders
                    )}
                  </th>
                `
              )
              .join('')
          : '';

      const denemeSatiri = (
        label: string,
        alan:
          | 'soru'
          | 'dogru'
          | 'yanlis'
          | 'bos'
          | 'net'
      ) =>
        sonDeneme
          ? `
              <tr>
                <th class="row-label">
                  ${label}
                </th>

                ${sonDeneme.dersler
                  .map(
                    ders => `
                      <td>
                        ${
                          alan ===
                          'net'
                            ? Number(
                                ders[
                                  alan
                                ]
                              ).toLocaleString(
                                'tr-TR',
                                {
                                  minimumFractionDigits:
                                    2,
                                  maximumFractionDigits:
                                    2,
                                }
                              )
                            : ders[
                                alan
                              ]
                        }
                      </td>
                    `
                  )
                  .join('')}
              </tr>
            `
          : '';

      const odakHtml =
        gelecekHaftaOdaklari.length >
        0
          ? gelecekHaftaOdaklari
              .slice(
                0,
                6
              )
              .map(
                item => `
                  <div class="focus-item">
                    <strong>
                      ${pdfHtmlEscape(
                        item.ders
                      )}
                    </strong>
                    —
                    ${pdfHtmlEscape(
                      item.konu
                    )}
                    <span class="focus-badge">
                      ${item.neden}
                    </span>
                  </div>
                `
              )
              .join('')
          : `
              <div class="focus-item">
                Bu hafta tekrar veya yetişmeyen konu işaretlenmedi.
                Mevcut çalışma düzenine devam edilebilir.
              </div>
            `;

      return `
        <!DOCTYPE html>

        <html lang="tr">

        <head>
          <meta charset="UTF-8"/>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 34px 38px;
              color: #202939;
              background: #FFFFFF;
              font-size: 11px;
            }

            .brand {
              color: #F97316;
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 1.6px;
            }

            .title {
              margin: 6px 0 3px 0;
              font-size: 26px;
              font-weight: 800;
              color: #202939;
            }

            .subtitle {
              color: #667085;
              font-size: 10px;
            }

            .student-box {
              margin-top: 18px;
              border-top: 3px solid #F97316;
              background: #FFF8F1;
              padding: 12px 14px;
              display: flex;
              justify-content: space-between;
            }

            .student-name {
              font-size: 13px;
              font-weight: 800;
            }

            .week {
              color: #667085;
              font-size: 9px;
              margin-top: 3px;
            }

            .summary-grid {
              margin-top: 14px;
              display: flex;
              gap: 8px;
            }

            .summary-card {
              flex: 1;
              border: 1px solid #EEE9E4;
              background: #FAFAF9;
              border-radius: 8px;
              padding: 10px;
              text-align: center;
            }

            .summary-value {
              font-weight: 800;
              font-size: 15px;
              color: #202939;
            }

            .summary-label {
              margin-top: 3px;
              color: #98A2B3;
              font-size: 8px;
              text-transform: uppercase;
              letter-spacing: .5px;
            }

            .section-title {
              margin: 24px 0 8px 0;
              font-size: 14px;
              font-weight: 800;
              color: #202939;
            }

            .section-subtitle {
              color: #98A2B3;
              font-size: 8px;
              margin-top: -4px;
              margin-bottom: 9px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            .evaluation-table {
              border: 1px solid #D9DCE1;
            }

            .evaluation-table th {
              background: #F4F5F7;
              color: #344054;
              text-align: left;
              padding: 9px;
              font-size: 9px;
              border: 1px solid #D9DCE1;
            }

            .evaluation-table td {
              padding: 10px;
              vertical-align: top;
              border: 1px solid #D9DCE1;
              line-height: 1.45;
            }

            .lesson-name {
              width: 25%;
              font-weight: 800;
              color: #202939;
              background: #FCFCFC;
            }

            .lesson-count {
              margin-top: 4px;
              font-size: 7px;
              color: #F97316;
              font-weight: 700;
            }

            .lesson-evaluation {
              color: #4B5563;
            }

            .exam-header {
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              margin-bottom: 8px;
            }

            .exam-name {
              font-size: 10px;
              color: #667085;
            }

            .total-net {
              color: #F97316;
              font-size: 17px;
              font-weight: 800;
            }

            .exam-table {
              border: 1px solid #D9DCE1;
              text-align: center;
            }

            .exam-table th,
            .exam-table td {
              padding: 7px 5px;
              border: 1px solid #D9DCE1;
              font-size: 8px;
            }

            .exam-table thead th {
              background: #FFF4E8;
              color: #9A3412;
              font-weight: 800;
            }

            .exam-table .row-label {
              background: #F5F5F5;
              color: #344054;
              text-align: left;
              font-weight: 800;
            }

            .focus-box {
              border-left: 4px solid #4776E6;
              background: #F3F6FF;
              padding: 11px 13px;
            }

            .focus-item {
              color: #344054;
              margin: 6px 0;
              line-height: 1.4;
            }

            .focus-badge {
              margin-left: 6px;
              color: #4776E6;
              font-size: 7px;
              font-weight: 800;
            }

            .empty-cell {
              text-align: center;
              color: #98A2B3;
              padding: 15px !important;
            }

            .footer {
              margin-top: 24px;
              padding-top: 8px;
              border-top: 1px solid #EEEDEB;
              display: flex;
              justify-content: space-between;
              color: #98A2B3;
              font-size: 7px;
            }
          </style>
        </head>

        <body>
          <div class="brand">
            EĞİTİM KOÇUM
          </div>

          <div class="title">
            Haftalık Öğrenci Gelişim Raporu
          </div>

          <div class="subtitle">
            Program, çalışma süresi ve deneme sonuçlarından otomatik oluşturuldu.
          </div>

          <div class="student-box">
            <div>
              <div class="student-name">
                ${pdfHtmlEscape(
                  adSoyad
                )}
              </div>

              <div class="week">
                ${hafta.baslangic}
                –
                ${hafta.bitis}
              </div>
            </div>

            <div>
              <div class="summary-label">
                HAFTALIK PERFORMANS
              </div>

              <div class="total-net">
                %${performans}
              </div>
            </div>
          </div>

          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-value">
                ${dakikaMetni(
                  toplamCalismaDakika
                )}
              </div>

              <div class="summary-label">
                Çalışma
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-value">
                ${tamamlananGorev}/${toplamGorev}
              </div>

              <div class="summary-label">
                Görev
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-value">
                ${islenenKonu}/${toplamKonu}
              </div>

              <div class="summary-label">
                İşlenen konu
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-value">
                ${tekrarGereken}
              </div>

              <div class="summary-label">
                Tekrar gerekli
              </div>
            </div>
          </div>

          <div class="section-title">
            Haftalık Ders Değerlendirmesi
          </div>

          <div class="section-subtitle">
            Programındaki konu durumlarına göre otomatik hazırlanmıştır.
          </div>

          <table class="evaluation-table">
            <thead>
              <tr>
                <th>Ders</th>
                <th>Haftalık Değerlendirme</th>
              </tr>
            </thead>

            <tbody>
              ${dersTablosu}
            </tbody>
          </table>

          ${
            sonDeneme
              ? `
                <div class="section-title">
                  Son Deneme Sonucu
                </div>

                <div class="exam-header">
                  <div class="exam-name">
                    ${pdfHtmlEscape(
                      sonDeneme.ad
                    )}
                    ·
                    ${pdfHtmlEscape(
                      sonDeneme.tarih
                    )}
                  </div>

                  <div class="total-net">
                    ${netMetni(
                      sonDeneme.toplamNet
                    )} NET
                  </div>
                </div>

                <table class="exam-table">
                  <thead>
                    <tr>
                      <th></th>
                      ${denemeBasliklari}
                    </tr>
                  </thead>

                  <tbody>
                    ${denemeSatiri(
                      'Soru',
                      'soru'
                    )}

                    ${denemeSatiri(
                      'Doğru',
                      'dogru'
                    )}

                    ${denemeSatiri(
                      'Yanlış',
                      'yanlis'
                    )}

                    ${denemeSatiri(
                      'Boş',
                      'bos'
                    )}

                    ${denemeSatiri(
                      'Net',
                      'net'
                    )}
                  </tbody>
                </table>
              `
              : `
                <div class="section-title">
                  Son Deneme Sonucu
                </div>

                <div class="focus-box">
                  Henüz kayıtlı deneme sonucu bulunmuyor.
                </div>
              `
          }

          <div class="section-title">
            Gelecek Hafta Odak Noktaları
          </div>

          <div class="focus-box">
            ${odakHtml}
          </div>

          <div class="footer">
            <span>
              Eğitim Koçum
            </span>

            <span>
              Haftalık gelişim raporu
            </span>
          </div>
        </body>

        </html>
      `;
    };

  const pdfOlustur =
    async () => {
      try {
        /*
          WEB:
          PDF'yi doğrudan pdfmake ile indiriyoruz.
        */
        if (
          Platform.OS ===
          'web'
        ) {
          // @ts-ignore
          const pdfMakeModule =
            await import(
              'pdfmake/build/pdfmake'
            );

          // @ts-ignore
          const pdfFontsModule =
            await import(
              'pdfmake/build/vfs_fonts'
            );

          const pdfMake: any =
            (pdfMakeModule as any)
              .default ??
            pdfMakeModule;

          const pdfFonts: any =
            (pdfFontsModule as any)
              .default ??
            pdfFontsModule;

          if (
            pdfFonts?.vfs
          ) {
            pdfMake.vfs =
              pdfFonts.vfs;
          } else if (
            pdfFonts?.pdfMake
              ?.vfs
          ) {
            pdfMake.vfs =
              pdfFonts.pdfMake.vfs;
          }

          const değerlendirmeBody:
            any[] = [
              [
                {
                  text:
                    'Ders',
                  style:
                    'tableHeader',
                },

                {
                  text:
                    'Haftalık Değerlendirme',
                  style:
                    'tableHeader',
                },
              ],

              ...(
                dersDegerlendirmeleri.length
                  ? dersDegerlendirmeleri.map(
                      item => [
                        {
                          stack: [
                            {
                              text:
                                item.ders,
                              bold: true,
                              fontSize: 9,
                              color:
                                '#202939',
                            },

                            {
                              text:
                                `${item.tamamlanan}/${item.toplam} konu tamamlandı`,
                              fontSize: 6.5,
                              color:
                                '#F97316',
                              margin: [
                                0,
                                3,
                                0,
                                0,
                              ],
                            },
                          ],
                          fillColor:
                            '#FCFCFC',
                          margin: [
                            2,
                            4,
                            2,
                            4,
                          ],
                        },

                        {
                          text:
                            item.metin,
                          fontSize: 8,
                          color:
                            '#4B5563',
                          lineHeight:
                            1.25,
                          margin: [
                            2,
                            4,
                            2,
                            4,
                          ],
                        },
                      ]
                    )
                  : [
                      [
                        {
                          text:
                            'Bu hafta için ders değerlendirmesi bulunmuyor.',
                          colSpan: 2,
                          color:
                            '#98A2B3',
                          alignment:
                            'center',
                          margin: [
                            0,
                            8,
                            0,
                            8,
                          ],
                        },
                        {},
                      ],
                    ]
              ),
            ];

          const ozetTablosu =
            {
              table: {
                widths: [
                  '*',
                  '*',
                  '*',
                  '*',
                ],

                body: [
                  [
                    {
                      text:
                        `${dakikaMetni(
                          toplamCalismaDakika
                        )}\nÇalışma`,
                      style:
                        'summary',
                    },

                    {
                      text:
                        `${tamamlananGorev}/${toplamGorev}\nGörev`,
                      style:
                        'summary',
                    },

                    {
                      text:
                        `${islenenKonu}/${toplamKonu}\nİşlenen konu`,
                      style:
                        'summary',
                    },

                    {
                      text:
                        `${tekrarGereken}\nTekrar gerekli`,
                      style:
                        'summary',
                    },
                  ],
                ],
              },

              layout:
                'noBorders',

              margin: [
                0,
                12,
                0,
                18,
              ],
            };

          const content:
            any[] = [
              {
                text:
                  'EĞİTİM KOÇUM',
                color:
                  '#F97316',
                bold: true,
                fontSize: 9,
                characterSpacing:
                  1.4,
              },

              {
                text:
                  'Haftalık Öğrenci Gelişim Raporu',
                bold: true,
                fontSize: 21,
                color:
                  '#202939',
                margin: [
                  0,
                  5,
                  0,
                  3,
                ],
              },

              {
                text:
                  'Program, çalışma süresi ve deneme sonuçlarından otomatik oluşturuldu.',
                fontSize: 8,
                color:
                  '#667085',
              },

              {
                table: {
                  widths: [
                    '*',
                    95,
                  ],

                  body: [
                    [
                      {
                        stack: [
                          {
                            text:
                              adSoyad,
                            bold: true,
                            fontSize: 11,
                            color:
                              '#202939',
                          },

                          {
                            text:
                              `${hafta.baslangic} – ${hafta.bitis}`,
                            fontSize: 7.5,
                            color:
                              '#667085',
                            margin: [
                              0,
                              3,
                              0,
                              0,
                            ],
                          },
                        ],
                        fillColor:
                          '#FFF8F1',
                        margin: [
                          6,
                          6,
                          6,
                          6,
                        ],
                      },

                      {
                        stack: [
                          {
                            text:
                              'HAFTALIK PERFORMANS',
                            fontSize: 6,
                            color:
                              '#98A2B3',
                            alignment:
                              'right',
                          },

                          {
                            text:
                              `%${performans}`,
                            bold: true,
                            fontSize: 16,
                            color:
                              '#F97316',
                            alignment:
                              'right',
                            margin: [
                              0,
                              3,
                              0,
                              0,
                            ],
                          },
                        ],
                        fillColor:
                          '#FFF8F1',
                        margin: [
                          6,
                          6,
                          6,
                          6,
                        ],
                      },
                    ],
                  ],
                },

                layout: {
                  hLineWidth: (
                    i: number
                  ) =>
                    i === 0
                      ? 2
                      : 0,

                  vLineWidth: () =>
                    0,

                  hLineColor: () =>
                    '#F97316',
                },

                margin: [
                  0,
                  14,
                  0,
                  0,
                ],
              },

              ozetTablosu,

              {
                text:
                  'Haftalık Ders Değerlendirmesi',
                style:
                  'sectionTitle',
              },

              {
                text:
                  'Programındaki konu durumlarına göre otomatik hazırlanmıştır.',
                style:
                  'sectionSubtitle',
              },

              {
                table: {
                  headerRows: 1,

                  widths: [
                    110,
                    '*',
                  ],

                  body:
                    değerlendirmeBody,
                },

                layout: {
                  hLineWidth: () =>
                    0.6,

                  vLineWidth: () =>
                    0.6,

                  hLineColor: () =>
                    '#D9DCE1',

                  vLineColor: () =>
                    '#D9DCE1',

                  paddingLeft: () =>
                    5,

                  paddingRight: () =>
                    5,

                  paddingTop: () =>
                    4,

                  paddingBottom: () =>
                    4,
                },

                margin: [
                  0,
                  0,
                  0,
                  14,
                ],
              },
            ];

          if (
            sonDeneme
          ) {
            const denemeHeader =
              [
                {
                  text: '',
                  style:
                    'examHeader',
                },

                ...sonDeneme.dersler.map(
                  ders => ({
                    text:
                      ders.ders,
                    style:
                      'examHeader',
                  })
                ),
              ];

            const denemeSatiri =
              (
                label: string,
                alan:
                  | 'soru'
                  | 'dogru'
                  | 'yanlis'
                  | 'bos'
                  | 'net'
              ) => [
                {
                  text:
                    label,
                  style:
                    'examRowLabel',
                },

                ...sonDeneme.dersler.map(
                  ders => ({
                    text:
                      alan ===
                      'net'
                        ? Number(
                            ders[
                              alan
                            ]
                          ).toLocaleString(
                            'tr-TR',
                            {
                              minimumFractionDigits:
                                2,
                              maximumFractionDigits:
                                2,
                            }
                          )
                        : String(
                            ders[
                              alan
                            ]
                          ),
                    alignment:
                      'center',
                    fontSize: 7.5,
                    margin: [
                      0,
                      3,
                      0,
                      3,
                    ],
                  })
                ),
              ];

            content.push(
              {
                columns: [
                  {
                    width: '*',
                    stack: [
                      {
                        text:
                          'Son Deneme Sonucu',
                        style:
                          'sectionTitle',
                      },

                      {
                        text:
                          `${sonDeneme.ad} · ${sonDeneme.tarih}`,
                        style:
                          'sectionSubtitle',
                      },
                    ],
                  },

                  {
                    width: 'auto',
                    text:
                      `${netMetni(
                        sonDeneme.toplamNet
                      )} NET`,
                    bold: true,
                    fontSize: 16,
                    color:
                      '#F97316',
                    margin: [
                      0,
                      19,
                      0,
                      0,
                    ],
                  },
                ],
              },

              {
                table: {
                  headerRows: 1,

                  widths: [
                    55,
                    ...sonDeneme.dersler.map(
                      () => '*'
                    ),
                  ],

                  body: [
                    denemeHeader,

                    denemeSatiri(
                      'Soru',
                      'soru'
                    ),

                    denemeSatiri(
                      'Doğru',
                      'dogru'
                    ),

                    denemeSatiri(
                      'Yanlış',
                      'yanlis'
                    ),

                    denemeSatiri(
                      'Boş',
                      'bos'
                    ),

                    denemeSatiri(
                      'Net',
                      'net'
                    ),
                  ],
                },

                layout: {
                  hLineWidth: () =>
                    0.6,

                  vLineWidth: () =>
                    0.6,

                  hLineColor: () =>
                    '#D9DCE1',

                  vLineColor: () =>
                    '#D9DCE1',

                  paddingLeft: () =>
                    4,

                  paddingRight: () =>
                    4,

                  paddingTop: () =>
                    3,

                  paddingBottom: () =>
                    3,
                },

                margin: [
                  0,
                  0,
                  0,
                  14,
                ],
              }
            );
          } else {
            content.push(
              {
                text:
                  'Son Deneme Sonucu',
                style:
                  'sectionTitle',
              },

              {
                text:
                  'Henüz kayıtlı deneme sonucu bulunmuyor.',
                style:
                  'infoBox',
              }
            );
          }

          content.push(
            {
              text:
                'Gelecek Hafta Odak Noktaları',
              style:
                'sectionTitle',
            },

            {
              stack:
                gelecekHaftaOdaklari.length >
                0
                  ? gelecekHaftaOdaklari
                      .slice(
                        0,
                        6
                      )
                      .map(
                        item => ({
                          text: [
                            {
                              text:
                                `${item.ders} — `,
                              bold: true,
                              color:
                                '#202939',
                            },

                            {
                              text:
                                item.konu,
                              color:
                                '#344054',
                            },

                            {
                              text:
                                `  ${item.neden}`,
                              bold: true,
                              color:
                                '#4776E6',
                              fontSize: 6.5,
                            },
                          ],

                          margin: [
                            0,
                            2,
                            0,
                            2,
                          ],
                        })
                      )
                  : [
                      {
                        text:
                          'Bu hafta tekrar veya yetişmeyen konu işaretlenmedi. Mevcut çalışma düzenine devam edilebilir.',
                        color:
                          '#344054',
                      },
                    ],

              fillColor:
                '#F3F6FF',

              margin: [
                8,
                8,
                8,
                8,
              ],
            },

            {
              columns: [
                {
                  text:
                    'Eğitim Koçum',
                },

                {
                  text:
                    'Haftalık gelişim raporu',
                  alignment:
                    'right',
                },
              ],

              fontSize: 6,
              color:
                '#98A2B3',

              margin: [
                0,
                18,
                0,
                0,
              ],
            }
          );

          const docDefinition:
            any = {
            pageSize: 'A4',

            pageMargins: [
              30,
              28,
              30,
              28,
            ],

            defaultStyle: {
              fontSize: 8,
              color:
                '#202939',
            },

            content,

            styles: {
              summary: {
                bold: true,
                fontSize: 9,
                color:
                  '#202939',
                fillColor:
                  '#FAFAF9',
                alignment:
                  'center',
                margin: [
                  5,
                  7,
                  5,
                  7,
                ],
              },

              sectionTitle: {
                bold: true,
                fontSize: 13,
                color:
                  '#202939',
                margin: [
                  0,
                  8,
                  0,
                  5,
                ],
              },

              sectionSubtitle: {
                fontSize: 7,
                color:
                  '#98A2B3',
                margin: [
                  0,
                  0,
                  0,
                  7,
                ],
              },

              tableHeader: {
                bold: true,
                fontSize: 8,
                color:
                  '#344054',
                fillColor:
                  '#F4F5F7',
                margin: [
                  2,
                  4,
                  2,
                  4,
                ],
              },

              examHeader: {
                bold: true,
                fontSize: 7.5,
                color:
                  '#9A3412',
                fillColor:
                  '#FFF4E8',
                alignment:
                  'center',
                margin: [
                  0,
                  4,
                  0,
                  4,
                ],
              },

              examRowLabel: {
                bold: true,
                fontSize: 7.5,
                color:
                  '#344054',
                fillColor:
                  '#F5F5F5',
                margin: [
                  2,
                  3,
                  2,
                  3,
                ],
              },

              infoBox: {
                fontSize: 8,
                color:
                  '#667085',
                fillColor:
                  '#F3F6FF',
                margin: [
                  8,
                  8,
                  8,
                  8,
                ],
              },
            },
          };

          const tarih =
            new Date()
              .toISOString()
              .slice(
                0,
                10
              );

          pdfMake
            .createPdf(
              docDefinition
            )
            .download(
              `Egitim-Kocum-Haftalik-Rapor-${tarih}.pdf`
            );

          return;
        }

        /*
          iOS / Android:
          aynı tasarım HTML üzerinden PDF'e çevrilir.
        */
        const { uri } =
          await Print.printToFileAsync(
            {
              html:
                haftalikRaporHtml(),
            }
          );

        if (
          await Sharing.isAvailableAsync()
        ) {
          await Sharing.shareAsync(
            uri,
            {
              mimeType:
                'application/pdf',

              dialogTitle:
                'Haftalık Raporu Kaydet',

              UTI:
                'com.adobe.pdf',
            }
          );
        } else {
          Alert.alert(
            'PDF hazır',
            'Haftalık raporun PDF olarak oluşturuldu.'
          );
        }
      } catch (error) {
        console.log(
          'Rapor PDF hatası:',
          error
        );

        Alert.alert(
          'Hata',
          'PDF oluşturulamadı.'
        );
      }
    };

  /* ============================================================
     UI
  ============================================================ */

  return (
    <SafeAreaView
      style={s.container}
    >
      <StatusBar
        barStyle="dark-content"
      />

      <View style={s.header}>
        <View>
          <Text style={s.eyebrow}>
            GELİŞİM MERKEZİN
          </Text>

          <Text style={s.headerTitle}>
            Raporlarım
          </Text>
        </View>

        <View style={s.headerIcon}>
          <Ionicons
            name="bar-chart-outline"
            size={22}
            color="#F97316"
          />
        </View>
      </View>

      <ScrollView
        style={s.scrollView}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          s.scroll
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* WEEKLY */}

        <View style={s.weeklyCard}>
          <View style={s.weeklyTop}>
            <View style={s.weeklyIcon}>
              <Ionicons
                name="sparkles"
                size={21}
                color="#F97316"
              />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={s.weeklyMini}>
                BU HAFTANIN RAPORU
              </Text>

              <Text style={s.weeklyTitle}>
                {hafta.baslangic}
                {' – '}
                {hafta.bitis}
              </Text>
            </View>

            <View
              style={
                s.performanceBadge
              }
            >
              <Text
                style={
                  s.performanceText
                }
              >
                %{performans}
              </Text>
            </View>
          </View>

          <Text
            style={
              s.weeklyDescription
            }
          >
            Haftalık programındaki
            görev, konu ve çalışma
            bilgilerine göre
            oluşturuldu.
          </Text>

          <TouchableOpacity
            style={s.pdfButton}
            onPress={
              pdfOlustur
            }
          >
            <Ionicons
              name="document-outline"
              size={16}
              color="#FFF"
            />

            <Text
              style={
                s.pdfButtonText
              }
            >
              Haftalık Raporu PDF
            </Text>
          </TouchableOpacity>
        </View>

        {/* SUMMARY */}

        <SectionTitle
          title="Bu hafta"
          subtitle="Programından otomatik hesaplandı"
        />

        <View style={s.statsGrid}>
          <StatCard
            icon="time-outline"
            value={dakikaMetni(
              toplamCalismaDakika
            )}
            label="Çalışma"
          />

          <StatCard
            icon="checkmark-circle-outline"
            value={`${tamamlananGorev}/${toplamGorev}`}
            label="Görev"
          />

          <StatCard
            icon="book-outline"
            value={`${islenenKonu}/${toplamKonu}`}
            label="İşlenen konu"
          />

          <StatCard
            icon="refresh-outline"
            value={`${tekrarGereken}`}
            label="Tekrar gerekli"
          />
        </View>

        {/* STUDY TIME */}

        <View
          style={
            s.studyEntryCard
          }
        >
          <View
            style={
              s.studyEntryTop
            }
          >
            <View style={s.blueIcon}>
              <Ionicons
                name="timer-outline"
                size={19}
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
                  s.cardTitle
                }
              >
                Bugün kaç saat
                çalıştın?
              </Text>

              <Text
                style={
                  s.cardSubtitle
                }
              >
                Girdiğin süre
                haftalık grafiğine
                eklenir.
              </Text>
            </View>
          </View>

          <View
            style={
              s.timeInputRow
            }
          >
            <View
              style={
                s.timeInputBox
              }
            >
              <TextInput
                value={
                  saatInput
                }
                onChangeText={
                  value =>
                    setSaatInput(
                      value.replace(
                        /[^0-9]/g,
                        ''
                      )
                    )
                }
                keyboardType="number-pad"
                placeholder="0"
                maxLength={2}
                style={s.timeInput}
              />

              <Text
                style={s.timeUnit}
              >
                saat
              </Text>
            </View>

            <View
              style={
                s.timeInputBox
              }
            >
              <TextInput
                value={
                  dakikaInput
                }
                onChangeText={
                  value =>
                    setDakikaInput(
                      value.replace(
                        /[^0-9]/g,
                        ''
                      )
                    )
                }
                keyboardType="number-pad"
                placeholder="0"
                maxLength={2}
                style={s.timeInput}
              />

              <Text
                style={s.timeUnit}
              >
                dk
              </Text>
            </View>

            <TouchableOpacity
              style={
                s.saveTimeButton
              }
              onPress={
                calismaSuresiKaydet
              }
            >
              <Text
                style={
                  s.saveTimeText
                }
              >
                Ekle
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CHART */}

        <SectionTitle
          title="Çalışma sürem"
          subtitle={`Bu hafta ${dakikaMetni(
            toplamCalismaDakika
          )}`}
        />

        <View style={s.chartCard}>
          <View style={s.barChart}>
            {GUNLER.map(
              gun => {
                const dakika =
                  calismaKayitlari[
                    gun
                  ];

                const oran =
                  dakika /
                  maxCalismaDakika;

                const barHeight =
                  Math.max(
                    5,
                    oran * 105
                  );

                return (
                  <View
                    key={gun}
                    style={
                      s.barColumn
                    }
                  >
                    <Text
                      style={
                        s.barValue
                      }
                    >
                      {dakika
                        ? `${(
                            dakika /
                            60
                          ).toFixed(
                            1
                          )}s`
                        : '0'}
                    </Text>

                    <View
                      style={
                        s.barTrack
                      }
                    >
                      <View
                        style={[
                          s.barFill,
                          {
                            height:
                              barHeight,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={
                        s.barLabel
                      }
                    >
                      {gun}
                    </Text>
                  </View>
                );
              }
            )}
          </View>
        </View>

        {/* KONULAR */}

        <SectionTitle
          title="Konu ilerlemem"
          subtitle="Programındaki gerçek konu durumları"
        />

        {konuIlerlemeleri.map(
          item => {
            const oran =
              yuzde(
                item.tamamlanan,
                item.toplam
              );

            return (
              <View
                key={
                  item.ders
                }
                style={
                  s.konuCard
                }
              >
                <View
                  style={
                    s.konuHeader
                  }
                >
                  <View
                    style={
                      s.konuHeaderLeft
                    }
                  >
                    <View
                      style={
                        s.dersIcon
                      }
                    >
                      <Ionicons
                        name="book-outline"
                        size={17}
                        color="#F97316"
                      />
                    </View>

                    <Text
                      style={
                        s.konuDers
                      }
                    >
                      {item.ders}
                    </Text>
                  </View>

                  <Text
                    style={
                      s.konuSayac
                    }
                  >
                    {
                      item.tamamlanan
                    }
                    /
                    {item.toplam}
                  </Text>
                </View>

                {item.konular.map(
                  konu => {
                    const bitti =
                      konu.durum ===
                      'bitti';

                    const anlamadi =
                      konu.durum ===
                      'anlamadim';

                    const yetismedi =
                      konu.durum ===
                      'yetismedi';

                    return (
                      <View
                        key={
                          konu.konu
                        }
                        style={
                          s.konuRow
                        }
                      >
                        <View
                          style={[
                            s.konuDurumIcon,

                            bitti &&
                              s.konuDurumBitti,

                            anlamadi &&
                              s.konuDurumAnlamadi,

                            yetismedi &&
                              s.konuDurumYetismedi,
                          ]}
                        >
                          <Ionicons
                            name={
                              bitti
                                ? 'checkmark'
                                : anlamadi
                                  ? 'help'
                                  : yetismedi
                                    ? 'time-outline'
                                    : 'ellipse-outline'
                            }
                            size={
                              12
                            }
                            color={
                              bitti
                                ? '#18A66A'
                                : anlamadi
                                  ? '#D14343'
                                  : yetismedi
                                    ? '#D97706'
                                    : '#98A2B3'
                            }
                          />
                        </View>

                        <Text
                          style={[
                            s.konuAdi,

                            bitti &&
                              s.konuAdiBitti,
                          ]}
                        >
                          {
                            konu.konu
                          }
                        </Text>

                        <Text
                          style={[
                            s.konuDurumText,

                            bitti && {
                              color:
                                '#18A66A',
                            },

                            anlamadi && {
                              color:
                                '#D14343',
                            },

                            yetismedi && {
                              color:
                                '#D97706',
                            },
                          ]}
                        >
                          {bitti
                            ? 'Bitti'
                            : anlamadi
                              ? 'Anlamadım'
                              : yetismedi
                                ? 'Yetişmedi'
                                : 'Yapılacak'}
                        </Text>
                      </View>
                    );
                  }
                )}

                <View
                  style={
                    s.konuProgressBottom
                  }
                >
                  <View
                    style={[
                      s.progressTrack,
                      {
                        flex: 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        s.progressFill,
                        {
                          width:
                            `${oran}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={
                      s.konuYuzde
                    }
                  >
                    %{oran}
                  </Text>
                </View>
              </View>
            );
          }
        )}

        {/* DENEME */}

        <SectionTitle
          title="Deneme gelişimim"
          subtitle="Sonuçlarını ekle ve gelişimini karşılaştır"
        />

        <TouchableOpacity
          style={
            s.addExamButton
          }
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate(
              'DenemeEkle',
              {
                storageUserKey:
                  kullaniciStorageId,
              }
            )
          }
        >
          <View
            style={
              s.addExamIcon
            }
          >
            <Ionicons
              name="add"
              size={21}
              color="#FFF"
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={
                s.addExamTitle
              }
            >
              Yeni Deneme Sonucu Gir
            </Text>

            <Text
              style={
                s.addExamSub
              }
            >
              Doğru ve
              yanlışlarını gir,
              netini otomatik
              hesaplayalım.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#FFF"
          />
        </TouchableOpacity>

        {sonDeneme ? (
          <TouchableOpacity
            style={
              s.examHeroCard
            }
            activeOpacity={
              0.85
            }
            onPress={() =>
              navigation.navigate(
                'DenemeAnaliz',
                {
                  denemeId:
                    sonDeneme.id,

                  storageUserKey:
                    kullaniciStorageId,
                }
              )
            }
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={
                  s.examMini
                }
              >
                SON DENEMEN
              </Text>

              <Text
                style={
                  s.examNet
                }
              >
                {netMetni(
                  sonDeneme.toplamNet
                )}

                {' '}

                <Text
                  style={
                    s.examNetUnit
                  }
                >
                  net
                </Text>
              </Text>

              {oncekiDeneme && (
                <Text
                  style={
                    s.examChangeText
                  }
                >
                  {netDegisimi >=
                  0
                    ? '↑'
                    : '↓'}
                  {' '}
                  {netMetni(
                    Math.abs(
                      netDegisimi
                    )
                  )}
                  {' net önceki denemeye göre'}
                </Text>
              )}
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#FFF"
            />
          </TouchableOpacity>
        ) : (
          <View
            style={
              s.noExamCard
            }
          >
            <Ionicons
              name="analytics-outline"
              size={23}
              color="#98A2B3"
            />

            <Text
              style={
                s.noExamText
              }
            >
              Henüz deneme
              eklenmemiş.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={
            s.allExamButton
          }
          onPress={() =>
            navigation.navigate(
              'TumDenemeler',
              {
                storageUserKey:
                  kullaniciStorageId,
              }
            )
          }
        >
          <View>
            <Text
              style={
                s.allExamMini
              }
            >
              TÜM DENEMELER
            </Text>

            <Text
              style={
                s.allExamText
              }
            >
              Deneme analizlerimi gör
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#4776E6"
          />
        </TouchableOpacity>

        {/* HISTORY */}

        <SectionTitle
          title="Geçmiş raporlar"
          subtitle="Haftalar arasındaki gelişimini karşılaştır"
        />

        <View style={s.card}>
          {gecmisRaporlar
            .filter(
              rapor =>
                rapor.haftaKey !==
                hafta.key
            )
            .map(
              rapor => (
                <View
                  key={
                    rapor.id
                  }
                  style={
                    s.historyRow
                  }
                >
                  <View
                    style={
                      s.historyIcon
                    }
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={17}
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
                        s.historyDate
                      }
                    >
                      {rapor.baslangic}
                      {' – '}
                      {rapor.bitis}
                    </Text>

                    <Text
                      style={
                        s.historySub
                      }
                    >
                      {
                        rapor.tamamlananGorev
                      }
                      /
                      {
                        rapor.toplamGorev
                      }
                      {' görev · '}
                      {dakikaMetni(
                        rapor.toplamCalismaDakika
                      )}
                    </Text>
                  </View>

                  <Text
                    style={
                      s.historyScore
                    }
                  >
                    %{rapor.performans}
                  </Text>
                </View>
              )
            )}

          {gecmisRaporlar.filter(
            rapor =>
              rapor.haftaKey !==
              hafta.key
          ).length === 0 && (
            <Text
              style={
                s.emptyText
              }
            >
              Henüz geçmiş
              haftalık rapor yok.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View
      style={
        s.sectionTitleArea
      }
    >
      <Text
        style={s.sectionTitle}
      >
        {title}
      </Text>

      <Text
        style={
          s.sectionSubtitle
        }
      >
        {subtitle}
      </Text>
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={s.statCard}>
      <View style={s.statIcon}>
        <Ionicons
          name={icon as any}
          size={17}
          color="#F97316"
        />
      </View>

      <Text
        style={s.statValue}
      >
        {value}
      </Text>

      <Text
        style={s.statLabel}
      >
        {label}
      </Text>
    </View>
  );
}

/* ============================================================
   STYLE
============================================================ */

const s =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F8F7F4',
    },

    header: {
      paddingHorizontal: 20,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    eyebrow: {
      color: '#F97316',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1.2,
    },

    headerTitle: {
      color: '#202939',
      fontSize: 27,
      fontWeight: '900',
      marginTop: 3,
    },

    headerIcon: {
      width: 44,
      height: 44,
      borderRadius: 15,
      backgroundColor:
        '#FFF1E7',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    scrollView: {
      flex: 1,
    },

    scroll: {
      paddingHorizontal: 18,
      paddingBottom: 100,
    },

    weeklyCard: {
      backgroundColor:
        '#202939',
      borderRadius: 23,
      padding: 17,
      marginTop: 8,
    },

    weeklyTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    weeklyIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 11,
    },

    weeklyMini: {
      color:
        'rgba(255,255,255,0.55)',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 1,
    },

    weeklyTitle: {
      color: '#FFF',
      fontSize: 13,
      fontWeight: '900',
      marginTop: 3,
    },

    performanceBadge: {
      minWidth: 48,
      height: 31,
      borderRadius: 11,
      backgroundColor:
        'rgba(249,115,22,0.18)',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    performanceText: {
      color: '#FDBA8C',
      fontSize: 11,
      fontWeight: '900',
    },

    weeklyDescription: {
      color:
        'rgba(255,255,255,0.66)',
      fontSize: 9,
      lineHeight: 14,
      marginTop: 14,
    },

    pdfButton: {
      height: 42,
      borderRadius: 12,
      backgroundColor:
        '#F97316',
      marginTop: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 7,
    },

    pdfButtonText: {
      color: '#FFF',
      fontSize: 9,
      fontWeight: '900',
    },

    sectionTitleArea: {
      marginTop: 25,
      marginBottom: 10,
    },

    sectionTitle: {
      color: '#202939',
      fontSize: 16,
      fontWeight: '900',
    },

    sectionSubtitle: {
      color: '#98A2B3',
      fontSize: 9,
      marginTop: 3,
    },

    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    statCard: {
      width: '48.7%',
      minHeight: 100,
      borderRadius: 18,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor:
        '#F0EFED',
      padding: 13,
    },

    statIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor:
        '#FFF1E7',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    statValue: {
      color: '#202939',
      fontSize: 16,
      fontWeight: '900',
      marginTop: 10,
    },

    statLabel: {
      color: '#98A2B3',
      fontSize: 8,
      fontWeight: '700',
      marginTop: 3,
    },

    studyEntryCard: {
      backgroundColor:
        '#EEF3FF',
      borderRadius: 20,
      padding: 14,
      marginTop: 14,
    },

    studyEntryTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    blueIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 10,
    },

    cardTitle: {
      color: '#202939',
      fontSize: 11,
      fontWeight: '900',
    },

    cardSubtitle: {
      color: '#667085',
      fontSize: 8,
      lineHeight: 12,
      marginTop: 2,
    },

    timeInputRow: {
      flexDirection: 'row',
      gap: 7,
      marginTop: 13,
    },

    timeInputBox: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      backgroundColor: '#FFF',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
    },

    timeInput: {
      flex: 1,
      fontSize: 12,
      fontWeight: '800',
      color: '#202939',
    },

    timeUnit: {
      color: '#98A2B3',
      fontSize: 8,
    },

    saveTimeButton: {
      minWidth: 70,
      height: 44,
      borderRadius: 12,
      backgroundColor:
        '#4776E6',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    saveTimeText: {
      color: '#FFF',
      fontSize: 9,
      fontWeight: '900',
    },

    chartCard: {
      backgroundColor: '#FFF',
      borderRadius: 20,
      padding: 14,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    barChart: {
      height: 150,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },

    barColumn: {
      flex: 1,
      alignItems: 'center',
    },

    barValue: {
      fontSize: 7,
      color: '#667085',
      marginBottom: 5,
    },

    barTrack: {
      width: 18,
      height: 110,
      borderRadius: 8,
      backgroundColor:
        '#F2F3F5',
      justifyContent:
        'flex-end',
      overflow: 'hidden',
    },

    barFill: {
      width: '100%',
      borderRadius: 8,
      backgroundColor:
        '#F97316',
    },

    barLabel: {
      fontSize: 8,
      fontWeight: '800',
      color: '#98A2B3',
      marginTop: 7,
    },

    card: {
      backgroundColor: '#FFF',
      borderRadius: 20,
      padding: 14,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    progressTrack: {
      height: 7,
      borderRadius: 5,
      backgroundColor:
        '#F0EFED',
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      borderRadius: 5,
      backgroundColor:
        '#F97316',
    },

    konuCard: {
      backgroundColor: '#FFF',
      borderRadius: 20,
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    konuHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 13,
    },

    konuHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },

    dersIcon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      backgroundColor:
        '#FFF1E7',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    konuDers: {
      color: '#202939',
      fontSize: 12,
      fontWeight: '900',
    },

    konuSayac: {
      color: '#F97316',
      fontSize: 10,
      fontWeight: '900',
    },

    konuRow: {
      minHeight: 34,
      flexDirection: 'row',
      alignItems: 'center',
    },

    konuDurumIcon: {
      width: 23,
      height: 23,
      borderRadius: 8,
      backgroundColor:
        '#F5F5F4',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 8,
    },

    konuDurumBitti: {
      backgroundColor:
        '#E8F8F1',
    },

    konuDurumAnlamadi: {
      backgroundColor:
        '#FDECEC',
    },

    konuDurumYetismedi: {
      backgroundColor:
        '#FFF4DF',
    },

    konuAdi: {
      flex: 1,
      color: '#344054',
      fontSize: 9,
      fontWeight: '700',
    },

    konuAdiBitti: {
      color: '#667085',
    },

    konuDurumText: {
      color: '#98A2B3',
      fontSize: 7,
      fontWeight: '800',
    },

    konuProgressBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      marginTop: 13,
    },

    konuYuzde: {
      width: 31,
      color: '#F97316',
      fontSize: 8,
      fontWeight: '900',
      textAlign: 'right',
    },

    addExamButton: {
      backgroundColor:
        '#F97316',
      borderRadius: 19,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 11,
    },

    addExamIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor:
        'rgba(255,255,255,0.20)',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 11,
    },

    addExamTitle: {
      color: '#FFF',
      fontSize: 11,
      fontWeight: '900',
    },

    addExamSub: {
      color:
        'rgba(255,255,255,0.72)',
      fontSize: 8,
      lineHeight: 12,
      marginTop: 3,
    },

    examHeroCard: {
      minHeight: 120,
      borderRadius: 20,
      backgroundColor:
        '#202939',
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },

    examMini: {
      color:
        'rgba(255,255,255,0.55)',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 1,
    },

    examNet: {
      color: '#FFF',
      fontSize: 28,
      fontWeight: '900',
      marginTop: 5,
    },

    examNetUnit: {
      color: '#FDBA8C',
      fontSize: 10,
    },

    examChangeText: {
      color: '#5EE4A7',
      fontSize: 8,
      fontWeight: '800',
      marginTop: 7,
    },

    noExamCard: {
      backgroundColor: '#FFF',
      borderRadius: 18,
      padding: 20,
      alignItems: 'center',
      gap: 7,
    },

    noExamText: {
      color: '#98A2B3',
      fontSize: 9,
      fontWeight: '700',
    },

    allExamButton: {
      backgroundColor:
        '#EEF3FF',
      borderRadius: 18,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginTop: 10,
    },

    allExamMini: {
      color: '#98A2B3',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 1,
    },

    allExamText: {
      color: '#202939',
      fontSize: 11,
      fontWeight: '900',
      marginTop: 3,
    },

    historyRow: {
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor:
        '#F3F3F1',
    },

    historyIcon: {
      width: 37,
      height: 37,
      borderRadius: 12,
      backgroundColor:
        '#FFF1E7',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 10,
    },

    historyDate: {
      color: '#344054',
      fontSize: 9,
      fontWeight: '900',
    },

    historySub: {
      color: '#98A2B3',
      fontSize: 7,
      marginTop: 2,
    },

    historyScore: {
      color: '#F97316',
      fontSize: 9,
      fontWeight: '900',
    },

    emptyText: {
      color: '#98A2B3',
      textAlign: 'center',
      fontSize: 10,
      paddingVertical: 20,
    },
  });