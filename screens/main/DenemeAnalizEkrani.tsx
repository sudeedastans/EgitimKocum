import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  type DenemeSonucu,
} from '../../data/denemeData';

export default function DenemeAnalizEkrani({
  navigation,
  route,
}: any) {

  /* ============================================================
     STATE
  ============================================================ */

  const hamDenemeId =
    route?.params?.denemeId;

  const denemeId =
    typeof hamDenemeId ===
    'string'
      ? hamDenemeId
      : hamDenemeId?.id;


  const storageUserKey =
    route?.params
      ?.storageUserKey ??
    'ogrenci';

  const DENEME_STORAGE_KEY =
    `deneme-sonuclari-${storageUserKey}`;

  const [
    deneme,
    setDeneme,
  ] =
    useState<DenemeSonucu | null>(
      null
    );

  const [
    oncekiDeneme,
    setOncekiDeneme,
  ] =
    useState<DenemeSonucu | null>(
      null
    );

  const [
    yukleniyor,
    setYukleniyor,
  ] =
    useState(true);

  /* ============================================================
     DENEMEYİ GETİR
  ============================================================ */

  useEffect(() => {

    const denemeGetir =
      async () => {

        try {

          const kayitli =
            await AsyncStorage.getItem(
              DENEME_STORAGE_KEY
            );

          let tumDenemeler:
            DenemeSonucu[] =
            [];

          if (kayitli) {
            tumDenemeler =
              JSON.parse(
                kayitli
              );
          }

          const index =
            tumDenemeler.findIndex(
              item =>
                item.id ===
                denemeId
            );

          if (index === -1) {

            setDeneme(null);
            setOncekiDeneme(null);

            return;
          }

          const secilenDeneme =
            tumDenemeler[index];

          setDeneme(
            secilenDeneme
          );

          /*
            Liste en yeniden eskiye doğru.

            index + 1:
            seçilen denemeden önce yapılmış
            olan denemeyi verir.
          */

          const onceki =
            tumDenemeler
              .slice(index + 1)
              .find(
                item =>
                  !secilenDeneme.tur ||
                  !item.tur ||
                  item.tur ===
                    secilenDeneme.tur
              );

          setOncekiDeneme(
            onceki ?? null
          );

        } catch (error) {

          console.log(
            'Deneme analizi yüklenemedi:',
            error
          );

          setDeneme(
            null
          );

          setOncekiDeneme(
            null
          );

        } finally {

          setYukleniyor(
            false
          );

        }

      };

    denemeGetir();

  }, [
    denemeId,
    DENEME_STORAGE_KEY,
  ]);

  /* ============================================================
     LOADING
  ============================================================ */

  if (yukleniyor) {

    return (
      <SafeAreaView
        style={s.container}
      >

        <View
          style={
            s.loadingArea
          }
        >

          <ActivityIndicator
            size="large"
            color="#F97316"
          />

          <Text
            style={
              s.loadingText
            }
          >
            Deneme analizin hazırlanıyor...
          </Text>

        </View>

      </SafeAreaView>
    );
  }

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (!deneme) {

    return (
      <SafeAreaView
        style={s.container}
      >

        <View
          style={s.empty}
        >

          <View
            style={
              s.emptyIcon
            }
          >

            <Ionicons
              name="document-text-outline"
              size={30}
              color="#F97316"
            />

          </View>

          <Text
            style={
              s.emptyTitle
            }
          >
            Deneme bulunamadı
          </Text>

          <Text
            style={
              s.emptySub
            }
          >
            Bu deneme silinmiş veya
            henüz kaydedilmemiş olabilir.
          </Text>

          <TouchableOpacity
            style={
              s.emptyButton
            }
            onPress={() =>
              navigation.goBack()
            }
          >

            <Text
              style={
                s.emptyButtonText
              }
            >
              Geri Dön
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>
    );
  }

  /* ============================================================
     HESAPLAMALAR
  ============================================================ */

  const toplamDogru =
    deneme.dersler.reduce(
      (
        toplam,
        ders
      ) =>
        toplam +
        ders.dogru,
      0
    );

  const toplamYanlis =
    deneme.dersler.reduce(
      (
        toplam,
        ders
      ) =>
        toplam +
        ders.yanlis,
      0
    );

  const toplamBos =
    deneme.dersler.reduce(
      (
        toplam,
        ders
      ) =>
        toplam +
        ders.bos,
      0
    );

  const toplamSoru =
    deneme.dersler.reduce(
      (
        toplam,
        ders
      ) =>
        toplam +
        ders.soru,
      0
    );

  const netFarki =
    oncekiDeneme
      ? deneme.toplamNet -
        oncekiDeneme.toplamNet
      : 0;

  /* ============================================================
     EN İYİ DERS
  ============================================================ */

  const siraliDersler =
    [...deneme.dersler].sort(
      (
        a,
        b
      ) => {

        const oranA =
          a.soru > 0
            ? a.net /
              a.soru
            : 0;

        const oranB =
          b.soru > 0
            ? b.net /
              b.soru
            : 0;

        return oranB -
          oranA;
      }
    );

  const enIyiDers =
    siraliDersler[0];

  const gelistirilecekDers =
    siraliDersler[
      siraliDersler.length - 1
    ];

  /* ============================================================
     UI
  ============================================================ */

  return (
    <SafeAreaView
      style={s.container}
    >

      {/* HEADER */}

      <View
        style={s.header}
      >

        <TouchableOpacity
          style={
            s.backButton
          }
          onPress={() =>
            navigation.goBack()
          }
        >

          <Ionicons
            name="chevron-back"
            size={22}
            color="#202939"
          />

        </TouchableOpacity>

        <View
          style={{
            flex: 1,
          }}
        >

          <View
            style={
              s.headerTop
            }
          >

            <Text
              style={
                s.headerMini
              }
            >
              DENEME ANALİZİ
            </Text>

            {deneme.tur && (

              <View
                style={
                  s.examTypeBadge
                }
              >

                <Text
                  style={
                    s.examTypeText
                  }
                >
                  {deneme.tur}
                </Text>

              </View>

            )}

          </View>

          <Text
            style={
              s.headerTitle
            }
          >
            {deneme.ad}
          </Text>

          <Text
            style={
              s.headerDate
            }
          >
            {deneme.tarih}
          </Text>

        </View>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          s.scroll
        }
      >

        {/* ======================================================
            NET HERO
        ====================================================== */}

        <View
          style={s.heroCard}
        >

          <View
            style={{
              flex: 1,
            }}
          >

            <Text
              style={
                s.heroMini
              }
            >
              TOPLAM NET
            </Text>

            <View
              style={s.netRow}
            >

              <Text
                style={
                  s.heroNet
                }
              >
                {deneme.toplamNet.toLocaleString(
                  'tr-TR',
                  {
                    minimumFractionDigits:
                      2,

                    maximumFractionDigits:
                      2,
                  }
                )}
              </Text>

              <Text
                style={
                  s.heroNetLabel
                }
              >
                net
              </Text>

            </View>

            {oncekiDeneme ? (

              <View
                style={
                  s.heroChange
                }
              >

                <Ionicons
                  name={
                    netFarki >= 0
                      ? 'trending-up'
                      : 'trending-down'
                  }
                  size={15}
                  color={
                    netFarki >= 0
                      ? '#5EE4A7'
                      : '#FF8585'
                  }
                />

                <Text
                  style={[
                    s.heroChangeText,

                    netFarki < 0 && {
                      color:
                        '#FF8585',
                    },
                  ]}
                >
                  {netFarki >= 0
                    ? '+'
                    : ''}

                  {netFarki.toFixed(
                    2
                  )}

                  {' net önceki denemeye göre'}
                </Text>

              </View>

            ) : (

              <Text
                style={
                  s.firstExamText
                }
              >
                İlk kayıtlı denemen
              </Text>

            )}

          </View>

          <View
            style={s.heroIcon}
          >

            <Ionicons
              name="analytics-outline"
              size={30}
              color="#4776E6"
            />

          </View>

        </View>

        {/* ======================================================
            GENERAL
        ====================================================== */}

        <Text
          style={
            s.sectionTitle
          }
        >
          Genel Sonuç
        </Text>

        <View
          style={s.summaryRow}
        >

          <SummaryCard
            value={`${toplamDogru}`}
            label="Doğru"
            icon="checkmark"
            iconColor="#18A66A"
          />

          <SummaryCard
            value={`${toplamYanlis}`}
            label="Yanlış"
            icon="close"
            iconColor="#D14343"
          />

          <SummaryCard
            value={`${toplamBos}`}
            label="Boş"
            icon="remove"
            iconColor="#98A2B3"
          />

        </View>

        <View
          style={
            s.questionInfo
          }
        >

          <Ionicons
            name="document-text-outline"
            size={16}
            color="#4776E6"
          />

          <Text
            style={
              s.questionInfoText
            }
          >
            Toplam {toplamSoru} soru
            üzerinden hesaplandı.
          </Text>

        </View>

        {/* ======================================================
            SUBJECTS
        ====================================================== */}

        <Text
          style={
            s.sectionTitle
          }
        >
          Ders Bazlı Analiz
        </Text>

        {deneme.dersler.map(
          ders => {

            const oran =
              ders.soru > 0
                ? Math.max(
                    0,
                    Math.min(
                      100,
                      Math.round(
                        (
                          ders.net /
                          ders.soru
                        ) *
                          100
                      )
                    )
                  )
                : 0;

            return (
              <View
                key={
                  ders.ders
                }
                style={
                  s.lessonCard
                }
              >

                <View
                  style={
                    s.lessonHeader
                  }
                >

                  <View>

                    <Text
                      style={
                        s.lessonName
                      }
                    >
                      {ders.ders}
                    </Text>

                    <Text
                      style={
                        s.lessonQuestion
                      }
                    >
                      {ders.soru} soru
                    </Text>

                  </View>

                  <View
                    style={
                      s.lessonNetBox
                    }
                  >

                    <Text
                      style={
                        s.lessonNet
                      }
                    >
                      {ders.net.toLocaleString(
                        'tr-TR',
                        {
                          minimumFractionDigits:
                            2,

                          maximumFractionDigits:
                            2,
                        }
                      )}
                    </Text>

                    <Text
                      style={
                        s.lessonNetLabel
                      }
                    >
                      NET
                    </Text>

                  </View>

                </View>

                <View
                  style={s.resultRow}
                >

                  <ResultItem
                    value={
                      ders.dogru
                    }
                    label="Doğru"
                    color="#18A66A"
                  />

                  <ResultItem
                    value={
                      ders.yanlis
                    }
                    label="Yanlış"
                    color="#D14343"
                  />

                  <ResultItem
                    value={
                      ders.bos
                    }
                    label="Boş"
                    color="#98A2B3"
                  />

                </View>

                <View
                  style={
                    s.progressTop
                  }
                >

                  <Text
                    style={
                      s.progressLabel
                    }
                  >
                    Net başarısı
                  </Text>

                  <Text
                    style={
                      s.progressPercent
                    }
                  >
                    %{oran}
                  </Text>

                </View>

                <View
                  style={
                    s.progressTrack
                  }
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

              </View>
            );
          }
        )}

        {/* ======================================================
            ANALYSIS
        ====================================================== */}

        <Text
          style={
            s.sectionTitle
          }
        >
          Analiz Özeti
        </Text>

        <View
          style={
            s.analysisCard
          }
        >

          <View
            style={
              s.analysisTop
            }
          >

            <View
              style={
                s.sparkleBox
              }
            >

              <Ionicons
                name="sparkles"
                size={18}
                color="#F97316"
              />

            </View>

            <View>

              <Text
                style={
                  s.analysisTitle
                }
              >
                Eğitim Koçum Analizi
              </Text>

              <Text
                style={
                  s.analysisSubtitle
                }
              >
                Sonuçlarına göre kısa değerlendirme
              </Text>

            </View>

          </View>

          {enIyiDers && (

            <View
              style={
                s.analysisLine
              }
            >

              <View
                style={[
                  s.analysisIcon,
                  {
                    backgroundColor:
                      '#E8F8F1',
                  },
                ]}
              >

                <Ionicons
                  name="checkmark"
                  size={13}
                  color="#18A66A"
                />

              </View>

              <Text
                style={
                  s.analysisText
                }
              >
                En güçlü alanın{' '}

                <Text
                  style={
                    s.analysisBold
                  }
                >
                  {enIyiDers.ders}
                </Text>

                . Bu derste{' '}

                <Text
                  style={
                    s.analysisBold
                  }
                >
                  {enIyiDers.net.toFixed(
                    2
                  )} net
                </Text>

                {' '}yaptın.
              </Text>

            </View>

          )}

          {gelistirilecekDers && (

            <View
              style={
                s.analysisLine
              }
            >

              <View
                style={[
                  s.analysisIcon,
                  {
                    backgroundColor:
                      '#FFF1E7',
                  },
                ]}
              >

                <Ionicons
                  name="arrow-up"
                  size={13}
                  color="#F97316"
                />

              </View>

              <Text
                style={
                  s.analysisText
                }
              >
                En fazla geliştirebileceğin
                alan{' '}

                <Text
                  style={
                    s.analysisBold
                  }
                >
                  {gelistirilecekDers.ders}
                </Text>

                . Bu derste tekrar ve
                soru çözümünü artırabilirsin.
              </Text>

            </View>

          )}

          {oncekiDeneme && (

            <View
              style={
                s.analysisLine
              }
            >

              <View
                style={[
                  s.analysisIcon,
                  {
                    backgroundColor:
                      '#EEF3FF',
                  },
                ]}
              >

                <Ionicons
                  name={
                    netFarki >= 0
                      ? 'trending-up'
                      : 'trending-down'
                  }
                  size={13}
                  color="#4776E6"
                />

              </View>

              <Text
                style={
                  s.analysisText
                }
              >
                Önceki denemene göre{' '}

                <Text
                  style={
                    s.analysisBold
                  }
                >
                  {Math.abs(
                    netFarki
                  ).toFixed(2)}
                  {' net '}
                  {netFarki >= 0
                    ? 'artış'
                    : 'düşüş'}
                </Text>

                {' '}var.
              </Text>

            </View>

          )}

        </View>

        {/* ======================================================
            AI COACH
        ====================================================== */}

        <TouchableOpacity
          style={
            s.aiCoachCard
          }
          activeOpacity={
            0.85
          }
          onPress={() =>
            navigation
              .getParent()
              ?.navigate(
                'AI'
              )
          }
        >

          <View
            style={
              s.aiCoachIcon
            }
          >

            <Ionicons
              name="sparkles"
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
                s.aiCoachTitle
              }
            >
              AI Koç ile değerlendir
            </Text>

            <Text
              style={
                s.aiCoachSubtitle
              }
            >
              Sonuçların hakkında çalışma önerisi al.
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#FFF"
          />

        </TouchableOpacity>

        {/* ======================================================
            PROGRAM
        ====================================================== */}

        <TouchableOpacity
          style={
            s.programCard
          }
          activeOpacity={
            0.85
          }
          onPress={() =>
            navigation
              .getParent()
              ?.navigate(
                'Program'
              )
          }
        >

          <View
            style={
              s.programIcon
            }
          >

            <Ionicons
              name="calendar-outline"
              size={21}
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
                s.programTitle
              }
            >
              Çalışma programıma dön
            </Text>

            <Text
              style={
                s.programSubtitle
              }
            >
              Analiz sonuçlarına göre
              çalışmalarına devam et.
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#98A2B3"
          />

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function SummaryCard({
  value,
  label,
  icon,
  iconColor,
}: {
  value: string;
  label: string;
  icon: string;
  iconColor: string;
}) {

  return (
    <View
      style={
        s.summaryCard
      }
    >

      <View
        style={[
          s.summaryIcon,
          {
            backgroundColor:
              `${iconColor}15`,
          },
        ]}
      >

        <Ionicons
          name={
            icon as any
          }
          size={15}
          color={
            iconColor
          }
        />

      </View>

      <Text
        style={
          s.summaryValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          s.summaryLabel
        }
      >
        {label}
      </Text>

    </View>
  );
}

function ResultItem({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {

  return (
    <View
      style={
        s.resultItem
      }
    >

      <View
        style={[
          s.resultDot,
          {
            backgroundColor:
              color,
          },
        ]}
      />

      <Text
        style={
          s.resultText
        }
      >
        {value} {label}
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

    /* HEADER */

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
      gap: 12,
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent:
        'center',
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },

    headerMini: {
      color: '#F97316',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
    },

    examTypeBadge: {
      backgroundColor:
        '#FFF1E7',
      borderRadius: 7,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },

    examTypeText: {
      color: '#F97316',
      fontSize: 7,
      fontWeight: '900',
    },

    headerTitle: {
      color: '#202939',
      fontSize: 19,
      fontWeight: '900',
      marginTop: 3,
    },

    headerDate: {
      color: '#98A2B3',
      fontSize: 9,
      marginTop: 2,
    },

    scroll: {
      paddingHorizontal: 18,
      paddingBottom: 110,
    },

    /* HERO */

    heroCard: {
      backgroundColor:
        '#202939',
      minHeight: 135,
      borderRadius: 23,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    heroMini: {
      color:
        'rgba(255,255,255,0.5)',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
    },

    netRow: {
      flexDirection: 'row',
      alignItems:
        'flex-end',
      marginTop: 3,
    },

    heroNet: {
      color: '#FFF',
      fontSize: 37,
      fontWeight: '900',
    },

    heroNetLabel: {
      color: '#FDBA8C',
      fontSize: 11,
      fontWeight: '900',
      marginLeft: 5,
      marginBottom: 7,
    },

    heroChange: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 6,
    },

    heroChangeText: {
      color: '#5EE4A7',
      fontSize: 8,
      fontWeight: '800',
    },

    firstExamText: {
      color:
        'rgba(255,255,255,0.55)',
      fontSize: 8,
      marginTop: 7,
    },

    heroIcon: {
      width: 60,
      height: 60,
      borderRadius: 19,
      backgroundColor:
        '#EEF3FF',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    /* SECTIONS */

    sectionTitle: {
      color: '#202939',
      fontSize: 16,
      fontWeight: '900',
      marginTop: 25,
      marginBottom: 10,
    },

    /* SUMMARY */

    summaryRow: {
      flexDirection: 'row',
      gap: 8,
    },

    summaryCard: {
      flex: 1,
      backgroundColor: '#FFF',
      borderRadius: 16,
      alignItems: 'center',
      paddingVertical: 14,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    summaryIcon: {
      width: 28,
      height: 28,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    summaryValue: {
      color: '#202939',
      fontSize: 18,
      fontWeight: '900',
      marginTop: 6,
    },

    summaryLabel: {
      color: '#98A2B3',
      fontSize: 8,
      fontWeight: '700',
      marginTop: 2,
    },

    questionInfo: {
      backgroundColor:
        '#EEF3FF',
      borderRadius: 12,
      paddingHorizontal: 11,
      paddingVertical: 9,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      marginTop: 8,
    },

    questionInfoText: {
      color: '#667085',
      fontSize: 8,
      fontWeight: '700',
    },

    /* LESSON */

    lessonCard: {
      backgroundColor: '#FFF',
      borderRadius: 19,
      padding: 15,
      marginBottom: 9,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    lessonHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    lessonName: {
      color: '#202939',
      fontSize: 12,
      fontWeight: '900',
    },

    lessonQuestion: {
      color: '#98A2B3',
      fontSize: 8,
      marginTop: 2,
    },

    lessonNetBox: {
      alignItems: 'center',
    },

    lessonNet: {
      color: '#F97316',
      fontSize: 18,
      fontWeight: '900',
    },

    lessonNetLabel: {
      color: '#98A2B3',
      fontSize: 6,
      fontWeight: '900',
    },

    resultRow: {
      flexDirection: 'row',
      gap: 13,
      marginTop: 13,
    },

    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    resultDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },

    resultText: {
      color: '#667085',
      fontSize: 8,
      fontWeight: '700',
    },

    progressTop: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      marginTop: 13,
    },

    progressLabel: {
      color: '#98A2B3',
      fontSize: 7,
      fontWeight: '700',
    },

    progressPercent: {
      color: '#F97316',
      fontSize: 7,
      fontWeight: '900',
    },

    progressTrack: {
      height: 6,
      backgroundColor:
        '#F0EFED',
      borderRadius: 4,
      overflow: 'hidden',
      marginTop: 5,
    },

    progressFill: {
      height: '100%',
      backgroundColor:
        '#F97316',
      borderRadius: 4,
    },

    /* ANALYSIS */

    analysisCard: {
      backgroundColor:
        '#FFF1E7',
      borderRadius: 20,
      padding: 15,
    },

    analysisTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 9,
    },

    sparkleBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 9,
    },

    analysisTitle: {
      color: '#202939',
      fontSize: 11,
      fontWeight: '900',
    },

    analysisSubtitle: {
      color: '#98A2B3',
      fontSize: 7,
      marginTop: 2,
    },

    analysisLine: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
      gap: 8,
      marginTop: 10,
    },

    analysisIcon: {
      width: 24,
      height: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    analysisText: {
      flex: 1,
      color: '#667085',
      fontSize: 9,
      lineHeight: 14,
      paddingTop: 3,
    },

    analysisBold: {
      color: '#202939',
      fontWeight: '900',
    },

    /* AI */

    aiCoachCard: {
      backgroundColor:
        '#202939',
      borderRadius: 19,
      padding: 14,
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },

    aiCoachIcon: {
      width: 43,
      height: 43,
      borderRadius: 14,
      backgroundColor:
        '#F97316',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 11,
    },

    aiCoachTitle: {
      color: '#FFF',
      fontSize: 10,
      fontWeight: '900',
    },

    aiCoachSubtitle: {
      color:
        'rgba(255,255,255,0.55)',
      fontSize: 8,
      marginTop: 3,
    },

    /* PROGRAM */

    programCard: {
      backgroundColor: '#FFF',
      borderRadius: 19,
      padding: 14,
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    programIcon: {
      width: 43,
      height: 43,
      borderRadius: 14,
      backgroundColor:
        '#FFF1E7',
      justifyContent:
        'center',
      alignItems: 'center',
      marginRight: 11,
    },

    programTitle: {
      color: '#202939',
      fontSize: 10,
      fontWeight: '900',
    },

    programSubtitle: {
      color: '#98A2B3',
      fontSize: 8,
      marginTop: 3,
    },

    /* LOADING / EMPTY */

    loadingArea: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
      gap: 10,
    },

    loadingText: {
      color: '#98A2B3',
      fontSize: 10,
    },

    empty: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },

    emptyIcon: {
      width: 60,
      height: 60,
      borderRadius: 20,
      backgroundColor:
        '#FFF1E7',
      alignItems: 'center',
      justifyContent:
        'center',
      marginBottom: 14,
    },

    emptyTitle: {
      color: '#202939',
      fontSize: 17,
      fontWeight: '900',
    },

    emptySub: {
      color: '#98A2B3',
      fontSize: 9,
      lineHeight: 14,
      textAlign: 'center',
      marginTop: 5,
    },

    emptyButton: {
      backgroundColor:
        '#F97316',
      paddingHorizontal: 20,
      paddingVertical: 11,
      borderRadius: 13,
      marginTop: 15,
    },

    emptyButtonText: {
      color: '#FFF',
      fontSize: 9,
      fontWeight: '900',
    },

  });