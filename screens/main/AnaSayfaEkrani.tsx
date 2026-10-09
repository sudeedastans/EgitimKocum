import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import {
  DENEMELER,
  type DenemeSonucu,
} from '../../data/denemeData';

import {
  type Durum,
  type Gun,
  type Gorev,
  type HaftalikProgram,
} from '../../data/programData';

const DENEME_STORAGE_KEY =
  'deneme-sonuclari';

const HAFTA_SIRASI: Gun[] = [
  'Pzt',
  'Sal',
  'Çar',
  'Per',
  'Cum',
  'Cmt',
  'Paz',
];

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

type Props = {
  route: any;
  navigation: any;
  program: HaftalikProgram;
  setProgram: React.Dispatch<React.SetStateAction<HaftalikProgram>>;
};

export default function AnaSayfaEkrani({
  route,
  navigation,
  program,
  setProgram,
}: Props) {

  const adSoyad = route?.params?.adSoyad ?? 'Öğrenci';
 const basHarfler = adSoyad
  .trim()
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((parca: string) =>
    parca.charAt(0).toLocaleUpperCase('tr-TR')
  )
  .join('');

  const gorevler: Gorev[] = program[bugun] || [];

  const [
    denemeler,
    setDenemeler,
  ] = useState<DenemeSonucu[]>([]);


  /*
    Deneme verisini ekran her odaklandığında yeniden yükle.
    Böylece Raporlar ekranında yeni deneme eklendiğinde
    ana sayfadaki "Raporların" kartı da güncellenir.
  */
  useFocusEffect(
    useCallback(() => {
      let aktif = true;

      const denemeleriYukle =
        async () => {
          try {
            const kayitli =
              await AsyncStorage.getItem(
                DENEME_STORAGE_KEY
              );

            const liste:
              DenemeSonucu[] =
              kayitli
                ? JSON.parse(
                    kayitli
                  )
                : DENEMELER;

            if (aktif) {
              setDenemeler(
                liste
              );
            }
          } catch (error) {
            console.log(
              'Ana sayfa denemeleri yüklenemedi:',
              error
            );

            if (aktif) {
              setDenemeler(
                DENEMELER
              );
            }
          }
        };

      denemeleriYukle();

      return () => {
        aktif = false;
      };
    }, [])
  );

  /*
    STREAK artık Ana Sayfa'da butona basılmasına bağlı değil.
    Ortak "program" state'inden hesaplanır.

    Bu sayede Program sayfasında bir görevi Bitti yaptığında
    Ana Sayfa açılır açılmaz seri de değişir.
  */
  const streak =
    useMemo(() => {
      const jsGun =
        new Date().getDay();

      const bugunIndex =
        jsGun === 0
          ? 6
          : jsGun - 1;

      const gundeTamamlananVar =
        (gun: Gun) => {
          const liste =
            program[gun] || [];

          return (
            liste.length >
              0 &&
            liste.some(
              gorev =>
                gorev.durum ===
                'bitti'
            )
          );
        };

      let index =
        bugunIndex;

      /*
        Bugün henüz görev bitmediyse,
        dünün devam eden serisini göstermeye devam et.
        Bugün bir görev bitince seri otomatik +1 olur.
      */
      if (
        !gundeTamamlananVar(
          HAFTA_SIRASI[
            bugunIndex
          ]
        )
      ) {
        index -= 1;
      }

      let seri = 0;

      for (
        let i = index;
        i >= 0;
        i -= 1
      ) {
        const gun =
          HAFTA_SIRASI[i];

        const gunGorevleri =
          program[gun] || [];

        /*
          Programda görev olmayan günler seriyi bozmaz.
        */
        if (
          gunGorevleri.length ===
          0
        ) {
          continue;
        }

        if (
          gunGorevleri.some(
            gorev =>
              gorev.durum ===
              'bitti'
          )
        ) {
          seri += 1;
        } else {
          break;
        }
      }

      return seri;
    }, [program]);

  /*
    Rozet de artık local state değil.
    Bu hafta tamamen bitirilen gün sayısından hesaplanır.
  */
  const badges =
    useMemo(
      () =>
        HAFTA_SIRASI.filter(
          gun => {
            const liste =
              program[gun] ||
              [];

            return (
              liste.length >
                0 &&
              liste.every(
                gorev =>
                  gorev.durum ===
                  'bitti'
              )
            );
          }
        ).length,
      [program]
    );

  const sonDeneme =
    denemeler[0];

  const oncekiDeneme =
    denemeler[1];

  const netFarki =
    sonDeneme &&
    oncekiDeneme
      ? sonDeneme.toplamNet -
        oncekiDeneme.toplamNet
      : 0;

  const netMetni = (
    net: number
  ) =>
    net.toLocaleString(
      'tr-TR',
      {
        minimumFractionDigits:
          2,
        maximumFractionDigits:
          2,
      }
    );

  const raporBaslik =
    !sonDeneme
      ? 'Deneme sonuçlarını takip et'
      : !oncekiDeneme
      ? `Son denemen: ${netMetni(
          sonDeneme.toplamNet
        )} net`
      : netFarki > 0
      ? 'Netlerinde yükseliş var'
      : netFarki < 0
      ? 'Son denemede düşüş var'
      : 'Netlerin sabit';

  const raporAciklama =
    !sonDeneme
      ? 'İlk denemeni eklediğinde gelişimini burada göreceksin.'
      : !oncekiDeneme
      ? 'Yeni denemeler ekledikçe gelişimini karşılaştıracağız.'
      : `Son denemende ${netMetni(
          sonDeneme.toplamNet
        )} net yaptın. Önceki denemene göre ${
          netFarki > 0
            ? '+'
            : ''
        }${netMetni(
          netFarki
        )} net.`;

  const isim =
    adSoyad?.trim()?.split(' ')[0] || 'Öğrenci';

  const saat = new Date().getHours();

  const selam =
    saat < 12
      ? 'Günaydın'
      : saat < 18
      ? 'İyi günler'
      : 'İyi akşamlar';

  const tarih = new Date().toLocaleDateString(
    'tr-TR',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }
  );

  const bittiSayisi =
    gorevler.filter(g => g.durum === 'bitti').length;

  const toplamGorev = gorevler.length;

  const kalanGorev =
    toplamGorev - bittiSayisi;

  const ilerlemePct =
    toplamGorev > 0
      ? Math.round(
          (bittiSayisi / toplamGorev) * 100
        )
      : 0;

  const gorevDurumuDegistir = (
    id: string,
    yeniDurum: Durum
  ) => {
    setProgram(prev => ({
      ...prev,

      [bugun]:
        (
          prev[bugun] ||
          []
        ).map(
          gorev =>
            gorev.id === id
              ? {
                  ...gorev,
                  durum:
                    yeniDurum,
                }
              : gorev
        ),
    }));
  };

  const durumYaziGetir = (
    durum: Durum
  ) => {

    if (durum === 'bitti') return 'Bitti';
    if (durum === 'anlamadim') return 'Anlamadım';
    if (durum === 'yetismedi') return 'Yetişmedi';

    return 'Yapılacak';
  };

  const durumRenkGetir = (
    durum: Durum
  ) => {

    if (durum === 'bitti') return '#E2F8EE';
    if (durum === 'anlamadim') return '#FFE8E8';
    if (durum === 'yetismedi') return '#FFF1D8';

    return '#F2F4F7';
  };

  const durumYaziRenkGetir = (
    durum: Durum
  ) => {

    if (durum === 'bitti') return '#13845B';
    if (durum === 'anlamadim') return '#C84B4B';
    if (durum === 'yetismedi') return '#B76C17';

    return '#667085';
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >

        {/* HEADER */}

        <View style={s.header}>

          <View style={{ flex: 1 }}>

            <Text style={s.welcomeMini}>
              {selam},
            </Text>

            <Text style={s.welcomeName}>
              {isim} 👋
            </Text>

            <Text style={s.dateText}>
              {tarih}
            </Text>

          </View>

          <TouchableOpacity
            style={s.avatarContainer}
            onPress={() =>
              navigation.navigate('Profil')
            }
          >
            <Text style={s.avatarInitials}>
  {basHarfler}
</Text>
          </TouchableOpacity>

        </View>

        {/* HERO / BUGÜNÜN PLANI */}

        <View style={s.heroCard}>

          <View style={s.heroBlob1} />
          <View style={s.heroBlob2} />

          <View style={s.heroContent}>

            <Text style={s.heroLabel}>
              BUGÜNÜN PLANI
            </Text>

            {toplamGorev === 0 ? (

              <>
                <Text style={s.heroTitle}>
                  Bugün için görevin yok
                </Text>

                <Text style={s.heroDescription}>
                  Yeni görevler eklendiğinde burada görebilirsin.
                </Text>
              </>

            ) : kalanGorev === 0 ? (

              <>
                <Text style={s.heroTitle}>
                  🎉 Bugünü tamamladın!
                </Text>

                <Text style={s.heroDescription}>
                  Tüm görevlerini bitirdin. Harika iş çıkardın.
                </Text>
              </>

            ) : (

              <>
                <Text style={s.heroTitle}>
                  {bittiSayisi}/{toplamGorev} görev tamamlandı
                </Text>

                <Text style={s.heroDescription}>
                  🔥 {kalanGorev} görev kaldı. Devam edebilirsin!
                </Text>
              </>

            )}

            <View style={s.progressTrack}>
              <View
                style={[
                  s.progressFill,
                  {
                    width: `${ilerlemePct}%`,
                  },
                ]}
              />
            </View>

            <View style={s.heroBottomRow}>

              <Text style={s.heroPercent}>
                %{ilerlemePct}
              </Text>

              <TouchableOpacity
                style={s.heroButton}
                onPress={() =>
                  navigation.navigate('Program')
                }
              >
                <Text style={s.heroButtonText}>
                  Programa Git
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color="#F97316"
                />
              </TouchableOpacity>

            </View>

          </View>

          <View style={s.heroIcon}>
            <Ionicons
              name="calendar-outline"
              size={34}
              color="#F97316"
            />
          </View>

        </View>

        {/* BUGÜNÜN GÖREVLERİ */}

        <View style={s.sectionHeader}>

          <View>
            <Text style={s.sectionTitle}>
              Bugünün Görevleri
            </Text>

            <Text style={s.sectionSub}>
              Bugünkü çalışma planın
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Program')
            }
            style={s.viewAll}
          >
            <Text style={s.viewAllText}>
              Tümünü gör
            </Text>

            <Ionicons
              name="chevron-forward"
              size={14}
              color="#F97316"
            />
          </TouchableOpacity>

        </View>

        {gorevler.length === 0 ? (

          <View style={s.emptyCard}>

            <Ionicons
              name="checkmark-circle-outline"
              size={36}
              color="#18A66A"
            />

            <Text style={s.emptyTitle}>
              Bugün için görev yok
            </Text>

            <Text style={s.emptyDescription}>
              Yeni planın oluşturulduğunda burada görünecek.
            </Text>

          </View>

        ) : (

          gorevler.slice(0, 3).map(gorev => (

            <View
              key={gorev.id}
              style={s.taskCard}
            >

              <View style={s.taskIconBox}>

                <Ionicons
                  name="book-outline"
                  size={20}
                  color="#F97316"
                />

              </View>

              <View style={s.taskContent}>

                <Text style={s.taskSubject}>
                  {gorev.ders}
                </Text>

                <Text
                  style={s.taskTopic}
                  numberOfLines={2}
                >
                  {gorev.konu}
                </Text>

                {gorev.saat !== '—' && (

                  <View style={s.timeRow}>

                    <Ionicons
                      name="time-outline"
                      size={12}
                      color="#98A2B3"
                    />

                    <Text style={s.timeText}>
                      {gorev.saat}
                    </Text>

                  </View>

                )}

              </View>

              <TouchableOpacity
                style={[
                  s.statusButton,
                  {
                    backgroundColor:
                      durumRenkGetir(
                        gorev.durum
                      ),
                  },
                ]}
                onPress={() =>
                  gorevDurumuDegistir(
                    gorev.id,
                    gorev.durum === 'bitti'
                      ? 'yapilacak'
                      : 'bitti'
                  )
                }
              >

                {gorev.durum === 'bitti' && (

                  <Ionicons
                    name="checkmark"
                    size={12}
                    color="#13845B"
                  />

                )}

                <Text
                  style={[
                    s.statusText,
                    {
                      color:
                        durumYaziRenkGetir(
                          gorev.durum
                        ),
                    },
                  ]}
                >
                  {durumYaziGetir(
                    gorev.durum
                  )}
                </Text>

              </TouchableOpacity>

            </View>

          ))

        )}

        {/* HAFTALIK PROGRAM */}

        <View style={s.sectionHeaderWeek}>

          <View>
            <Text style={s.sectionTitle}>
              Bu Haftanın Programı
            </Text>

            <Text style={s.sectionSub}>
              Haftalık çalışma görünümü
            </Text>
          </View>

        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.weekRow}
        >

          {gunMap
            .filter(g => g !== 'Paz')
            .concat(['Paz'])
            .map(gun => {

              const gunGorevleri =
                program[gun] || [];

              const tamamlanan =
                gunGorevleri.filter(
                  g =>
                    g.durum === 'bitti'
                ).length;

              const aktif =
                gun === bugun;

              return (

                <TouchableOpacity
                  key={gun}
                  style={[
                    s.dayCard,
                    aktif &&
                      s.dayCardActive,
                  ]}
                  onPress={() =>
                    navigation.navigate(
                      'Program'
                    )
                  }
                >

                  <Text
                    style={[
                      s.dayName,
                      aktif &&
                        s.dayNameActive,
                    ]}
                  >
                    {gun}
                  </Text>

                  <Text
                    style={[
                      s.dayCount,
                      aktif &&
                        s.dayCountActive,
                    ]}
                  >
                    {tamamlanan}/
                    {gunGorevleri.length}
                  </Text>

                  <View
                    style={[
                      s.dayDot,
                      aktif &&
                        s.dayDotActive,
                    ]}
                  />

                </TouchableOpacity>

              );
            })}

        </ScrollView>

        {/* DENEME GELİŞİMİ */}

        <TouchableOpacity
          style={s.examCard}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('Raporlar')
          }
        >

          <View style={s.examIcon}>

            <Ionicons
              name="stats-chart-outline"
              size={24}
              color="#4776E6"
            />

          </View>

          <View style={{ flex: 1 }}>

            <Text style={s.examLabel}>
              RAPORLARIN
            </Text>

            <Text style={s.examTitle}>
              {raporBaslik}
            </Text>

            <Text style={s.examDescription}>
              {raporAciklama}
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color="#98A2B3"
          />

        </TouchableOpacity>

        {/* STATS */}

        <View style={s.sectionHeaderStats}>

          <View>
            <Text style={s.sectionTitle}>
              Başarıların
            </Text>

            <Text style={s.sectionSub}>
              Çalışma düzenini takip et
            </Text>
          </View>

        </View>

        <View style={s.statsRow}>

          <View style={s.statCard}>

            <View style={s.fireIcon}>
              <Text style={s.statEmoji}>
                🔥
              </Text>
            </View>

            <Text style={s.statNumber}>
              {streak}
            </Text>

            <Text style={s.statLabel}>
              Günlük Seri
            </Text>

          </View>

          <View style={s.statCard}>

            <View style={s.badgeIcon}>
              <Text style={s.statEmoji}>
                🏆
              </Text>
            </View>

            <Text style={s.statNumber}>
              {badges}
            </Text>

            <Text style={s.statLabel}>
              Kazanılan Rozet
            </Text>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },

  scroll: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  welcomeMini: {
    color: '#98A2B3',
    fontSize: 12,
    fontWeight: '600',
  },

  welcomeName: {
    color: '#202939',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 1,
  },

  dateText: {
    color: '#98A2B3',
    fontSize: 11,
    marginTop: 4,
    textTransform: 'capitalize',
  },

  avatarContainer: {
  width: 52,
  height: 52,
  borderRadius: 17,
  backgroundColor: '#FFF1E7',
  borderWidth: 1,
  borderColor: '#FBC49E',
  alignItems: 'center',
  justifyContent: 'center',
},

avatarInitials: {
  color: '#F97316',
  fontSize: 16,
  fontWeight: '900',
  letterSpacing: 0.5,
},

  heroCard: {
    backgroundColor: '#FFF1E7',
    borderRadius: 24,
    minHeight: 190,
    padding: 20,
    marginBottom: 26,
    overflow: 'hidden',
    position: 'relative',
  },

  heroBlob1: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFD5B8',
    right: -40,
    top: -35,
  },

  heroBlob2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFE6D4',
    right: 50,
    bottom: -50,
  },

  heroContent: {
    width: '72%',
    zIndex: 2,
  },

  heroLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#F97316',
    letterSpacing: 1.3,
  },

  heroTitle: {
    color: '#202939',
    fontSize: 21,
    fontWeight: '900',
    marginTop: 7,
    lineHeight: 27,
  },

  heroDescription: {
    color: '#667085',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  progressTrack: {
    height: 7,
    borderRadius: 5,
    backgroundColor:
      'rgba(249,115,22,0.16)',
    overflow: 'hidden',
    marginTop: 15,
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#F97316',
  },

  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  heroPercent: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '900',
  },

  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 12,
  },

  heroButtonText: {
    color: '#F97316',
    fontSize: 10,
    fontWeight: '800',
  },

  heroIcon: {
    position: 'absolute',
    right: 22,
    top: 58,
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      {
        rotate: '-5deg',
      },
    ],
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionHeaderWeek: {
    marginTop: 16,
    marginBottom: 12,
  },

  sectionHeaderStats: {
    marginTop: 25,
    marginBottom: 12,
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

  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewAllText: {
    color: '#F97316',
    fontSize: 11,
    fontWeight: '700',
  },

  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EFED',
  },

  taskIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFF1E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  taskContent: {
    flex: 1,
  },

  taskSubject: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
  },

  taskTopic: {
    color: '#667085',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },

  timeText: {
    color: '#98A2B3',
    fontSize: 9,
  },

  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginLeft: 7,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },

  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0EFED',
  },

  emptyTitle: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 7,
  },

  emptyDescription: {
    color: '#98A2B3',
    fontSize: 10,
    marginTop: 4,
  },

  weekRow: {
    gap: 8,
    paddingRight: 18,
  },

  dayCard: {
    width: 62,
    height: 77,
    borderRadius: 17,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEDEB',
  },

  dayCardActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },

  dayName: {
    color: '#667085',
    fontSize: 11,
    fontWeight: '800',
  },

  dayNameActive: {
    color: '#FFF',
  },

  dayCount: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 5,
  },

  dayCountActive: {
    color: '#FFF',
  },

  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginTop: 6,
  },

  dayDotActive: {
    backgroundColor: '#FFF',
  },

  examCard: {
    backgroundColor: '#EEF3FF',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  examIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  examLabel: {
    color: '#4776E6',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  examTitle: {
    color: '#202939',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },

  examDescription: {
    color: '#667085',
    fontSize: 10,
    marginTop: 3,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EFED',
  },

  fireIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0E5',
  },

  badgeIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E7F8F0',
  },

  statEmoji: {
    fontSize: 23,
  },

  statNumber: {
    color: '#202939',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },

  statLabel: {
    color: '#98A2B3',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },

});