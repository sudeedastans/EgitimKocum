import React, {
  useCallback,
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
  useFocusEffect,
} from '@react-navigation/native';

import {
  type DenemeSonucu,
} from '../../data/denemeData';

export default function TumDenemelerEkrani({
  navigation,
  route,
}: any) {
  const storageUserKey =
    route?.params
      ?.storageUserKey ??
    'ogrenci';

  const DENEME_STORAGE_KEY =
    `deneme-sonuclari-${storageUserKey}`;
  const [
    denemeler,
    setDenemeler,
  ] =
    useState<DenemeSonucu[]>(
      []
    );

  const [
    yukleniyor,
    setYukleniyor,
  ] =
    useState(true);

  /*
    Ekran her açıldığında storage tekrar okunur.
    Böylece yeni eklenen deneme anında görünür.
  */
  useFocusEffect(
    useCallback(() => {
      let aktif = true;

      const getir =
        async () => {
          setYukleniyor(
            true
          );

          try {
            const kayitli =
              await AsyncStorage.getItem(
                DENEME_STORAGE_KEY
              );

            let liste:
              DenemeSonucu[];

            if (kayitli) {
              liste =
                JSON.parse(
                  kayitli
                );
            } else {
              /*
                Yeni hesap:
                başka kullanıcının veya demo denemelerinin
                görünmemesi için boş başlar.
              */
              liste = [];
            }

            if (aktif) {
              setDenemeler(
                liste
              );
            }
          } catch (error) {
            console.log(
              'Denemeler yüklenemedi:',
              error
            );

            if (aktif) {
              setDenemeler(
                []
              );
            }
          } finally {
            if (aktif) {
              setYukleniyor(
                false
              );
            }
          }
        };

      getir();

      return () => {
        aktif = false;
      };
    }, [
      DENEME_STORAGE_KEY,
    ])
  );

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

        <View
          style={{
            flex: 1,
          }}
        >

          <Text style={s.mini}>
            DENEME MERKEZİN
          </Text>

          <Text style={s.title}>
            Tüm Denemeler
          </Text>

        </View>

        <TouchableOpacity
          style={s.addTop}
          onPress={() =>
            navigation.navigate(
              'DenemeEkle',
              {
                storageUserKey,
              }
            )
          }
        >
          <Ionicons
            name="add"
            size={21}
            color="#FFF"
          />
        </TouchableOpacity>

      </View>

      {yukleniyor ? (

        <View
          style={s.loading}
        >
          <ActivityIndicator
            size="large"
            color="#4776E6"
          />

          <Text
            style={s.loadingText}
          >
            Denemelerin yükleniyor...
          </Text>
        </View>

      ) : (

        <ScrollView
          contentContainerStyle={
            s.scroll
          }
          showsVerticalScrollIndicator={
            false
          }
        >

          {denemeler.length ===
          0 ? (

            <View
              style={s.empty}
            >
              <Ionicons
                name="analytics-outline"
                size={28}
                color="#98A2B3"
              />

              <Text
                style={s.emptyTitle}
              >
                Henüz deneme yok
              </Text>

              <Text
                style={s.emptySub}
              >
                Yeni bir deneme sonucu eklediğinde burada görünecek.
              </Text>
            </View>

          ) : (

            denemeler.map(
              deneme => (

                <View
                  key={deneme.id}
                  style={s.card}
                >

                  <View
                    style={s.icon}
                  >

                    <Ionicons
                      name="document-text-outline"
                      size={21}
                      color="#4776E6"
                    />

                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >

                    <View
                      style={s.nameRow}
                    >
                      <Text
                        style={s.examName}
                      >
                        {deneme.ad}
                      </Text>

                      {deneme.tur && (
                        <View
                          style={s.typeBadge}
                        >
                          <Text
                            style={s.typeText}
                          >
                            {deneme.tur}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={s.date}
                    >
                      {deneme.tarih}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(
                          'DenemeAnaliz',
                          {
                            denemeId:
                              deneme.id,
                            storageUserKey,
                          }
                        )
                      }
                    >

                      <Text
                        style={s.analysis}
                      >
                        Deneme analizimi gör →
                      </Text>

                    </TouchableOpacity>

                  </View>

                  <View
                    style={s.netBox}
                  >

                    <Text
                      style={s.net}
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
                      style={s.netLabel}
                    >
                      NET
                    </Text>

                  </View>

                </View>

              )
            )

          )}

        </ScrollView>

      )}

    </SafeAreaView>
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
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
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

    addTop: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor:
        '#4776E6',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    mini: {
      color: '#4776E6',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
    },

    title: {
      color: '#202939',
      fontSize: 24,
      fontWeight: '900',
      marginTop: 2,
    },

    scroll: {
      padding: 18,
      gap: 10,
      paddingBottom: 100,
    },

    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 10,
    },

    loadingText: {
      color: '#98A2B3',
      fontSize: 9,
    },

    empty: {
      backgroundColor: '#FFF',
      borderRadius: 20,
      padding: 30,
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    emptyTitle: {
      color: '#202939',
      fontSize: 13,
      fontWeight: '900',
      marginTop: 8,
    },

    emptySub: {
      color: '#98A2B3',
      fontSize: 9,
      textAlign: 'center',
      marginTop: 4,
    },

    card: {
      backgroundColor: '#FFF',
      borderRadius: 19,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    icon: {
      width: 45,
      height: 45,
      borderRadius: 15,
      backgroundColor:
        '#EEF3FF',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 12,
    },

    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },

    examName: {
      color: '#202939',
      fontSize: 12,
      fontWeight: '900',
    },

    typeBadge: {
      backgroundColor:
        '#FFF1E7',
      borderRadius: 7,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },

    typeText: {
      color: '#F97316',
      fontSize: 6,
      fontWeight: '900',
    },

    date: {
      color: '#98A2B3',
      fontSize: 9,
      marginTop: 3,
    },

    analysis: {
      color: '#4776E6',
      fontSize: 9,
      fontWeight: '800',
      marginTop: 7,
    },

    netBox: {
      alignItems: 'center',
      minWidth: 64,
    },

    net: {
      color: '#202939',
      fontSize: 17,
      fontWeight: '900',
    },

    netLabel: {
      color: '#98A2B3',
      fontSize: 7,
      fontWeight: '800',
    },
  });
