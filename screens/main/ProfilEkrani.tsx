import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  type HaftalikProgram,
  type Gorev,
} from '../../data/programData';

type Props = {
  navigation: any;
  route: any;
  program: HaftalikProgram;
  setProgram?: any;
};

export default function ProfilEkrani({
  navigation,
  route,
  program,
}: Props) {

  /* ============================================================
     USER DATA
  ============================================================ */

  const adSoyad =
    route?.params?.adSoyad ??
    'Öğrenci';

  const secimler =
    route?.params?.secimler ??
    {};


  const [
    aktifModal,
    setAktifModal,
  ] =
    useState<
      | 'profil'
      | 'bildirim'
      | 'rozet'
      | 'yardim'
      | null
    >(null);

  const [
    bildirimler,
    setBildirimler,
  ] = useState({
    program: true,
    calisma: true,
    deneme: true,
  });

  const [
    acikSss,
    setAcikSss,
  ] =
    useState<
      number | null
    >(null);

  const kullaniciStorageId =
    String(
      route?.params?.userId ??
      route?.params?.email ??
      adSoyad
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

  const bildirimStorageKey =
    `profil-bildirimler-${kullaniciStorageId}`;

  useEffect(() => {
    const yukle =
      async () => {
        try {
          const kayitli =
            await AsyncStorage.getItem(
              bildirimStorageKey
            );

          if (kayitli) {
            setBildirimler(
              JSON.parse(
                kayitli
              )
            );
          }
        } catch (error) {
          console.log(
            'Bildirim ayarları yüklenemedi:',
            error
          );
        }
      };

    yukle();
  }, [
    bildirimStorageKey,
  ]);

  const bildirimDegistir =
    async (
      alan:
        | 'program'
        | 'calisma'
        | 'deneme'
    ) => {
      const yeni = {
        ...bildirimler,

        [alan]:
          !bildirimler[
            alan
          ],
      };

      setBildirimler(
        yeni
      );

      try {
        await AsyncStorage.setItem(
          bildirimStorageKey,
          JSON.stringify(
            yeni
          )
        );
      } catch (error) {
        console.log(
          'Bildirim ayarları kaydedilemedi:',
          error
        );
      }
    };

  const isim =
    adSoyad
      .trim()
      .split(' ')[0] ||
    'Öğrenci';

  const avatar =
    secimler?.avatar;

  const alan =
  secimler?.alan ||
  '';

const calismaSekli =
  secimler?.calismaSekli ||
  '';

const programTarzi =
  secimler?.programTarzi ||
  '';


const calismaSekliMetni = () => {
  const map: Record<string, string> = {
    bireysel: 'Bireysel',
    okul: 'Okul',
    dershane: 'Dershane',
    ozel: 'Özel Ders',
    karisik: 'Karışık',
  };

  return map[calismaSekli] ?? 'Henüz seçilmedi';
};

const programTarziMetni = () => {
  const map: Record<string, string> = {
    saatsiz: 'Esnek Program',
    saatli: 'Saatli Program',
  };

  return map[programTarzi] ?? 'Henüz seçilmedi';
};

  /* ============================================================
     PROGRAM STATS
  ============================================================ */

  const gorevler =
    useMemo(
      () =>
        Object.values(
          program
        ).flat() as Gorev[],
      [program]
    );

  const toplamGorev =
    gorevler.length;

  const tamamlananGorev =
    gorevler.filter(
      gorev =>
        gorev.durum ===
        'bitti'
    ).length;

  const anlamadim =
    gorevler.filter(
      gorev =>
        gorev.durum ===
        'anlamadim'
    ).length;

  const dersSayisi =
    new Set(
      gorevler.map(
        gorev =>
          gorev.ders
      )
    ).size;

  const tamamlanma =
    toplamGorev
      ? Math.round(
          (
            tamamlananGorev /
            toplamGorev
          ) *
            100
        )
      : 0;


  const tamamlananGunSayisi =
    useMemo(
      () =>
        Object.values(
          program
        ).filter(
          gunGorevleri =>
            gunGorevleri.length >
              0 &&
            gunGorevleri.some(
              gorev =>
                gorev.durum ===
                'bitti'
            )
        ).length,
      [program]
    );

  const tamamenBitenGunSayisi =
    useMemo(
      () =>
        Object.values(
          program
        ).filter(
          gunGorevleri =>
            gunGorevleri.length >
              0 &&
            gunGorevleri.every(
              gorev =>
                gorev.durum ===
                'bitti'
            )
        ).length,
      [program]
    );

  const rozetler =
    useMemo(
      () => [
        {
          id:
            'ilk-adim',

          emoji:
            '🌱',

          baslik:
            'İlk Adım',

          aciklama:
            'İlk görevini tamamla.',

          kazanildi:
            tamamlananGorev >=
            1,
        },

        {
          id:
            'bes-gorev',

          emoji:
            '⭐',

          baslik:
            'İyi Başlangıç',

          aciklama:
            '5 görevi tamamla.',

          kazanildi:
            tamamlananGorev >=
            5,
        },

        {
          id:
            'on-gorev',

          emoji:
            '🏆',

          baslik:
            'Görev Avcısı',

          aciklama:
            '10 görevi tamamla.',

          kazanildi:
            tamamlananGorev >=
            10,
        },

        {
          id:
            'uc-gun',

          emoji:
            '🔥',

          baslik:
            'Düzenli Çalışan',

          aciklama:
            '3 farklı günde en az bir görev tamamla.',

          kazanildi:
            tamamlananGunSayisi >=
            3,
        },

        {
          id:
            'tam-gun',

          emoji:
            '✅',

          baslik:
            'Tam Gün',

          aciklama:
            'Bir günün bütün görevlerini tamamla.',

          kazanildi:
            tamamenBitenGunSayisi >=
            1,
        },

        {
          id:
            'hafta',

          emoji:
            '👑',

          baslik:
            'Haftanın Yıldızı',

          aciklama:
            'Haftadaki tüm görevleri tamamla.',

          kazanildi:
            toplamGorev >
              0 &&
            tamamlananGorev ===
              toplamGorev,
        },
      ],
      [
        tamamlananGorev,
        tamamlananGunSayisi,
        tamamenBitenGunSayisi,
        toplamGorev,
      ]
    );

  const kazanilanRozet =
    rozetler.filter(
      rozet =>
        rozet.kazanildi
    ).length;

  /* ============================================================
     HELPERS
  ============================================================ */

  const alanMetni =
    () => {

      const map:
        Record<
          string,
          string
        > = {
        sayisal:
          'Sayısal',
        sozel:
          'Sözel',
        esit:
          'Eşit Ağırlık',
        tyt:
          'TYT',
      };

      return (
        map[
          String(
            alan
          ).toLowerCase()
        ] ?? alan
      );
    };

  const cikisiTamamla =
    () => {
      /*
        Profil ekranı Tab Navigator içinde olduğu için
        doğrudan navigation.reset({ name: 'Giris' })
        çalışmayabilir.

        En üst navigator'a kadar çıkıp resetliyoruz.
      */
      let rootNavigation =
        navigation;

      while (
        rootNavigation?.getParent?.()
      ) {
        rootNavigation =
          rootNavigation.getParent();
      }

      try {
        rootNavigation.reset({
          index: 0,

          routes: [
            {
              name:
                'Giris',
            },
          ],
        });
      } catch (error) {
        console.log(
          'Çıkış yönlendirme hatası:',
          error
        );

        /*
          Reset desteklenmezse ikinci yol.
        */
        rootNavigation.navigate(
          'Giris'
        );
      }
    };

  const cikisYap =
    () => {
      /*
        React Native Web'de Alert.alert bazı durumlarda
        görünmeyebiliyor. Web'de tarayıcının confirm'ini,
        iOS/Android'de Alert'i kullanıyoruz.
      */
      if (
        Platform.OS ===
        'web'
      ) {
        const onay =
          typeof globalThis.confirm ===
          'function'
            ? globalThis.confirm(
                'Hesabından çıkmak istiyor musun?'
              )
            : true;

        if (onay) {
          cikisiTamamla();
        }

        return;
      }

      Alert.alert(
        'Çıkış Yap',
        'Hesabından çıkmak istiyor musun?',
        [
          {
            text:
              'Vazgeç',

            style:
              'cancel',
          },

          {
            text:
              'Çıkış Yap',

            style:
              'destructive',

            onPress:
              cikisiTamamla,
          },
        ]
      );
    };

  /* ============================================================
     MENU
  ============================================================ */

  const MENU = [
    {
      ikon:
        'person-outline',

      etiket:
        'Profil bilgilerim',

      alt:
        'İsim ve öğrenci bilgileri',

      onPress: () =>
        setAktifModal(
          'profil'
        ),
    },

    {
      ikon:
        'notifications-outline',

      etiket:
        'Bildirimler',

      alt:
        'Program ve çalışma hatırlatmaları',

      onPress: () =>
        setAktifModal(
          'bildirim'
        ),
    },

    {
      ikon:
        'trophy-outline',

      etiket:
        'Başarılar & Rozetler',

      alt:
        `${kazanilanRozet}/${rozetler.length} rozet kazanıldı`,

      onPress: () =>
        setAktifModal(
          'rozet'
        ),
    },

    {
      ikon:
        'bar-chart-outline',

      etiket:
        'İstatistiklerim',

      alt:
        'Haftalık gelişimini incele',

      onPress: () =>
        navigation.navigate(
          'Raporlar'
        ),
    },

    {
      ikon:
        'help-circle-outline',

      etiket:
        'Yardım & SSS',

      alt:
        'Eğitim Koçum hakkında yardım',

      onPress: () =>
        setAktifModal(
          'yardim'
        ),
    },
  ];

  /* ============================================================
     UI
  ============================================================ */

  return (
    <SafeAreaView
      style={
        s.container
      }
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          s.scroll
        }
      >

        {/* ======================================================
            PROFILE HERO
        ====================================================== */}

        <View
          style={
            s.profileCard
          }
        >

          <View
            style={
              s.profileTop
            }
          >

            {avatar ? (

              <Image
                source={{
                  uri:
                    `https://api.dicebear.com/9.x/thumbs/png?seed=${avatar}`,
                }}
                style={
                  s.avatar
                }
              />

            ) : (

              <View
                style={
                  s.avatarFallback
                }
              >

                <Text
                  style={
                    s.avatarText
                  }
                >
                  {isim
                    .charAt(0)
                    .toUpperCase()}
                </Text>

              </View>

            )}

            <View
              style={{
                flex: 1,
              }}
            >

              <Text
                style={
                  s.profileMini
                }
              >
                PROFİLİM
              </Text>

              <Text
                style={
                  s.name
                }
              >
                {adSoyad}
              </Text>

              <Text
                style={
                  s.fieldText
                }
              >
                {alanMetni()} öğrencisi
              </Text>

            </View>

            <TouchableOpacity
              style={
                s.editButton
              }
              onPress={() =>
                setAktifModal(
                  'profil'
                )
              }
            >

              <Ionicons
                name="pencil-outline"
                size={17}
                color="#FFF"
              />

            </TouchableOpacity>

          </View>

          <View
            style={
              s.badge
            }
          >

            <Ionicons
              name="sparkles"
              size={13}
              color="#FDBA8C"
            />

            <Text
              style={
                s.badgeText
              }
            >
              Eğitim Koçum Öğrencisi
            </Text>

          </View>

        </View>

        {/* ======================================================
            STUDENT PROFILE
        ====================================================== */}

        <View
          style={
            s.sectionHeader
          }
        >

          <View>

            <Text
              style={
                s.sectionTitle
              }
            >
              Çalışma profilim
            </Text>

            <Text
              style={
                s.sectionSubtitle
              }
            >
              Programın hazırlanırken kullanılan tercihler
            </Text>

          </View>

        </View>

        <View
          style={
            s.preferenceGrid
          }
        >

          <PreferenceCard
  icon="school-outline"
  title="Alanım"
  value={alanMetni()}
/>

<PreferenceCard
  icon="time-outline"
  title="Çalışma şeklim"
  value={calismaSekliMetni()}
/>

<PreferenceCard
  icon="calendar-outline"
  title="Program tarzım"
  value={programTarziMetni()}
/>

<PreferenceCard
  icon="library-outline"
  title="Aktif ders"
  value={`${dersSayisi} ders`}
/>

        </View>

        {/* ======================================================
            MENU
        ====================================================== */}

        <View
          style={
            s.sectionHeader
          }
        >

          <View>

            <Text
              style={
                s.sectionTitle
              }
            >
              Hesabım
            </Text>

            <Text
              style={
                s.sectionSubtitle
              }
            >
              Profil ve uygulama ayarları
            </Text>

          </View>

        </View>

        <View
          style={
            s.menuCard
          }
        >

          {MENU.map(
            (
              item,
              index
            ) => (

              <TouchableOpacity
                key={
                  item.etiket
                }
                style={[
                  s.menuRow,

                  index !==
                    MENU.length -
                      1 &&
                    s.menuBorder,
                ]}
                activeOpacity={
                  0.7
                }
                onPress={
                  item.onPress
                }
              >

                <View
                  style={
                    s.menuIcon
                  }
                >

                  <Ionicons
                    name={
                      item.ikon as any
                    }
                    size={19}
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
                      s.menuTitle
                    }
                  >
                    {item.etiket}
                  </Text>

                  <Text
                    style={
                      s.menuSubtitle
                    }
                  >
                    {item.alt}
                  </Text>

                </View>

                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color="#C6CAD1"
                />

              </TouchableOpacity>

            )
          )}

        </View>

        {/* ======================================================
            LOGOUT
        ====================================================== */}

        <TouchableOpacity
          style={
            s.logoutButton
          }
          onPress={
            cikisYap
          }
        >

          <Ionicons
            name="log-out-outline"
            size={18}
            color="#D14343"
          />

          <Text
            style={
              s.logoutText
            }
          >
            Çıkış Yap
          </Text>

        </TouchableOpacity>

        <Text
          style={
            s.version
          }
        >
          Eğitim Koçum · v1.0
        </Text>

      </ScrollView>

      {/* ======================================================
          PROFİL BİLGİLERİ
      ====================================================== */}

      <Modal
        visible={
          aktifModal ===
          'profil'
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setAktifModal(
            null
          )
        }
      >
        <View
          style={
            s.modalOverlay
          }
        >
          <View
            style={
              s.modalSheet
            }
          >
            <ModalHeader
              title="Profil bilgilerim"
              subtitle="Kişisel ve çalışma tercihlerin"
              onClose={() =>
                setAktifModal(
                  null
                )
              }
            />

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >
              <InfoRow
                icon="person-outline"
                label="Ad Soyad"
                value={adSoyad}
              />

              <InfoRow
                icon="school-outline"
                label="Alan"
                value={
                  alanMetni() ||
                  'Henüz seçilmedi'
                }
              />

              <InfoRow
                icon="time-outline"
                label="Çalışma şekli"
                value={
                  calismaSekliMetni()
                }
              />

              <InfoRow
                icon="calendar-outline"
                label="Program tarzı"
                value={
                  programTarziMetni()
                }
              />

              <InfoRow
                icon="library-outline"
                label="Aktif ders"
                value={`${dersSayisi} ders`}
              />

              {Array.isArray(
                secimler?.ozelDersler
              ) &&
                secimler
                  .ozelDersler
                  .length >
                  0 && (
                  <InfoRow
                    icon="bookmark-outline"
                    label="Özel dersler"
                    value={
                      secimler
                        .ozelDersler
                        .join(
                          ', '
                        )
                    }
                  />
                )}

              <View
                style={
                  s.modalInfoNote
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={17}
                  color="#4776E6"
                />

                <Text
                  style={
                    s.modalInfoNoteText
                  }
                >
                  Bu bilgiler onboarding sırasında verdiğin tercihlerden geliyor.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ======================================================
          BİLDİRİMLER
      ====================================================== */}

      <Modal
        visible={
          aktifModal ===
          'bildirim'
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setAktifModal(
            null
          )
        }
      >
        <View
          style={
            s.modalOverlay
          }
        >
          <View
            style={
              s.modalSheet
            }
          >
            <ModalHeader
              title="Bildirimler"
              subtitle="Hatırlatmalarını yönet"
              onClose={() =>
                setAktifModal(
                  null
                )
              }
            />

            <SettingRow
              icon="calendar-outline"
              title="Program hatırlatmaları"
              subtitle="Günlük görev ve program bildirimleri"
              value={
                bildirimler.program
              }
              onValueChange={() =>
                bildirimDegistir(
                  'program'
                )
              }
            />

            <SettingRow
              icon="timer-outline"
              title="Çalışma hatırlatmaları"
              subtitle="Çalışma süresi girmeyi hatırlat"
              value={
                bildirimler.calisma
              }
              onValueChange={() =>
                bildirimDegistir(
                  'calisma'
                )
              }
            />

            <SettingRow
              icon="analytics-outline"
              title="Deneme hatırlatmaları"
              subtitle="Deneme sonucu ve analiz bildirimleri"
              value={
                bildirimler.deneme
              }
              onValueChange={() =>
                bildirimDegistir(
                  'deneme'
                )
              }
            />

            <View
              style={
                s.modalInfoNote
              }
            >
              <Ionicons
                name="notifications-outline"
                size={17}
                color="#4776E6"
              />

              <Text
                style={
                  s.modalInfoNoteText
                }
              >
                Tercihlerin bu hesap için kaydedilir. Gerçek push bildirimlerini sonraki backend aşamasında bu ayarlara bağlayabiliriz.
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================
          BAŞARILAR & ROZETLER
      ====================================================== */}

      <Modal
        visible={
          aktifModal ===
          'rozet'
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setAktifModal(
            null
          )
        }
      >
        <View
          style={
            s.modalOverlay
          }
        >
          <View
            style={
              s.modalSheetLarge
            }
          >
            <ModalHeader
              title="Başarılar & Rozetler"
              subtitle={`${kazanilanRozet}/${rozetler.length} rozet kazandın`}
              onClose={() =>
                setAktifModal(
                  null
                )
              }
            />

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >
              <View
                style={
                  s.badgeGrid
                }
              >
                {rozetler.map(
                  rozet => (
                    <View
                      key={
                        rozet.id
                      }
                      style={[
                        s.achievementCard,

                        !rozet.kazanildi &&
                          s.achievementCardLocked,
                      ]}
                    >
                      <Text
                        style={
                          s.achievementEmoji
                        }
                      >
                        {
                          rozet.emoji
                        }
                      </Text>

                      <Text
                        style={[
                          s.achievementTitle,

                          !rozet.kazanildi && {
                            color:
                              '#98A2B3',
                          },
                        ]}
                      >
                        {
                          rozet.baslik
                        }
                      </Text>

                      <Text
                        style={
                          s.achievementText
                        }
                      >
                        {
                          rozet.aciklama
                        }
                      </Text>

                      <View
                        style={[
                          s.achievementStatus,

                          rozet.kazanildi
                            ? s.achievementStatusWon
                            : s.achievementStatusLocked,
                        ]}
                      >
                        <Ionicons
                          name={
                            rozet.kazanildi
                              ? 'checkmark-circle'
                              : 'lock-closed-outline'
                          }
                          size={12}
                          color={
                            rozet.kazanildi
                              ? '#13845B'
                              : '#98A2B3'
                          }
                        />

                        <Text
                          style={[
                            s.achievementStatusText,

                            rozet.kazanildi && {
                              color:
                                '#13845B',
                            },
                          ]}
                        >
                          {rozet.kazanildi
                            ? 'Kazanıldı'
                            : 'Kilitli'}
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ======================================================
          YARDIM & SSS
      ====================================================== */}

      <Modal
        visible={
          aktifModal ===
          'yardim'
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setAktifModal(
            null
          )
        }
      >
        <View
          style={
            s.modalOverlay
          }
        >
          <View
            style={
              s.modalSheetLarge
            }
          >
            <ModalHeader
              title="Yardım & SSS"
              subtitle="En sık sorulan sorular"
              onClose={() =>
                setAktifModal(
                  null
                )
              }
            />

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >
              {[
                {
                  soru:
                    'Programım nasıl oluşturuluyor?',

                  cevap:
                    'Programın; alanın, ders seviyelerin, çalışma şeklin ve program tercihlerine göre hazırlanır. AI sistemi bağlandığında bu bilgiler kişiselleştirilmiş program üretiminde kullanılacak.',
                },

                {
                  soru:
                    'Anlamadım veya Yetişmedi seçersem ne olur?',

                  cevap:
                    'Bu durumlar Raporlar bölümündeki konu ilerlemene yansır. Anlamadım ve Yetişmedi olarak işaretlenen konular haftalık raporda tekrar edilmesi gereken alanlar olarak gösterilir.',
                },

                {
                  soru:
                    'Konu ilerlemem nereden geliyor?',

                  cevap:
                    'Konu ilerlemen haftalık programındaki gerçek görevlerden hesaplanır. Bir konuya ait görev Bitti olduğunda tamamlanmış; Anlamadım veya Yetişmedi olduğunda tekrar gerektiren konu olarak görünür.',
                },

                {
                  soru:
                    'Deneme sonucumu nerede görebilirim?',

                  cevap:
                    'Raporlar bölümünden yeni deneme sonucu ekleyebilir, Tüm Denemeler ekranından geçmiş sonuçlarını ve her denemenin analizini görüntüleyebilirsin.',
                },

                {
                  soru:
                    'PDF raporumu nasıl indiririm?',

                  cevap:
                    'Raporlar ekranındaki Haftalık Raporu PDF butonuna bas. Web sürümünde PDF doğrudan indirilir; telefonda kaydetme ve paylaşma seçenekleri açılır.',
                },

                {
                  soru:
                    'Bildirim ayarları ne işe yarıyor?',

                  cevap:
                    'Buradaki seçimler hangi tür hatırlatmaları almak istediğini kaydeder. Gerçek cihaz push bildirimleri backend bildirim sistemi bağlandığında bu tercihlere göre gönderilecek.',
                },
              ].map(
                (
                  item,
                  index
                ) => {
                  const acik =
                    acikSss ===
                    index;

                  return (
                    <TouchableOpacity
                      key={
                        item.soru
                      }
                      style={
                        s.faqCard
                      }
                      activeOpacity={
                        0.8
                      }
                      onPress={() =>
                        setAcikSss(
                          acik
                            ? null
                            : index
                        )
                      }
                    >
                      <View
                        style={
                          s.faqHeader
                        }
                      >
                        <Text
                          style={
                            s.faqQuestion
                          }
                        >
                          {
                            item.soru
                          }
                        </Text>

                        <Ionicons
                          name={
                            acik
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={17}
                          color="#F97316"
                        />
                      </View>

                      {acik && (
                        <Text
                          style={
                            s.faqAnswer
                          }
                        >
                          {
                            item.cevap
                          }
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                }
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function PreferenceCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {

  return (
    <View
      style={
        s.preferenceCard
      }
    >

      <View
        style={
          s.preferenceIcon
        }
      >

        <Ionicons
          name={
            icon as any
          }
          size={18}
          color="#4776E6"
        />

      </View>

      <Text
        style={
          s.preferenceTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          s.preferenceValue
        }
        numberOfLines={2}
      >
        {value}
      </Text>

    </View>
  );
}

function ModalHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose:
    () => void;
}) {
  return (
    <View
      style={
        s.modalHeader
      }
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={
            s.modalTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            s.modalSubtitle
          }
        >
          {subtitle}
        </Text>
      </View>

      <TouchableOpacity
        style={
          s.modalClose
        }
        onPress={
          onClose
        }
      >
        <Ionicons
          name="close"
          size={20}
          color="#202939"
        />
      </TouchableOpacity>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View
      style={
        s.infoRow
      }
    >
      <View
        style={
          s.infoIcon
        }
      >
        <Ionicons
          name={
            icon as any
          }
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
            s.infoLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            s.infoValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange:
    () => void;
}) {
  return (
    <View
      style={
        s.settingRow
      }
    >
      <View
        style={
          s.settingIcon
        }
      >
        <Ionicons
          name={
            icon as any
          }
          size={18}
          color="#F97316"
        />
      </View>

      <View
        style={{
          flex: 1,
          paddingRight: 10,
        }}
      >
        <Text
          style={
            s.settingTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            s.settingSubtitle
          }
        >
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={
          onValueChange
        }
        trackColor={{
          false:
            '#D7DBE1',
          true:
            '#FDBA8C',
        }}
        thumbColor={
          value
            ? '#F97316'
            : '#FFFFFF'
        }
      />
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

    scroll: {
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 110,
    },

    /* PROFILE */

    profileCard: {
      backgroundColor:
        '#202939',
      borderRadius: 24,
      padding: 17,
    },

    profileTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    avatar: {
      width: 67,
      height: 67,
      borderRadius: 20,
      backgroundColor:
        '#FFF1E7',
      marginRight: 13,
      borderWidth: 2,
      borderColor:
        'rgba(255,255,255,0.8)',
    },

    avatarFallback: {
      width: 67,
      height: 67,
      borderRadius: 20,
      marginRight: 13,
      backgroundColor:
        '#F97316',
      alignItems: 'center',
      justifyContent:
        'center',
      borderWidth: 2,
      borderColor: '#FFF',
    },

    avatarText: {
      color: '#FFF',
      fontSize: 27,
      fontWeight: '900',
    },

    profileMini: {
      color: '#FDBA8C',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 1,
    },

    name: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: '900',
      marginTop: 3,
    },

    fieldText: {
      color:
        'rgba(255,255,255,0.55)',
      fontSize: 9,
      marginTop: 3,
    },

    editButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor:
        'rgba(255,255,255,0.10)',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    badge: {
      alignSelf:
        'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 14,
      backgroundColor:
        'rgba(249,115,22,0.16)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    },

    badgeText: {
      color: '#FDBA8C',
      fontSize: 8,
      fontWeight: '800',
    },

    /* SECTION */

    sectionHeader: {
      marginTop: 24,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems:
        'flex-end',
      justifyContent:
        'space-between',
    },

    sectionTitle: {
      color: '#202939',
      fontSize: 16,
      fontWeight: '900',
    },

    sectionSubtitle: {
      color: '#98A2B3',
      fontSize: 8,
      marginTop: 3,
    },

    percent: {
      color: '#F97316',
      fontSize: 16,
      fontWeight: '900',
    },

    /* PROGRESS */

    progressCard: {
      backgroundColor: '#FFF',
      borderRadius: 20,
      padding: 15,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    progressTrack: {
      height: 8,
      borderRadius: 5,
      backgroundColor:
        '#F0EFED',
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      backgroundColor:
        '#F97316',
      borderRadius: 5,
    },

    statsRow: {
      flexDirection: 'row',
      marginTop: 16,
    },

    miniStat: {
      flex: 1,
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor:
        '#F0EFED',
    },

    miniStatValue: {
      color: '#202939',
      fontSize: 14,
      fontWeight: '900',
      marginTop: 5,
    },

    miniStatLabel: {
      color: '#98A2B3',
      fontSize: 7,
      marginTop: 2,
      fontWeight: '700',
    },

    /* PREFERENCES */

    preferenceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    preferenceCard: {
      width: '48.7%',
      minHeight: 115,
      borderRadius: 18,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor:
        '#F0EFED',
      padding: 13,
    },

    preferenceIcon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      backgroundColor:
        '#EEF3FF',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    preferenceTitle: {
      color: '#98A2B3',
      fontSize: 8,
      fontWeight: '800',
      marginTop: 10,
    },

    preferenceValue: {
      color: '#202939',
      fontSize: 10,
      fontWeight: '900',
      marginTop: 4,
      lineHeight: 14,
    },

    /* MENU */

    menuCard: {
      backgroundColor: '#FFF',
      borderRadius: 20,
      paddingHorizontal: 13,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    menuRow: {
      minHeight: 67,
      flexDirection: 'row',
      alignItems: 'center',
    },

    menuBorder: {
      borderBottomWidth: 1,
      borderBottomColor:
        '#F3F3F1',
    },

    menuIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor:
        '#FFF1E7',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 11,
    },

    menuTitle: {
      color: '#344054',
      fontSize: 10,
      fontWeight: '900',
    },

    menuSubtitle: {
      color: '#98A2B3',
      fontSize: 7,
      marginTop: 3,
    },

    /* LOGOUT */

    logoutButton: {
      height: 50,
      borderRadius: 16,
      backgroundColor:
        '#FDECEC',
      marginTop: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 7,
    },

    logoutText: {
      color: '#D14343',
      fontSize: 10,
      fontWeight: '900',
    },

    version: {
      color: '#C0C4CC',
      fontSize: 7,
      textAlign: 'center',
      marginTop: 14,
    },


    /* MODALS */

    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(15,23,42,0.34)',
      justifyContent:
        'flex-end',
    },

    modalSheet: {
      backgroundColor:
        '#F8F7F4',
      borderTopLeftRadius:
        26,
      borderTopRightRadius:
        26,
      paddingHorizontal:
        18,
      paddingTop: 18,
      paddingBottom: 34,
      maxHeight: '76%',
    },

    modalSheetLarge: {
      backgroundColor:
        '#F8F7F4',
      borderTopLeftRadius:
        26,
      borderTopRightRadius:
        26,
      paddingHorizontal:
        18,
      paddingTop: 18,
      paddingBottom: 34,
      height: '82%',
    },

    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },

    modalTitle: {
      color: '#202939',
      fontSize: 19,
      fontWeight: '900',
    },

    modalSubtitle: {
      color: '#98A2B3',
      fontSize: 8,
      marginTop: 3,
    },

    modalClose: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor:
        '#FFF',
      justifyContent:
        'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    infoRow: {
      minHeight: 68,
      backgroundColor:
        '#FFF',
      borderRadius: 17,
      padding: 13,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    infoIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor:
        '#EEF3FF',
      justifyContent:
        'center',
      alignItems: 'center',
      marginRight: 11,
    },

    infoLabel: {
      color: '#98A2B3',
      fontSize: 7,
      fontWeight: '800',
    },

    infoValue: {
      color: '#202939',
      fontSize: 10,
      fontWeight: '900',
      marginTop: 3,
    },

    modalInfoNote: {
      backgroundColor:
        '#EEF3FF',
      borderRadius: 14,
      padding: 12,
      flexDirection: 'row',
      alignItems:
        'flex-start',
      gap: 8,
      marginTop: 6,
    },

    modalInfoNoteText: {
      flex: 1,
      color: '#667085',
      fontSize: 8,
      lineHeight: 13,
    },

    settingRow: {
      minHeight: 74,
      backgroundColor:
        '#FFF',
      borderRadius: 17,
      padding: 13,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    settingIcon: {
      width: 39,
      height: 39,
      borderRadius: 12,
      backgroundColor:
        '#FFF1E7',
      justifyContent:
        'center',
      alignItems: 'center',
      marginRight: 10,
    },

    settingTitle: {
      color: '#202939',
      fontSize: 10,
      fontWeight: '900',
    },

    settingSubtitle: {
      color: '#98A2B3',
      fontSize: 7,
      lineHeight: 11,
      marginTop: 3,
    },

    badgeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 9,
      paddingBottom: 20,
    },

    achievementCard: {
      width: '48.5%',
      minHeight: 165,
      borderRadius: 19,
      backgroundColor:
        '#FFF',
      borderWidth: 1,
      borderColor:
        '#F0EFED',
      padding: 14,
    },

    achievementCardLocked: {
      opacity: 0.58,
      backgroundColor:
        '#F4F4F3',
    },

    achievementEmoji: {
      fontSize: 29,
    },

    achievementTitle: {
      color: '#202939',
      fontSize: 11,
      fontWeight: '900',
      marginTop: 8,
    },

    achievementText: {
      color: '#98A2B3',
      fontSize: 8,
      lineHeight: 12,
      marginTop: 4,
      minHeight: 28,
    },

    achievementStatus: {
      alignSelf:
        'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: 9,
      paddingHorizontal: 7,
      paddingVertical: 5,
      marginTop: 10,
    },

    achievementStatusWon: {
      backgroundColor:
        '#E7F8F0',
    },

    achievementStatusLocked: {
      backgroundColor:
        '#E5E7EB',
    },

    achievementStatusText: {
      color: '#98A2B3',
      fontSize: 7,
      fontWeight: '800',
    },

    faqCard: {
      backgroundColor:
        '#FFF',
      borderRadius: 17,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    faqHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      gap: 12,
    },

    faqQuestion: {
      flex: 1,
      color: '#202939',
      fontSize: 10,
      fontWeight: '900',
      lineHeight: 14,
    },

    faqAnswer: {
      color: '#667085',
      fontSize: 9,
      lineHeight: 14,
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor:
        '#F3F3F1',
    },

  });