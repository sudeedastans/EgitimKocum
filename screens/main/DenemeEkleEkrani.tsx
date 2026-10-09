import React, {
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import {
  type DenemeSonucu,
} from '../../data/denemeData';

type DersGirisi = {
  ders: string;
  soru: number;
  dogru: string;
  yanlis: string;
};

const TYT_DERSLER = [
  {
    ders: 'Türkçe',
    soru: 40,
    dogru: '',
    yanlis: '',
  },

  {
    ders: 'Matematik',
    soru: 40,
    dogru: '',
    yanlis: '',
  },

  {
    ders: 'Sosyal',
    soru: 20,
    dogru: '',
    yanlis: '',
  },

  {
    ders: 'Fen',
    soru: 20,
    dogru: '',
    yanlis: '',
  },
];

export default function DenemeEkleEkrani({
  navigation,
  route,
}: any) {
  const storageUserKey =
    route?.params
      ?.storageUserKey ??
    'ogrenci';

  const STORAGE_KEY =
    `deneme-sonuclari-${storageUserKey}`;

  const [
    ad,
    setAd,
  ] =
    useState(
      'TYT Genel Deneme'
    );

  const [
    dersler,
    setDersler,
  ] =
    useState<DersGirisi[]>(
      TYT_DERSLER
    );

  const netHesapla = (
    dogru: number,
    yanlis: number
  ) =>
    Number(
      (
        dogru -
        yanlis / 4
      ).toFixed(2)
    );

  const alanDegistir = (
    index: number,
    alan:
      | 'dogru'
      | 'yanlis',
    value: string
  ) => {
    const temiz =
      value.replace(
        /[^0-9]/g,
        ''
      );

    setDersler(
      prev =>
        prev.map(
          (
            ders,
            i
          ) =>
            i === index
              ? {
                  ...ders,
                  [alan]:
                    temiz,
                }
              : ders
        )
    );
  };

  const toplamNet =
    useMemo(
      () =>
        dersler.reduce(
          (
            toplam,
            ders
          ) =>
            toplam +
            netHesapla(
              Number(
                ders.dogru ||
                  0
              ),

              Number(
                ders.yanlis ||
                  0
              )
            ),
          0
        ),
      [dersler]
    );

  const kaydet =
    async () => {
      for (
        const ders of dersler
      ) {
        const dogru =
          Number(
            ders.dogru || 0
          );

        const yanlis =
          Number(
            ders.yanlis || 0
          );

        if (
          dogru < 0 ||
          yanlis < 0 ||
          dogru +
            yanlis >
            ders.soru
        ) {
          Alert.alert(
            'Sonuçları kontrol et',
            `${ders.ders} için doğru + yanlış sayısı ${ders.soru} soruyu geçemez.`
          );

          return;
        }
      }

      const yeniDeneme:
        DenemeSonucu = {
        id:
          `deneme-${Date.now()}`,

        tarih:
          new Date().toLocaleDateString(
            'tr-TR',
            {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }
          ),

        ad:
          ad.trim() ||
          'TYT Genel Deneme',

        tur: 'TYT',

        toplamNet,

        dersler:
          dersler.map(
            ders => {
              const dogru =
                Number(
                  ders.dogru ||
                    0
                );

              const yanlis =
                Number(
                  ders.yanlis ||
                    0
                );

              const bos =
                Math.max(
                  0,
                  ders.soru -
                    dogru -
                    yanlis
                );

              return {
                ders:
                  ders.ders,

                soru:
                  ders.soru,

                dogru,

                yanlis,

                bos,

                net:
                  netHesapla(
                    dogru,
                    yanlis
                  ),
              };
            }
          ),
      };

      try {
        const kayitli =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );

        const mevcut:
          DenemeSonucu[] =
          kayitli
            ? JSON.parse(
                kayitli
              )
            : [];

        const yeniListe = [
          yeniDeneme,
          ...mevcut,
        ];

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            yeniListe
          )
        );

       navigation.replace(
  'DenemeAnaliz',
  {
    denemeId: yeniDeneme.id,
    storageUserKey,
  }
);
      } catch (error) {
        console.log(
          error
        );

        Alert.alert(
          'Hata',
          'Deneme kaydedilemedi.'
        );
      }
    };

  return (
    <SafeAreaView
      style={s.container}
    >
      <View style={s.header}>
        <TouchableOpacity
          style={s.back}
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

        <View>
          <Text
            style={
              s.headerMini
            }
          >
            DENEME MERKEZİN
          </Text>

          <Text
            style={
              s.headerTitle
            }
          >
            Yeni Deneme
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={
          s.scroll
        }
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.label}>
          Deneme adı
        </Text>

        <TextInput
          style={
            s.nameInput
          }
          value={ad}
          onChangeText={
            setAd
          }
          placeholder="TYT Genel Deneme"
        />

        <View
          style={
            s.netCard
          }
        >
          <View>
            <Text
              style={
                s.netMini
              }
            >
              HESAPLANAN TOPLAM
            </Text>

            <Text
              style={
                s.netNumber
              }
            >
              {toplamNet.toFixed(
                2
              )}
              {' '}

              <Text
                style={
                  s.netUnit
                }
              >
                net
              </Text>
            </Text>
          </View>

          <View
            style={
              s.calcIcon
            }
          >
            <Ionicons
              name="calculator-outline"
              size={28}
              color="#F97316"
            />
          </View>
        </View>

        <Text
          style={
            s.sectionTitle
          }
        >
          Sonuçlarını Gir
        </Text>

        <Text
          style={
            s.sectionSub
          }
        >
          Doğru ve yanlış
          sayılarını gir. Boş ve
          net otomatik hesaplanır.
        </Text>

        {dersler.map(
          (
            ders,
            index
          ) => {
            const dogru =
              Number(
                ders.dogru ||
                  0
              );

            const yanlis =
              Number(
                ders.yanlis ||
                  0
              );

            const bos =
              Math.max(
                0,
                ders.soru -
                  dogru -
                  yanlis
              );

            const net =
              netHesapla(
                dogru,
                yanlis
              );

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
                    style={{
                      alignItems:
                        'flex-end',
                    }}
                  >
                    <Text
                      style={
                        s.lessonNet
                      }
                    >
                      {net.toFixed(
                        2
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
                  style={
                    s.inputRow
                  }
                >
                  <ResultInput
                    label="Doğru"
                    value={
                      ders.dogru
                    }
                    onChangeText={
                      value =>
                        alanDegistir(
                          index,
                          'dogru',
                          value
                        )
                    }
                  />

                  <ResultInput
                    label="Yanlış"
                    value={
                      ders.yanlis
                    }
                    onChangeText={
                      value =>
                        alanDegistir(
                          index,
                          'yanlis',
                          value
                        )
                    }
                  />

                  <View
                    style={
                      s.resultArea
                    }
                  >
                    <Text
                      style={
                        s.resultLabel
                      }
                    >
                      Boş
                    </Text>

                    <View
                      style={
                        s.autoBox
                      }
                    >
                      <Text
                        style={
                          s.autoNumber
                        }
                      >
                        {bos}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }
        )}

        <View
          style={
            s.infoCard
          }
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#4776E6"
          />

          <Text
            style={
              s.infoText
            }
          >
            Net hesabında 4 yanlış
            1 doğruyu götürür.
          </Text>
        </View>

        <TouchableOpacity
          style={
            s.saveButton
          }
          onPress={kaydet}
        >
          <Ionicons
            name="analytics-outline"
            size={19}
            color="#FFF"
          />

          <Text
            style={
              s.saveText
            }
          >
            Kaydet ve Analizimi Gör
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText:
    (
      value: string
    ) => void;
}) {
  return (
    <View
      style={s.resultArea}
    >
      <Text
        style={s.resultLabel}
      >
        {label}
      </Text>

      <TextInput
        style={s.input}
        value={value}
        onChangeText={
          onChangeText
        }
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="#B7BDC7"
        maxLength={2}
      />
    </View>
  );
}

const s =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F8F7F4',
    },

    header: {
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    back: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    headerMini: {
      color: '#F97316',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
    },

    headerTitle: {
      color: '#202939',
      fontSize: 23,
      fontWeight: '900',
      marginTop: 2,
    },

    scroll: {
      paddingHorizontal: 18,
      paddingBottom: 100,
    },

    label: {
      color: '#344054',
      fontSize: 10,
      fontWeight: '900',
      marginBottom: 7,
    },

    nameInput: {
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 15,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
      color: '#202939',
    },

    netCard: {
      backgroundColor:
        '#202939',
      borderRadius: 21,
      padding: 17,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    netMini: {
      color:
        'rgba(255,255,255,0.5)',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 1,
    },

    netNumber: {
      color: '#FFF',
      fontSize: 32,
      fontWeight: '900',
      marginTop: 3,
    },

    netUnit: {
      color: '#FDBA8C',
      fontSize: 10,
    },

    calcIcon: {
      width: 55,
      height: 55,
      borderRadius: 18,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    sectionTitle: {
      color: '#202939',
      fontSize: 17,
      fontWeight: '900',
      marginTop: 24,
    },

    sectionSub: {
      color: '#98A2B3',
      fontSize: 9,
      lineHeight: 14,
      marginTop: 3,
      marginBottom: 12,
    },

    lessonCard: {
      backgroundColor: '#FFF',
      borderRadius: 19,
      padding: 14,
      marginBottom: 10,
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

    lessonNet: {
      color: '#F97316',
      fontSize: 17,
      fontWeight: '900',
    },

    lessonNetLabel: {
      color: '#98A2B3',
      fontSize: 6,
      fontWeight: '900',
    },

    inputRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 14,
    },

    resultArea: {
      flex: 1,
    },

    resultLabel: {
      color: '#667085',
      fontSize: 8,
      fontWeight: '800',
      marginBottom: 5,
    },

    input: {
      height: 44,
      borderRadius: 12,
      backgroundColor:
        '#F8F7F4',
      textAlign: 'center',
      color: '#202939',
      fontSize: 13,
      fontWeight: '900',
    },

    autoBox: {
      height: 44,
      borderRadius: 12,
      backgroundColor:
        '#EEF3FF',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    autoNumber: {
      color: '#4776E6',
      fontSize: 13,
      fontWeight: '900',
    },

    infoCard: {
      backgroundColor:
        '#EEF3FF',
      borderRadius: 15,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    infoText: {
      color: '#667085',
      fontSize: 8,
    },

    saveButton: {
      height: 53,
      borderRadius: 16,
      backgroundColor:
        '#F97316',
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 8,
    },

    saveText: {
      color: '#FFF',
      fontSize: 10,
      fontWeight: '900',
    },
  });