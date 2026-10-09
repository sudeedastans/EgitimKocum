import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  KAYNAKLAR,
  type Kaynak,
} from '../../data/kaynakData';

/* ============================================================
   TYPES
============================================================ */

type Adim =
  | 'alan'
  | 'seviye'
  | 'ogrenme'
  | 'calisma'
  | 'kaynak'
  | 'program';

const ADIMLAR: Adim[] = [
  'alan',
  'seviye',
  'ogrenme',
  'calisma',
  'kaynak',
  'program',
];

const ADIM_NO: Record<Adim, number> = {
  alan: 1,
  seviye: 2,
  ogrenme: 3,
  calisma: 4,
  kaynak: 5,
  program: 6,
};

/* ============================================================
   ALAN
============================================================ */

const ALANLAR = [
  {
    id: 'tyt',
    baslik: 'TYT',
    aciklama:
      'TYT Türkçe, Matematik, Fizik, Kimya, Biyoloji, Coğrafya, Felsefe, Tarih ve Din',
    ikon: 'book-outline',
  },
  {
    id: 'sayisal',
    baslik: 'Sayısal',
    aciklama:
      'TYT + AYT Matematik, Fizik, Kimya ve Biyoloji',
    ikon: 'calculator-outline',
  },
  {
    id: 'sozel',
    baslik: 'Sözel',
    aciklama:
      'TYT + AYT Edebiyat, Tarih, Coğrafya ve Felsefe',
    ikon: 'library-outline',
  },
  {
    id: 'esit',
    baslik: 'Eşit Ağırlık',
    aciklama:
      'TYT + AYT Matematik, Edebiyat, Tarih, Coğrafya ve Felsefe',
    ikon: 'analytics-outline',
  },
];

/* ============================================================
   DERSLER
============================================================ */

const DERSLER_BY_ALAN: Record<string, string[]> = {
  tyt: [
    'TYT Türkçe',
    'TYT Matematik',
    'TYT Fizik',
    'TYT Kimya',
    'TYT Biyoloji',
    'TYT Coğrafya',
    'TYT Felsefe',
    'TYT Tarih',
    'TYT Din',
  ],

  sayisal: [
    'TYT Türkçe',
    'TYT Matematik',
    'TYT Fizik',
    'TYT Kimya',
    'TYT Biyoloji',
    'TYT Coğrafya',
    'TYT Felsefe',
    'TYT Tarih',
    'TYT Din',
    'AYT Matematik',
    'AYT Fizik',
    'AYT Kimya',
    'AYT Biyoloji',
  ],

  sozel: [
    'TYT Türkçe',
    'TYT Matematik',
    'TYT Fizik',
    'TYT Kimya',
    'TYT Biyoloji',
    'TYT Coğrafya',
    'TYT Felsefe',
    'TYT Tarih',
    'TYT Din',
    'AYT Edebiyat',
    'AYT Tarih',
    'AYT Coğrafya',
    'AYT Felsefe',
  ],

  esit: [
    'TYT Türkçe',
    'TYT Matematik',
    'TYT Fizik',
    'TYT Kimya',
    'TYT Biyoloji',
    'TYT Coğrafya',
    'TYT Felsefe',
    'TYT Tarih',
    'TYT Din',
    'AYT Matematik',
    'AYT Edebiyat',
    'AYT Tarih',
    'AYT Coğrafya',
    'AYT Felsefe',
  ],
};

/* ============================================================
   SEVİYE
============================================================ */

const SEVIYELER = [
  {
    id: 'cok-iyi',
    baslik: 'Çok İyi',
    aciklama: '30 - 40 net',
  },
  {
    id: 'iyi',
    baslik: 'İyi',
    aciklama: '20 - 30 net',
  },
  {
    id: 'orta',
    baslik: 'Orta',
    aciklama: '10 - 20 net',
  },
  {
    id: 'zayif',
    baslik: 'Geliştirilmeli',
    aciklama: '0 - 10 net',
  },
];

/* ============================================================
   ÖĞRENME STİLİ
============================================================ */

const OGRENME_STILLERI = [
  {
    id: 'yazarak',
    baslik: 'Yazarak',
    ikon: 'pencil-outline',
  },

  {
    id: 'video',
    baslik: 'Video',
    ikon: 'play-circle-outline',
  },

  {
    id: 'uygulayarak',
    baslik: 'Soru Çözerek',
    ikon: 'create-outline',
  },
];

/* ============================================================
   ÇALIŞMA ŞEKLİ
============================================================ */

const CALISMA_SEKILLERI = [
  {
    id: 'bireysel',
    baslik: 'Bireysel',
    aciklama: 'Tek başıma çalışıyorum',
    ikon: 'person-outline',
  },

  {
    id: 'okul',
    baslik: 'Okul',
    aciklama: 'Okul derslerimi takip ediyorum',
    ikon: 'school-outline',
  },

  {
    id: 'dershane',
    baslik: 'Dershane',
    aciklama: 'Bir kurs veya dershaneye gidiyorum',
    ikon: 'business-outline',
  },

  {
    id: 'ozel',
    baslik: 'Özel Ders',
    aciklama: 'Bazı derslerden özel ders alıyorum',
    ikon: 'people-outline',
  },

  {
    id: 'karisik',
    baslik: 'Karışık',
    aciklama: 'Birden fazla yöntemi birlikte kullanıyorum',
    ikon: 'layers-outline',
  },
];
/* ============================================================
   KAYNAK
============================================================ */
/* ============================================================
   PROGRAM
============================================================ */

const PROGRAM_TARZLARI = [
  {
    id: 'saatsiz',
    baslik: 'Esnek Program',
    aciklama:
      'Günlük hedeflerim olsun, hangi saatte yapacağıma ben karar vereyim.',
    ikon: 'list-outline',
  },

  {
    id: 'saatli',
    baslik: 'Saatli Program',
    aciklama:
      'Görevlerim belirli başlangıç ve bitiş saatleriyle planlansın.',
    ikon: 'time-outline',
  },
];

/* ============================================================
   COMPONENT
============================================================ */

export default function OnboardingEkrani({
  navigation,
  route,
}: any) {
  const { height } = useWindowDimensions();

  const adSoyad =
    route?.params?.adSoyad ?? 'Öğrenci';

  const basHarfler = adSoyad
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parca: string) => parca.charAt(0).toLocaleUpperCase('tr-TR'))
    .join('') || 'Ö';

  const [adim, setAdim] =
    useState<Adim>('alan');

  const [manuelKaynakInput, setManuelKaynakInput] =
    useState<Record<string, string>>({});

  const [acikKaynakDers, setAcikKaynakDers] =
    useState<string | null>(null);

  const [secimler, setSecimler] =
    useState({
      alan: '',

      seviye:
        {} as Record<string, string>,

      ogrenmeStili:
        {} as Record<string, string[]>,

      calismaSekli: '',

      karisikCalismaSekilleri:
        [] as string[],

      ozelDersler:
        [] as string[],

      kaynaklar:
        {} as Record<string, string[]>,

      manuelKaynaklar:
        {} as Record<string, string[]>,

      aiKaynakOnerisi: true,

      programTarzi: '',
    });

  const seciliDersler =
    DERSLER_BY_ALAN[
      secimler.alan
    ] ?? [];

  /* ============================================================
     NAVIGATION
  ============================================================ */

  const geri = () => {
    const index =
      ADIMLAR.indexOf(adim);

    if (index > 0) {
      setAdim(
        ADIMLAR[index - 1]
      );
    }
  };

  const ileri = (
    sonraki: Adim
  ) => {
    setAdim(sonraki);
  };

  /* ============================================================
     BAŞLIK
  ============================================================ */

  const baslik = () => {
    const map: Record<
      Adim,
      string
    > = {
      alan: 'Alanını Seç',
      seviye: 'Seviyeni Belirle',
      ogrenme: 'Nasıl Öğreniyorsun?',
      calisma: 'Nasıl Çalışıyorsun?',
      kaynak: 'Kaynaklarını Seç',
      program: 'Program Tarzın',
    };

    return map[adim];
  };

  const altBaslik = () => {
    const map: Record<
      Adim,
      string
    > = {
      alan:
        'Hazırlandığın sınav alanını seç.',

      seviye:
        'Her dersteki mevcut seviyeni belirt.',

      ogrenme:
        'Her ders için birden fazla öğrenme yöntemi seçebilirsin.',

      calisma:
        'Mevcut çalışma düzenini bize anlat.',

      kaynak:
        'Elinde bulunan kaynakları seç. AI programını bunlara göre hazırlayacak.',

      program:
        'Programının nasıl görünmesini istediğini seç.',
    };

    return map[adim];
  };

  /* ============================================================
     ÖĞRENME STİLİ
  ============================================================ */

  const ogrenmeStiliDegistir = (
    ders: string,
    stilId: string
  ) => {
    const mevcut =
      secimler.ogrenmeStili[
        ders
      ] ?? [];

    const yeni =
      mevcut.includes(stilId)
        ? mevcut.filter(
            id =>
              id !== stilId
          )
        : [
            ...mevcut,
            stilId,
          ];

    setSecimler(prev => ({
      ...prev,

      ogrenmeStili: {
        ...prev.ogrenmeStili,

        [ders]: yeni,
      },
    }));
  };

  /* ============================================================
     ÇALIŞMA ŞEKLİ
  ============================================================ */

  const karisikCalismaDegistir = (
    id: string
  ) => {
    const mevcut =
      secimler
        .karisikCalismaSekilleri;

    const yeni =
      mevcut.includes(id)
        ? mevcut.filter(
            item =>
              item !== id
          )
        : [
            ...mevcut,
            id,
          ];

    setSecimler(prev => ({
      ...prev,

      karisikCalismaSekilleri:
        yeni,
    }));
  };

  const ozelDersDegistir = (
    ders: string
  ) => {
    const mevcut =
      secimler.ozelDersler;

    const yeni =
      mevcut.includes(ders)
        ? mevcut.filter(
            item =>
              item !== ders
          )
        : [
            ...mevcut,
            ders,
          ];

    setSecimler(prev => ({
      ...prev,
      ozelDersler: yeni,
    }));
  };

  /* ============================================================
     KAYNAKLAR
  ============================================================ */

  const kaynaklariGetir = (
    ders: string
  ): Kaynak[] => {
    return KAYNAKLAR[ders] ?? [];
  };

  const kaynakTipiEtiketi = (tip: Kaynak['tip']) => {
    const etiketler: Record<Kaynak['tip'], string> = {
      'soru-bankasi': 'Soru Bankası',
      paragraf: 'Paragraf',
      'dil-bilgisi': 'Dil Bilgisi',
      'brans-denemesi': 'Branş Denemesi',
      'ders-kitabi': 'Ders Kitabı',
    };

    return etiketler[tip];
  };

  const kaynakDegistir = (
    ders: string,
    kaynakId: string
  ) => {
    const mevcut =
      secimler.kaynaklar[
        ders
      ] ?? [];

    const yeni =
      mevcut.includes(
        kaynakId
      )
        ? mevcut.filter(
            id =>
              id !==
              kaynakId
          )
        : [
            ...mevcut,
            kaynakId,
          ];

    setSecimler(prev => ({
      ...prev,

      kaynaklar: {
        ...prev.kaynaklar,

        [ders]: yeni,
      },
    }));
  };

  const manuelKaynakEkle = (
    ders: string
  ) => {
    const kaynak =
      manuelKaynakInput[
        ders
      ]?.trim();

    if (!kaynak) return;

    const mevcut =
      secimler
        .manuelKaynaklar[
        ders
      ] ?? [];

    if (
      mevcut.includes(kaynak)
    ) {
      return;
    }

    setSecimler(prev => ({
      ...prev,

      manuelKaynaklar: {
        ...prev.manuelKaynaklar,

        [ders]: [
          ...mevcut,
          kaynak,
        ],
      },
    }));

    setManuelKaynakInput(
      prev => ({
        ...prev,
        [ders]: '',
      })
    );
  };

  const manuelKaynakSil = (
    ders: string,
    kaynak: string
  ) => {
    const mevcut =
      secimler
        .manuelKaynaklar[
        ders
      ] ?? [];

    setSecimler(prev => ({
      ...prev,

      manuelKaynaklar: {
        ...prev.manuelKaynaklar,

        [ders]:
          mevcut.filter(
            item =>
              item !== kaynak
          ),
      },
    }));
  };

  /* ============================================================
     TAMAMLA
  ============================================================ */

  const tamamla = (
    programTarzi: string
  ) => {
    const finalSecimler = {
      ...secimler,
      programTarzi,
    };

    console.log(
      'Onboarding tamamlandı:',
      adSoyad,
      finalSecimler
    );

    navigation.replace(
      'Main',
      {
        adSoyad,
        secimler:
          finalSecimler,
      }
    );
  };

  /* ============================================================
     UI
  ============================================================ */

  return (
    <SafeAreaView
      style={[
        s.container,
        Platform.OS === 'web' && { height },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
      />

      {/* HEADER */}

      <View style={s.header}>
        <TouchableOpacity
          style={[
            s.backButton,
            adim === 'alan' &&
              s.backButtonHidden,
          ]}
          disabled={
            adim === 'alan'
          }
          onPress={geri}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color="#202939"
          />
        </TouchableOpacity>

        <View
          style={s.logoArea}
        >
          <View
            style={s.logoIcon}
          >
            <Ionicons
              name="school-outline"
              size={19}
              color="#F97316"
            />
          </View>

          <Text style={s.logoText}>
            EĞİTİM KOÇUM
          </Text>
        </View>

        <View
          style={{ width: 40 }}
        />
      </View>

      {/* PROGRESS */}

      <View
        style={s.progressArea}
      >
        <View
          style={s.progressTop}
        >
          <Text
            style={s.progressText}
          >
            Profilini hazırlıyoruz
          </Text>

          <Text
            style={
              s.progressNumber
            }
          >
            {ADIM_NO[adim]} /
            {ADIMLAR.length}
          </Text>
        </View>

        <View
          style={s.progressBar}
        >
          {ADIMLAR.map(
            item => (
              <View
                key={item}
                style={[
                  s.progressSegment,

                  ADIM_NO[
                    item
                  ] <=
                    ADIM_NO[
                      adim
                    ] &&
                    s.progressActive,
                ]}
              />
            )
          )}
        </View>
      </View>

      {/* TITLE */}

      <View
        style={s.titleArea}
      >
        <Text style={s.title}>
          {baslik()}
        </Text>

        <Text
          style={s.subtitle}
        >
          {altBaslik()}
        </Text>
      </View>

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* =====================================================
            ALAN
        ===================================================== */}

        {adim ===
          'alan' && (
          <>
            <View style={s.profilePreview}>
              <View style={s.initialAvatar}>
                <Text style={s.initialAvatarText}>
                  {basHarfler}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={s.profileHello}>
                  Merhaba {adSoyad.trim().split(/\s+/)[0] || 'Öğrenci'} 👋
                </Text>

            
              </View>
            </View>

            {ALANLAR.map(
              alan => (
                <SecimKarti
                  key={alan.id}
                  baslik={
                    alan.baslik
                  }
                  aciklama={
                    alan.aciklama
                  }
                  ikon={
                    alan.ikon
                  }
                  secili={
                    secimler.alan ===
                    alan.id
                  }
                  onPress={() =>
                    setSecimler(
                      prev => ({
                        ...prev,
                        alan:
                          alan.id,

                        seviye:
                          {},

                        ogrenmeStili:
                          {},

                        kaynaklar:
                          {},

                        manuelKaynaklar:
                          {},
                      })
                    )
                  }
                />
              )
            )}

            <DevamButonu
              disabled={
                !secimler.alan
              }
              onPress={() =>
                ileri(
                  'seviye'
                )
              }
            />
          </>
        )}

        {/* =====================================================
            SEVİYE
        ===================================================== */}

        {adim ===
          'seviye' && (
          <>
            {seciliDersler.map(
              ders => (
                <View
                  key={ders}
                  style={
                    s.lessonCard
                  }
                >
                  <View
                    style={
                      s.lessonHeader
                    }
                  >
                    <View
                      style={
                        s.lessonIcon
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
                        s.lessonTitle
                      }
                    >
                      {ders}
                    </Text>
                  </View>

                  <View
                    style={
                      s.chipContainer
                    }
                  >
                    {SEVIYELER.map(
                      seviye => {
                        const secili =
                          secimler
                            .seviye[
                            ders
                          ] ===
                          seviye.id;

                        return (
                          <TouchableOpacity
                            key={
                              seviye.id
                            }
                            style={[
                              s.levelChip,

                              secili &&
                                s.levelChipSelected,
                            ]}
                            onPress={() =>
                              setSecimler(
                                prev => ({
                                  ...prev,

                                  seviye:
                                    {
                                      ...prev.seviye,

                                      [ders]:
                                        seviye.id,
                                    },
                                })
                              )
                            }
                          >
                            <Text
                              style={[
                                s.levelTitle,

                                secili &&
                                  s.levelTitleSelected,
                              ]}
                            >
                              {
                                seviye.baslik
                              }
                            </Text>

                            <Text
                              style={[
                                s.levelSub,

                                secili &&
                                  s.levelSubSelected,
                              ]}
                            >
                              {
                                seviye.aciklama
                              }
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>
                </View>
              )
            )}

            <DevamButonu
              onPress={() =>
                ileri(
                  'ogrenme'
                )
              }
            />
          </>
        )}

        {/* =====================================================
            ÖĞRENME STİLİ
        ===================================================== */}

        {adim ===
          'ogrenme' && (
          <>
            {seciliDersler.map(
              ders => (
                <View
                  key={ders}
                  style={
                    s.lessonCard
                  }
                >
                  <Text
                    style={
                      s.lessonTitleStandalone
                    }
                  >
                    {ders}
                  </Text>

                  <Text
                    style={
                      s.lessonHelp
                    }
                  >
                    Birden fazla
                    seçebilirsin
                  </Text>

                  <View
                    style={
                      s.studyStyleRow
                    }
                  >
                    {OGRENME_STILLERI.map(
                      stil => {
                        const secili =
                          secimler.ogrenmeStili[
                            ders
                          ]?.includes(
                            stil.id
                          );

                        return (
                          <TouchableOpacity
                            key={
                              stil.id
                            }
                            style={[
                              s.studyStyleCard,

                              secili &&
                                s.studyStyleSelected,
                            ]}
                            onPress={() =>
                              ogrenmeStiliDegistir(
                                ders,
                                stil.id
                              )
                            }
                          >
                            <Ionicons
                              name={
                                stil.ikon as any
                              }
                              size={
                                18
                              }
                              color={
                                secili
                                  ? '#F97316'
                                  : '#667085'
                              }
                            />

                            <Text
                              style={[
                                s.studyStyleText,

                                secili &&
                                  s.studyStyleTextSelected,
                              ]}
                            >
                              {
                                stil.baslik
                              }
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>
                </View>
              )
            )}

            <DevamButonu
              onPress={() =>
                ileri(
                  'calisma'
                )
              }
            />
          </>
        )}

        {/* =====================================================
            ÇALIŞMA
        ===================================================== */}

        {adim ===
          'calisma' && (
          <>
            {CALISMA_SEKILLERI.map(
              calisma => (
                <SecimKarti
                  key={
                    calisma.id
                  }
                  baslik={
                    calisma.baslik
                  }
                  aciklama={
                    calisma.aciklama
                  }
                  ikon={
                    calisma.ikon
                  }
                  secili={
                    secimler.calismaSekli ===
                    calisma.id
                  }
                  onPress={() =>
                    setSecimler(
                      prev => ({
                        ...prev,

                        calismaSekli:
                          calisma.id,
                      })
                    )
                  }
                />
              )
            )}

            {secimler.calismaSekli ===
              'karisik' && (
              <View
                style={
                  s.extraCard
                }
              >
                <Text
                  style={
                    s.extraTitle
                  }
                >
                  Hangi yöntemleri
                  kullanıyorsun?
                </Text>

                <View
                  style={
                    s.chipContainer
                  }
                >
                  {CALISMA_SEKILLERI.filter(
                    item =>
                      item.id !==
                      'karisik'
                  ).map(item => {
                    const secili =
                      secimler.karisikCalismaSekilleri.includes(
                        item.id
                      );

                    return (
                      <TouchableOpacity
                        key={
                          item.id
                        }
                        style={[
                          s.simpleChip,

                          secili &&
                            s.simpleChipSelected,
                        ]}
                        onPress={() =>
                          karisikCalismaDegistir(
                            item.id
                          )
                        }
                      >
                        <Text
                          style={[
                            s.simpleChipText,

                            secili &&
                              s.simpleChipTextSelected,
                          ]}
                        >
                          {
                            item.baslik
                          }
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {secimler.calismaSekli ===
              'ozel' && (
              <View
                style={
                  s.extraCard
                }
              >
                <Text
                  style={
                    s.extraTitle
                  }
                >
                  Hangi derslerden
                  özel ders alıyorsun?
                </Text>

                <View
                  style={
                    s.chipContainer
                  }
                >
                  {seciliDersler.map(
                    ders => {
                      const secili =
                        secimler.ozelDersler.includes(
                          ders
                        );

                      return (
                        <TouchableOpacity
                          key={
                            ders
                          }
                          style={[
                            s.simpleChip,

                            secili &&
                              s.simpleChipSelected,
                          ]}
                          onPress={() =>
                            ozelDersDegistir(
                              ders
                            )
                          }
                        >
                          <Text
                            style={[
                              s.simpleChipText,

                              secili &&
                                s.simpleChipTextSelected,
                            ]}
                          >
                            {ders}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>
              </View>
            )}

            <DevamButonu
              disabled={
                !secimler.calismaSekli
              }
              onPress={() =>
                ileri(
                  'kaynak'
                )
              }
            />
          </>
        )}

        {/* =====================================================
            KAYNAKLAR
        ===================================================== */}

        {adim === 'kaynak' && (
  <>
    {seciliDersler.map(ders => {
      const kaynaklar = kaynaklariGetir(ders);

      const soruKaynaklari = kaynaklar.filter(
        kaynak => kaynak.tip !== 'brans-denemesi'
      );

      const denemeler = kaynaklar.filter(
        kaynak => kaynak.tip === 'brans-denemesi'
      );

      const seciliKaynaklar =
        secimler.kaynaklar[ders] ?? [];

      const manuelKaynaklar =
        secimler.manuelKaynaklar[ders] ?? [];

      const acik = acikKaynakDers === ders;

      const toplamSecili =
        seciliKaynaklar.length +
        manuelKaynaklar.length;

      return (
        <View
          key={ders}
          style={[
            s.sourceCard,
            acik && s.sourceCardOpen,
          ]}
        >
          {/* DERS BAŞLIĞI */}

          <TouchableOpacity
            style={s.sourceHeaderButton}
            activeOpacity={0.8}
            onPress={() =>
              setAcikKaynakDers(
                acik ? null : ders
              )
            }
          >
            <View style={s.sourceIcon}>
              <Ionicons
                name="library-outline"
                size={18}
                color="#F97316"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={s.sourceTitle}>
                {ders}
              </Text>

              <Text style={s.sourceSubtitle}>
                {toplamSecili > 0
                  ? `${toplamSecili} kaynak seçildi`
                  : 'Kaynak seç'}
              </Text>
            </View>

            {toplamSecili > 0 && (
              <View style={s.sourceCount}>
                <Text style={s.sourceCountText}>
                  {toplamSecili}
                </Text>
              </View>
            )}

            <Ionicons
              name={
                acik
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={19}
              color="#98A2B3"
            />
          </TouchableOpacity>

          {/* SADECE DERS AÇIKSA KAYNAKLARI GÖSTER */}

          {acik && (
            <View style={s.sourceContent}>
              {kaynaklar.length > 0 ? (
                <>
                  {soruKaynaklari.length > 0 && (
                    <>
                      <Text style={s.sourceSectionLabel}>
                        SORU BANKALARI / KAYNAKLAR
                      </Text>

                      {soruKaynaklari.map(kaynak => (
                        <KaynakSatiri
                          key={kaynak.id}
                          kaynak={kaynak}
                          secili={seciliKaynaklar.includes(kaynak.id)}
                          tipEtiketi={kaynakTipiEtiketi(kaynak.tip)}
                          onPress={() =>
                            kaynakDegistir(ders, kaynak.id)
                          }
                        />
                      ))}
                    </>
                  )}

                  {denemeler.length > 0 && (
                    <View style={s.sourceGroupSpacing}>
                      <Text style={s.sourceSectionLabel}>
                        BRANŞ DENEMELERİ
                      </Text>

                      {denemeler.map(kaynak => (
                        <KaynakSatiri
                          key={kaynak.id}
                          kaynak={kaynak}
                          secili={seciliKaynaklar.includes(kaynak.id)}
                          tipEtiketi={kaynakTipiEtiketi(kaynak.tip)}
                          onPress={() =>
                            kaynakDegistir(ders, kaynak.id)
                          }
                        />
                      ))}
                    </View>
                  )}
                </>
              ) : (
                <View style={s.noSource}>
                  <Ionicons
                    name="information-circle-outline"
                    size={17}
                    color="#98A2B3"
                  />

                  <Text style={s.noSourceText}>
                    Bu ders için katalog henüz
                    hazırlanıyor. Kaynağını aşağıdan
                    kendin ekleyebilirsin.
                  </Text>
                </View>
              )}

              {/* MANUEL EKLENEN KAYNAKLAR */}

              {manuelKaynaklar.length > 0 && (
                <View style={s.manualList}>
                  <Text style={s.sourceSectionLabel}>
                    EKLEDİĞİN KAYNAKLAR
                  </Text>

                  {manuelKaynaklar.map(kaynak => (
                    <View
                      key={kaynak}
                      style={s.manualSourceItem}
                    >
                      <Ionicons
                        name="book-outline"
                        size={15}
                        color="#F97316"
                      />

                      <Text
                        style={s.manualSourceText}
                      >
                        {kaynak}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          manuelKaynakSil(
                            ders,
                            kaynak
                          )
                        }
                      >
                        <Ionicons
                          name="close-circle"
                          size={18}
                          color="#C5CAD1"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* LİSTEDE YOK */}

              <Text style={s.manualLabel}>
                Kaynağın listede yok mu?
              </Text>

              <View
                style={s.manualInputContainer}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={18}
                  color="#F97316"
                />

                <TextInput
                  value={
                    manuelKaynakInput[ders] ??
                    ''
                  }
                  onChangeText={text =>
                    setManuelKaynakInput(
                      prev => ({
                        ...prev,
                        [ders]: text,
                      })
                    )
                  }
                  style={s.manualInput}
                  placeholder="Kaynak adını yaz"
                  placeholderTextColor="#A8AFBA"
                  returnKeyType="done"
                  onSubmitEditing={() =>
                    manuelKaynakEkle(ders)
                  }
                />

                <TouchableOpacity
                  style={s.addSourceButton}
                  onPress={() =>
                    manuelKaynakEkle(ders)
                  }
                >
                  <Text style={s.addSourceText}>
                    Ekle
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    })}

    {/* AI ÖNERİ */}

    <View style={s.aiCard}>
      <View style={s.aiIcon}>
        <Ionicons
          name="sparkles"
          size={21}
          color="#4776E6"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={s.aiTitle}>
          AI kaynak önerileri
        </Text>

        <Text style={s.aiText}>
          Seviyene ve eksik konularına göre
          gerektiğinde alternatif kaynaklar
          önerebiliriz.
        </Text>
      </View>

      <Switch
        value={secimler.aiKaynakOnerisi}
        onValueChange={value =>
          setSecimler(prev => ({
            ...prev,
            aiKaynakOnerisi: value,
          }))
        }
        trackColor={{
          false: '#E5E7EB',
          true: '#FDBA8C',
        }}
        thumbColor={
          secimler.aiKaynakOnerisi
            ? '#F97316'
            : '#FFF'
        }
      />
    </View>

    <DevamButonu
      onPress={() => ileri('program')}
    />
  </>
)}

        {/* =====================================================
            PROGRAM
        ===================================================== */}

        {adim ===
          'program' && (
          <>
            {PROGRAM_TARZLARI.map(
              program => (
                <SecimKarti
                  key={
                    program.id
                  }
                  baslik={
                    program.baslik
                  }
                  aciklama={
                    program.aciklama
                  }
                  ikon={
                    program.ikon
                  }
                  secili={
                    secimler.programTarzi ===
                    program.id
                  }
                  onPress={() =>
                    setSecimler(
                      prev => ({
                        ...prev,

                        programTarzi:
                          program.id,
                      })
                    )
                  }
                />
              )
            )}

            <TouchableOpacity
              disabled={
                !secimler.programTarzi
              }
              style={[
                s.finishButton,

                !secimler.programTarzi &&
                  s.continueDisabled,
              ]}
              onPress={() =>
                tamamla(
                  secimler.programTarzi
                )
              }
            >
              <View>
                <Text
                  style={
                    s.finishMini
                  }
                >
                  HER ŞEY HAZIR
                </Text>

                <Text
                  style={
                    s.finishText
                  }
                >
                  Programımı Oluştur
                </Text>
              </View>

              <View
                style={
                  s.finishArrow
                }
              >
                <Ionicons
                  name="sparkles"
                  size={18}
                  color="#F97316"
                />
              </View>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============================================================
   REUSABLE COMPONENTS
============================================================ */

function SecimKarti({
  baslik,
  aciklama,
  secili,
  onPress,
  ikon,
}: any) {
  return (
    <TouchableOpacity
      style={[
        s.optionCard,

        secili &&
          s.optionCardSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        style={[
          s.optionIcon,

          secili &&
            s.optionIconSelected,
        ]}
      >
        <Ionicons
          name={ikon}
          size={21}
          color={
            secili
              ? '#F97316'
              : '#667085'
          }
        />
      </View>

      <View
        style={{ flex: 1 }}
      >
        <Text
          style={[
            s.optionTitle,

            secili &&
              s.optionTitleSelected,
          ]}
        >
          {baslik}
        </Text>

        <Text
          style={
            s.optionDescription
          }
        >
          {aciklama}
        </Text>
      </View>

      <View
        style={[
          s.optionRadio,

          secili &&
            s.optionRadioSelected,
        ]}
      >
        {secili && (
          <View
            style={
              s.optionRadioDot
            }
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

function KaynakSatiri({
  kaynak,
  secili,
  tipEtiketi,
  onPress,
}: {
  kaynak: Kaynak;
  secili: boolean;
  tipEtiketi: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        s.sourceOption,
        secili && s.sourceOptionSelected,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          s.checkbox,
          secili && s.checkboxSelected,
        ]}
      >
        {secili && (
          <Ionicons
            name="checkmark"
            size={13}
            color="#FFF"
          />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={s.sourceName}>
          {kaynak.ad}
        </Text>

        <View style={s.sourceMeta}>
          <Text style={s.sourceType}>
            {tipEtiketi}
          </Text>

          <View style={s.sourceDot} />

          <Text style={s.sourceDifficulty}>
            {kaynak.zorluk}
          </Text>
        </View>

        {kaynak.aciklama && (
          <Text style={s.sourceDescription}>
            {kaynak.aciklama}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function DevamButonu({
  onPress,
  disabled = false,
}: {
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        s.continueButton,

        disabled &&
          s.continueDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        style={
          s.continueText
        }
      >
        Devam Et
      </Text>

      <View
        style={
          s.continueArrow
        }
      >
        <Ionicons
          name="arrow-forward"
          size={17}
          color="#F97316"
        />
      </View>
    </TouchableOpacity>
  );
}

/* ============================================================
   STYLE
============================================================ */

const s = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#F8F7F4',
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    height: 60,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEDEB',
  },

  backButtonHidden: {
    opacity: 0,
  },

  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#FFF1E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: '#202939',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },

  /* PROGRESS */

  progressArea: {
    paddingHorizontal: 20,
    marginTop: 12,
  },

  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressText: {
    color: '#98A2B3',
    fontSize: 9,
    fontWeight: '700',
  },

  progressNumber: {
    color: '#F97316',
    fontSize: 9,
    fontWeight: '900',
  },

  progressBar: {
    flexDirection: 'row',
    gap: 5,
  },

  progressSegment: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E6E4E1',
  },

  progressActive: {
    backgroundColor: '#F97316',
  },

  /* TITLE */

  titleArea: {
    paddingHorizontal: 20,
    marginTop: 27,
    marginBottom: 20,
  },

  title: {
    color: '#202939',
    fontSize: 27,
    fontWeight: '900',
  },

  subtitle: {
    color: '#667085',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
    maxWidth: '92%',
  },

  scrollView: {
    flex: 1,
    minHeight: 0,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 80,
  },
  /* PROFILE PREVIEW */

  profilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0EFED',
  },

  initialAvatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#FFF1E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FBC49E',
  },

  initialAvatarText: {
    color: '#F97316',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  profileHello: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
  },

  profileHint: {
    color: '#667085',
    fontSize: 9,
    lineHeight: 13,
    marginTop: 3,
  },

  badgeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 7,
  },

  badgeHintText: {
    color: '#F97316',
    fontSize: 8,
    fontWeight: '800',
  },

  /* OPTIONS */

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 19,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#EEEDEB',
  },

  optionCardSelected: {
    backgroundColor: '#FFF8F3',
    borderColor: '#F97316',
  },

  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F5F6F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  optionIconSelected: {
    backgroundColor: '#FFF1E7',
  },

  optionTitle: {
    color: '#202939',
    fontSize: 14,
    fontWeight: '900',
  },

  optionTitleSelected: {
    color: '#F97316',
  },

  optionDescription: {
    color: '#667085',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  optionRadio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  optionRadioSelected: {
    borderColor: '#F97316',
  },

  optionRadioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#F97316',
  },

  /* LESSON */

  lessonCard: {
    backgroundColor: '#FFF',
    borderRadius: 19,
    padding: 15,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#F0EFED',
  },

  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  lessonIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#FFF1E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  lessonTitle: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
  },

  lessonTitleStandalone: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
  },

  lessonHelp: {
    color: '#98A2B3',
    fontSize: 9,
    marginTop: 2,
    marginBottom: 10,
  },

  /* LEVEL */

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  levelChip: {
    minWidth: '47%',
    backgroundColor: '#F7F7F6',
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#EEEDEB',
  },

  levelChipSelected: {
    backgroundColor: '#FFF1E7',
    borderColor: '#F97316',
  },

  levelTitle: {
    color: '#344054',
    fontSize: 10,
    fontWeight: '800',
  },

  levelTitleSelected: {
    color: '#F97316',
  },

  levelSub: {
    color: '#98A2B3',
    fontSize: 8,
    marginTop: 2,
  },

  levelSubSelected: {
    color: '#C65C0B',
  },

  /* STUDY STYLE */

  studyStyleRow: {
    flexDirection: 'row',
    gap: 7,
  },

  studyStyleCard: {
    flex: 1,
    backgroundColor: '#F7F7F6',
    borderRadius: 13,
    paddingVertical: 11,
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#EEEDEB',
  },

  studyStyleSelected: {
    backgroundColor: '#FFF1E7',
    borderColor: '#F97316',
  },

  studyStyleText: {
    color: '#667085',
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
  },

  studyStyleTextSelected: {
    color: '#F97316',
  },

  /* EXTRA */

  extraCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
  },

  extraTitle: {
    color: '#202939',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 10,
  },

  simpleChip: {
    backgroundColor: '#F5F6F7',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 12,
  },

  simpleChipSelected: {
    backgroundColor: '#FFF1E7',
  },

  simpleChipText: {
    color: '#667085',
    fontSize: 9,
    fontWeight: '700',
  },

  simpleChipTextSelected: {
    color: '#F97316',
  },

  /* SOURCE */

  sourceCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0EFED',
    overflow: 'hidden',
  },

  sourceCardOpen: {
    borderColor: '#FBC49E',
  },

  sourceHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  sourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#FFF1E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  sourceTitle: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
  },

  sourceSubtitle: {
    color: '#98A2B3',
    fontSize: 9,
    marginTop: 2,
  },

  sourceCount: {
    minWidth: 25,
    height: 25,
    paddingHorizontal: 7,
    borderRadius: 13,
    backgroundColor: '#FFF1E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  sourceCountText: {
    color: '#F97316',
    fontSize: 9,
    fontWeight: '900',
  },

  sourceContent: {
    borderTopWidth: 1,
    borderTopColor: '#F4F3F1',
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 12,
  },

  sourceSectionLabel: {
    color: '#98A2B3',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 7,
  },

  sourceGroupSpacing: {
    marginTop: 14,
  },

  sourceOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 11,
    borderRadius: 13,
    marginBottom: 6,
    backgroundColor: '#F8F8F7',
    borderWidth: 1,
    borderColor: '#F0EFED',
  },

  sourceOptionSelected: {
    backgroundColor: '#FFF8F3',
    borderColor: '#FBC49E',
  },

  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },

  sourceName: {
    color: '#344054',
    fontSize: 10,
    fontWeight: '800',
  },

  sourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  sourceType: {
    color: '#98A2B3',
    fontSize: 8,
    textTransform: 'capitalize',
  },

  sourceDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#D0D5DD',
    marginHorizontal: 6,
  },

  sourceDifficulty: {
    color: '#F97316',
    fontSize: 8,
    textTransform: 'capitalize',
    fontWeight: '700',
  },

  sourceDescription: {
    color: '#98A2B3',
    fontSize: 8,
    lineHeight: 12,
    marginTop: 4,
  },

  noSource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7F7F6',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },

  noSourceText: {
    flex: 1,
    color: '#98A2B3',
    fontSize: 9,
    lineHeight: 13,
  },

  manualList: {
    marginTop: 9,
  },

  manualSourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E7',
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 7,
  },

  manualSourceText: {
    flex: 1,
    color: '#9A3412',
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 7,
  },

  manualLabel: {
    color: '#667085',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 6,
  },

  manualInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F6',
    borderRadius: 13,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#EEEDEB',
  },

  manualInput: {
    flex: 1,
    height: 44,
    color: '#202939',
    fontSize: 9,
    marginLeft: 7,
  },

  addSourceButton: {
    backgroundColor: '#FFF1E7',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  addSourceText: {
    color: '#F97316',
    fontSize: 8,
    fontWeight: '900',
  },

  /* AI */

  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF3FF',
    borderRadius: 19,
    padding: 14,
    marginTop: 3,
    marginBottom: 5,
  },

  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  aiTitle: {
    color: '#202939',
    fontSize: 11,
    fontWeight: '900',
  },

  aiText: {
    color: '#667085',
    fontSize: 8,
    lineHeight: 12,
    marginTop: 2,
    paddingRight: 5,
  },

  /* CONTINUE */

  continueButton: {
    height: 53,
    borderRadius: 17,
    backgroundColor: '#F97316',
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  continueDisabled: {
    opacity: 0.4,
  },

  continueText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },

  continueArrow: {
    position: 'absolute',
    right: 9,
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* FINISH */

  finishButton: {
    backgroundColor: '#F97316',
    borderRadius: 19,
    padding: 16,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  finishMini: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },

  finishText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },

  finishArrow: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
