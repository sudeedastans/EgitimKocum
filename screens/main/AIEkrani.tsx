import React, {
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../config/theme';

/* ============================================================
   TYPES
============================================================ */

type Mod =
  | 'menu'
  | 'soru'
  | 'ozet'
  | 'koc';

type Mesaj = {
  id: string;
  metin: string;
  gonderen:
    | 'kullanici'
    | 'ai';
};

/* ============================================================
   START MESSAGE
============================================================ */

const BASLANGIC: Mesaj[] = [
  {
    id: '0',
    metin:
      'Merhaba 👋 Ben Eğitim Koçum. Bir soru çözebilir, konu özeti hazırlayabilir veya çalışma programın hakkında sana yardımcı olabilirim.',
    gonderen: 'ai',
  },
];

/* ============================================================
   SCREEN
============================================================ */

export default function AIEkrani() {

  const [
    mesajlar,
    setMesajlar,
  ] =
    useState<Mesaj[]>(
      BASLANGIC
    );

  const [
    giris,
    setGiris,
  ] = useState('');

  const [
    yukluyor,
    setYukluyor,
  ] = useState(false);

  const [
    aktifMod,
    setAktifMod,
  ] =
    useState<Mod>('menu');

  const listRef =
    useRef<FlatList<Mesaj>>(
      null
    );

  /* ============================================================
     MODE
  ============================================================ */

  const modSec = (
    mod: Mod
  ) => {

    setAktifMod(mod);

    if (
      mod === 'soru'
    ) {
      setGiris('');
    }

    if (
      mod === 'ozet'
    ) {
      setGiris('');
    }

    if (
      mod === 'koc'
    ) {
      setGiris('');
    }
  };

  const placeholderGetir =
    () => {

      if (
        aktifMod === 'soru'
      ) {
        return 'Sorunu buraya yaz...';
      }

      if (
        aktifMod === 'ozet'
      ) {
        return 'Örn. TYT Matematik - Fonksiyonlar';
      }

      if (
        aktifMod === 'koc'
      ) {
        return 'AI Koçuna bir şey sor...';
      }

      return 'Mesajını yaz...';
    };

  /* ============================================================
     SYSTEM PROMPT
  ============================================================ */

  const systemPromptGetir =
    () => {

      const ortak = `
Sen Eğitim Koçum uygulamasının AI eğitim koçusun.
Türkçe konuşuyorsun.
Kullanıcı YKS öğrencisi.
Yanıtların açık, anlaşılır ve öğrenci seviyesine uygun olmalı.
Gereksiz uzun cevap verme.
`;

      if (
        aktifMod === 'soru'
      ) {

        return `
${ortak}

Şu anda SORU ÇÖZME modundasın.

Bir soru gönderildiğinde:
- Sorunun hangi ders ve konuyla ilgili olduğunu belirle.
- Çözümü adım adım anlat.
- Sadece cevabı verme, öğrencinin mantığı anlamasını sağla.
- Matematiksel işlem varsa düzenli göster.
- Sonunda doğru cevabı açıkça belirt.
- Uygunsa kısa bir püf noktası ekle.
`;
      }

      if (
        aktifMod === 'ozet'
      ) {

        return `
${ortak}

Şu anda KONU ÖZETİ modundasın.

Öğrenci bir konu söylediğinde:
- Kısa konu özeti hazırla.
- Bilinmesi gereken temel kavramları ver.
- Önemli formül veya kuralları belirt.
- Sık yapılan hataları yaz.
- Sonunda 2-3 maddelik hızlı tekrar bölümü oluştur.
`;
      }

      return `
${ortak}

Şu anda AI KOÇ modundasın.

Öğrenciye:
- çalışma planı,
- zaman yönetimi,
- ders çalışma yöntemi,
- program düzenleme,
- YKS motivasyonu

konularında yardımcı ol.
`;
    };

  /* ============================================================
     SEND
  ============================================================ */

  const gonder =
    async (
      hazirMesaj?: string
    ) => {

      const metin =
        (
          hazirMesaj ??
          giris
        ).trim();

      if (
        !metin ||
        yukluyor
      ) {
        return;
      }

      const kullaniciMesaj:
        Mesaj = {
        id:
          Date.now().toString(),

        metin,

        gonderen:
          'kullanici',
      };

      setMesajlar(
        prev => [
          ...prev,
          kullaniciMesaj,
        ]
      );

      setGiris('');
      setYukluyor(true);

      /*
        ========================================================

        ÖNEMLİ

        Burada React Native'den doğrudan Anthropic API'ye
        bağlanmıyoruz.

        Gerçek uygulamada:

        React Native
              ↓
        Bizim backend
              ↓
        AI API

        şeklinde olacak.

        Şimdilik tasarımı görebilmek için demo cevap üretiyoruz.

        ========================================================
      */

      try {

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              800
            )
        );

        let aiYanit =
          '';

        if (
          aktifMod ===
          'soru'
        ) {

          aiYanit =
            `Sorunu aldım 📘\n\n"${metin}"\n\nBu bölüm backend'deki AI modeline bağlandığında soruyu analiz edip sana adım adım çözüm verecek.\n\nİstersen çözümü "ipucu", "adım adım" veya "sadece cevap" şeklinde de sunabiliriz.`;

        } else if (
          aktifMod ===
          'ozet'
        ) {

          aiYanit =
            `📚 ${metin}\n\nBu konu için AI burada sana:\n\n• kısa konu özeti\n• önemli kurallar\n• formüller\n• sık yapılan hatalar\n• hızlı tekrar soruları\n\nhazırlayacak.`;

        } else {

          aiYanit =
            `Tabii! "${metin}" konusunda sana yardımcı olabilirim. Gerçek AI backend bağlantısını yaptığımızda çalışma programını ve ilerlemeni de dikkate alarak kişisel öneriler vereceğim.`;

        }

        const cevap:
          Mesaj = {

          id:
            `${Date.now()}-ai`,

          metin:
            aiYanit,

          gonderen:
            'ai',
        };

        setMesajlar(
          prev => [
            ...prev,
            cevap,
          ]
        );

      } catch {

        setMesajlar(
          prev => [
            ...prev,
            {
              id:
                `${Date.now()}-error`,

              metin:
                'Bir hata oluştu. Tekrar deneyebilirsin.',

              gonderen:
                'ai',
            },
          ]
        );

      } finally {

        setYukluyor(false);

        setTimeout(
          () =>
            listRef.current?.scrollToEnd(
              {
                animated:
                  true,
              }
            ),
          100
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

      {/* HEADER */}

      <View style={s.header}>

        <View style={s.aiAvatar}>

          <Ionicons
            name="sparkles"
            size={20}
            color="#FFF"
          />

        </View>

        <View style={{ flex: 1 }}>

          <Text
            style={
              s.headerMini
            }
          >
            KİŞİSEL ASİSTANIN
          </Text>

          <Text
            style={
              s.headerBaslik
            }
          >
            AI Koç
          </Text>

          <Text
            style={s.headerAlt}
          >
            Sorularını çöz, konuları tekrar et
          </Text>

        </View>

        <View style={s.onlineBadge}>

          <View
            style={s.onlineDot}
          />

          <Text
            style={
              s.onlineText
            }
          >
            Hazır
          </Text>

        </View>

      </View>

      {/* MODE CARDS */}

      <View style={s.actionsArea}>

        <Text style={s.actionTitle}>
          Bugün sana nasıl yardımcı olayım?
        </Text>

        <View style={s.actionRow}>

          {/* QUESTION */}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              s.actionCard,
              aktifMod ===
                'soru' &&
                s.actionCardActive,
            ]}
            onPress={() =>
              modSec('soru')
            }
          >

            <View
              style={[
                s.actionIcon,
                {
                  backgroundColor:
                    '#FFF1E7',
                },
              ]}
            >

              <Ionicons
                name="camera-outline"
                size={22}
                color="#F97316"
              />

            </View>

            <Text
              style={
                s.actionCardTitle
              }
            >
              Soru Çöz
            </Text>

            <Text
              style={
                s.actionCardSub
              }
            >
              Yaz veya fotoğraf yükle
            </Text>

          </TouchableOpacity>

          {/* SUMMARY */}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              s.actionCard,
              aktifMod ===
                'ozet' &&
                s.actionCardActive,
            ]}
            onPress={() =>
              modSec('ozet')
            }
          >

            <View
              style={[
                s.actionIcon,
                {
                  backgroundColor:
                    '#EEF3FF',
                },
              ]}
            >

              <Ionicons
                name="book-outline"
                size={22}
                color="#4776E6"
              />

            </View>

            <Text
              style={
                s.actionCardTitle
              }
            >
              Konu Özeti
            </Text>

            <Text
              style={
                s.actionCardSub
              }
            >
              Hızlı tekrar yap
            </Text>

          </TouchableOpacity>

          {/* COACH */}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              s.actionCard,
              aktifMod ===
                'koc' &&
                s.actionCardActive,
            ]}
            onPress={() =>
              modSec('koc')
            }
          >

            <View
              style={[
                s.actionIcon,
                {
                  backgroundColor:
                    '#E9F8F1',
                },
              ]}
            >

              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color="#18A66A"
              />

            </View>

            <Text
              style={
                s.actionCardTitle
              }
            >
              AI Koç
            </Text>

            <Text
              style={
                s.actionCardSub
              }
            >
              Programını konuş
            </Text>

          </TouchableOpacity>

        </View>

        {/* QUICK PROMPTS */}

        {aktifMod ===
          'soru' && (

          <View style={s.quickRow}>

            <TouchableOpacity
              style={s.quickChip}
              onPress={() =>
                setGiris(
                  'Bu matematik sorusunu adım adım çöz: '
                )
              }
            >
              <Text
                style={s.quickText}
              >
                Matematik
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.quickChip}
              onPress={() =>
                setGiris(
                  'Bu fizik sorusunu açıkla: '
                )
              }
            >
              <Text
                style={s.quickText}
              >
                Fizik
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.quickChip}
              onPress={() =>
                setGiris(
                  'Bu soruda bana sadece ipucu ver: '
                )
              }
            >
              <Text
                style={s.quickText}
              >
                İpucu Ver
              </Text>
            </TouchableOpacity>

          </View>

        )}

        {aktifMod ===
          'ozet' && (

          <View style={s.quickRow}>

            <TouchableOpacity
              style={s.quickChip}
              onPress={() =>
                gonder(
                  'TYT Matematik Fonksiyonlar'
                )
              }
            >
              <Text
                style={s.quickText}
              >
                Fonksiyonlar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.quickChip}
              onPress={() =>
                gonder(
                  'TYT Fizik Elektrik'
                )
              }
            >
              <Text
                style={s.quickText}
              >
                Elektrik
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.quickChip}
              onPress={() =>
                gonder(
                  'TYT Türkçe Paragraf'
                )
              }
            >
              <Text
                style={s.quickText}
              >
                Paragraf
              </Text>
            </TouchableOpacity>

          </View>

        )}

      </View>

      {/* CHAT */}

      <FlatList
        ref={listRef}
        data={mesajlar}
        keyExtractor={
          item => item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          s.mesajListesi
        }
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd(
            {
              animated: true,
            }
          )
        }
        renderItem={({
          item,
        }) => (

          <View
            style={[
              s.mesajRow,
              item.gonderen ===
                'kullanici' &&
                s.mesajRowKullanici,
            ]}
          >

            {item.gonderen ===
              'ai' && (

              <View
                style={
                  s.aiMesajAvatar
                }
              >

                <Ionicons
                  name="sparkles"
                  size={11}
                  color="#FFF"
                />

              </View>

            )}

            <View
              style={[
                s.mesajBubble,

                item.gonderen ===
                  'kullanici'
                  ? s.mesajBubbleKullanici
                  : s.mesajBubbleAI,
              ]}
            >

              <Text
                style={[
                  s.mesajYazi,

                  item.gonderen ===
                    'kullanici' &&
                    s.mesajYaziKullanici,
                ]}
              >
                {item.metin}
              </Text>

            </View>

          </View>

        )}
      />

      {/* LOADING */}

      {yukluyor && (

        <View style={s.yaziyor}>

          <ActivityIndicator
            size="small"
            color={
              Colors.primary
            }
          />

          <Text
            style={
              s.yaziyorYazi
            }
          >
            AI düşünüyor...
          </Text>

        </View>

      )}

      {/* INPUT */}

      <KeyboardAvoidingView
        behavior={
          Platform.OS ===
          'ios'
            ? 'padding'
            : undefined
        }
      >

        <View
          style={s.girisAlani}
        >

          {aktifMod ===
            'soru' && (

            <TouchableOpacity
              style={
                s.imageButton
              }
              onPress={() =>
                Alert.alert(
                  'Fotoğraftan soru çözme',
                  'Bir sonraki adımda kamera ve galeriyi buraya bağlayacağız.'
                )
              }
            >

              <Ionicons
                name="camera-outline"
                size={20}
                color="#F97316"
              />

            </TouchableOpacity>

          )}

          <TextInput
            style={s.girisInput}
            placeholder={
              placeholderGetir()
            }
            placeholderTextColor="#98A2B3"
            value={giris}
            onChangeText={
              setGiris
            }
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[
              s.gonderBtn,

              (!giris.trim() ||
                yukluyor) &&
                s.gonderBtnDisable,
            ]}
            onPress={() =>
              gonder()
            }
            disabled={
              !giris.trim() ||
              yukluyor
            }
          >

            <Ionicons
              name="arrow-up"
              size={19}
              color="#FFF"
            />

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
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
      backgroundColor:
        '#202939',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      paddingHorizontal: 17,
      paddingVertical: 14,
    },

    aiAvatar: {
      width: 43,
      height: 43,
      borderRadius: 14,
      backgroundColor:
        '#F97316',
      justifyContent:
        'center',
      alignItems: 'center',
    },

    headerMini: {
      color: '#FDBA8C',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 1,
    },

    headerBaslik: {
      color: '#FFF',
      fontSize: 19,
      fontWeight: '900',
      marginTop: 1,
    },

    headerAlt: {
      color:
        'rgba(255,255,255,0.55)',
      fontSize: 8,
      marginTop: 1,
    },

    onlineBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        'rgba(255,255,255,0.09)',
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 10,
      gap: 5,
    },

    onlineDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        '#5EE4A7',
    },

    onlineText: {
      color: '#FFF',
      fontSize: 7,
      fontWeight: '800',
    },

    actionsArea: {
      backgroundColor: '#FFF',
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor:
        '#F0EFED',
    },

    actionTitle: {
      color: '#202939',
      fontSize: 11,
      fontWeight: '900',
      marginBottom: 10,
    },

    actionRow: {
      flexDirection: 'row',
      gap: 8,
    },

    actionCard: {
      flex: 1,
      minHeight: 102,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        '#EEEDEB',
      backgroundColor:
        '#FAFAF9',
      padding: 10,
    },

    actionCardActive: {
      borderColor:
        '#F97316',
      backgroundColor:
        '#FFF9F5',
    },

    actionIcon: {
      width: 36,
      height: 36,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    actionCardTitle: {
      color: '#202939',
      fontSize: 9,
      fontWeight: '900',
      marginTop: 8,
    },

    actionCardSub: {
      color: '#98A2B3',
      fontSize: 7,
      lineHeight: 10,
      marginTop: 2,
    },

    quickRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginTop: 10,
    },

    quickChip: {
      backgroundColor:
        '#F8F7F4',
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: 12,
      borderWidth: 1,
      borderColor:
        '#EEEDEB',
    },

    quickText: {
      color: '#667085',
      fontSize: 8,
      fontWeight: '800',
    },

    mesajListesi: {
      paddingHorizontal: 14,
      paddingVertical: 16,
      gap: 12,
      flexGrow: 1,
    },

    mesajRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      maxWidth: '88%',
      gap: 7,
    },

    mesajRowKullanici: {
      alignSelf: 'flex-end',
    },

    aiMesajAvatar: {
      width: 27,
      height: 27,
      borderRadius: 9,
      backgroundColor:
        '#F97316',
      justifyContent:
        'center',
      alignItems: 'center',
      marginTop: 2,
    },

    mesajBubble: {
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },

    mesajBubbleAI: {
      backgroundColor: '#FFF',
      borderBottomLeftRadius: 5,
      borderWidth: 1,
      borderColor:
        '#F0EFED',
    },

    mesajBubbleKullanici: {
      backgroundColor:
        '#F97316',
      borderBottomRightRadius: 5,
    },

    mesajYazi: {
      color: '#344054',
      fontSize: 12,
      lineHeight: 18,
    },

    mesajYaziKullanici: {
      color: '#FFF',
    },

    yaziyor: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingHorizontal: 50,
      paddingVertical: 7,
    },

    yaziyorYazi: {
      fontSize: 9,
      color: '#98A2B3',
    },

    girisAlani: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
      paddingHorizontal: 12,
      paddingTop: 9,
      paddingBottom: 11,
      backgroundColor: '#FFF',
      borderTopWidth: 1,
      borderTopColor:
        '#F0EFED',
    },

    imageButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor:
        '#FFF1E7',
      justifyContent:
        'center',
      alignItems: 'center',
    },

    girisInput: {
      flex: 1,
      minHeight: 42,
      maxHeight: 100,
      fontSize: 11,
      color: '#202939',
      backgroundColor:
        '#F7F7F6',
      borderRadius: 15,
      paddingHorizontal: 13,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor:
        '#EEEDEB',
    },

    gonderBtn: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor:
        '#F97316',
      justifyContent:
        'center',
      alignItems: 'center',
    },

    gonderBtnDisable: {
      backgroundColor:
        '#D5D8DD',
    },

  });