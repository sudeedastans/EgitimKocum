import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const OGRENIM_DURUMLARI = [
  { id: '9', baslik: '9. Sınıf', aciklama: 'Lise 1' },
  { id: '10', baslik: '10. Sınıf', aciklama: 'Lise 2' },
  { id: '11', baslik: '11. Sınıf', aciklama: 'Lise 3' },
  { id: '12', baslik: '12. Sınıf', aciklama: 'YKS yılı' },
  { id: 'mezun', baslik: 'Mezun', aciklama: 'YKS hazırlık' },
];

export default function KayitEkrani({ navigation }: any) {
  const [adSoyad, setAdSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [ogrenimDurumu, setOgrenimDurumu] = useState('');
  const [hata, setHata] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);

  const handleKayit = () => {
    setHata('');

    if (!adSoyad.trim()) {
      setHata('Lütfen adınızı ve soyadınızı girin.');
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setHata('Geçerli bir e-posta adresi girin.');
      return;
    }

    if (sifre.length < 6) {
      setHata('Şifreniz en az 6 karakter olmalı.');
      return;
    }

    if (!ogrenimDurumu) {
      setHata('Lütfen öğrenim durumunuzu seçin.');
      return;
    }

    if (
      ogrenimDurumu === '9' ||
      ogrenimDurumu === '10' ||
      ogrenimDurumu === '11'
    ) {
      setHata(
        'Eğitim Koçum şu anda yalnızca YKS’ye aktif olarak hazırlanan 12. sınıf ve mezun öğrenciler için kullanılabilir.'
      );
      return;
    }

    navigation.replace('Onboarding', {
      adSoyad: adSoyad.trim(),
      email: email.trim(),
      ogrenimDurumu,
    });
  };

  const sifreGuclu = sifre.length >= 8;
  const sifreOrta = sifre.length >= 6 && sifre.length < 8;

  const yksIcinUygunDegil =
    ogrenimDurumu === '9' ||
    ogrenimDurumu === '10' ||
    ogrenimDurumu === '11';

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
        >
          {/* ÜST LOGO */}

          <View style={s.topArea}>
            <View style={s.logoIcon}>
              <Ionicons
                name="school-outline"
                size={27}
                color="#F97316"
              />
            </View>

            <Text style={s.logoText}>EĞİTİM KOÇUM</Text>

            <Text style={s.logoSub}>
              Sana özel çalışma yolculuğun
            </Text>
          </View>

          {/* ANA KART */}

          <View style={s.formCard}>
            <View style={s.formHeader}>
              <Text style={s.miniLabel}>HEMEN BAŞLA</Text>

              <Text style={s.title}>
                Hesabını oluştur 👋
              </Text>

              <Text style={s.description}>
                Sana uygun çalışma planını oluşturabilmemiz için
                birkaç temel bilgiyle başlayalım.
              </Text>
            </View>

            {/* AD SOYAD */}

            <Text style={s.inputLabel}>Ad Soyad</Text>

            <View
              style={[
                s.inputContainer,
                adSoyad.length > 0 && s.inputActive,
              ]}
            >
              <View style={s.inputIcon}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#F97316"
                />
              </View>

              <TextInput
                style={s.input}
                placeholder="Adınız ve soyadınız"
                placeholderTextColor="#A8AFBA"
                value={adSoyad}
                onChangeText={text => {
                  setAdSoyad(text);
                  setHata('');
                }}
                autoCapitalize="words"
              />
            </View>

            {/* EMAIL */}

            <Text style={s.inputLabel}>E-posta</Text>

            <View
              style={[
                s.inputContainer,
                email.length > 0 && s.inputActive,
              ]}
            >
              <View style={s.inputIcon}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="#F97316"
                />
              </View>

              <TextInput
                style={s.input}
                placeholder="ornek@email.com"
                placeholderTextColor="#A8AFBA"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setHata('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* ŞİFRE */}

            <Text style={s.inputLabel}>Şifre</Text>

            <View
              style={[
                s.inputContainer,
                sifre.length > 0 && s.inputActive,
              ]}
            >
              <View style={s.inputIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#F97316"
                />
              </View>

              <TextInput
                style={s.input}
                placeholder="En az 6 karakter"
                placeholderTextColor="#A8AFBA"
                value={sifre}
                onChangeText={text => {
                  setSifre(text);
                  setHata('');
                }}
                secureTextEntry={!sifreGoster}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={s.eyeButton}
                onPress={() => setSifreGoster(prev => !prev)}
              >
                <Ionicons
                  name={
                    sifreGoster
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={19}
                  color="#98A2B3"
                />
              </TouchableOpacity>
            </View>

            {/* ŞİFRE SEVİYESİ */}

            {sifre.length > 0 && (
              <View style={s.passwordArea}>
                <View style={s.passwordBars}>
                  <View
                    style={[
                      s.passwordBar,
                      {
                        backgroundColor:
                          sifre.length >= 1
                            ? '#F97316'
                            : '#E5E7EB',
                      },
                    ]}
                  />

                  <View
                    style={[
                      s.passwordBar,
                      {
                        backgroundColor:
                          sifreOrta || sifreGuclu
                            ? '#F59E0B'
                            : '#E5E7EB',
                      },
                    ]}
                  />

                  <View
                    style={[
                      s.passwordBar,
                      {
                        backgroundColor:
                          sifreGuclu
                            ? '#18A66A'
                            : '#E5E7EB',
                      },
                    ]}
                  />
                </View>

                <Text
                  style={[
                    s.passwordText,
                    {
                      color: sifreGuclu
                        ? '#13845B'
                        : sifreOrta
                        ? '#B76C17'
                        : '#C2410C',
                    },
                  ]}
                >
                  {sifreGuclu
                    ? 'Güçlü şifre'
                    : sifreOrta
                    ? 'Orta seviye'
                    : 'En az 6 karakter gerekli'}
                </Text>
              </View>
            )}

            {/* ÖĞRENİM DURUMU */}

            <View style={s.educationHeader}>
              <View>
                <Text style={s.inputLabelNoMargin}>
                  Öğrenim Durumu
                </Text>
                <Text style={s.educationHelp}>
                  Şu an hangi sınıftasın?
                </Text>
              </View>

              <View style={s.educationIcon}>
                <Ionicons
                  name="school-outline"
                  size={17}
                  color="#F97316"
                />
              </View>
            </View>

            <View style={s.educationGrid}>
              {OGRENIM_DURUMLARI.map(item => {
                const secili = ogrenimDurumu === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.85}
                    style={[
                      s.educationCard,
                      secili && s.educationCardSelected,
                    ]}
                    onPress={() => {
                      setOgrenimDurumu(item.id);
                      setHata('');
                    }}
                  >
                    <View
                      style={[
                        s.educationRadio,
                        secili && s.educationRadioSelected,
                      ]}
                    >
                      {secili && (
                        <View style={s.educationRadioDot} />
                      )}
                    </View>

                    <Text
                      style={[
                        s.educationTitle,
                        secili && s.educationTitleSelected,
                      ]}
                    >
                      {item.baslik}
                    </Text>

                    <Text style={s.educationSub}>
                      {item.aciklama}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {yksIcinUygunDegil && (
              <View style={s.eligibilityBox}>
                <View style={s.eligibilityIcon}>
                  <Ionicons
                    name="information-circle-outline"
                    size={19}
                    color="#B45309"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.eligibilityTitle}>
                    Bu sürüm henüz senin için uygun değil
                  </Text>

                  <Text style={s.eligibilityText}>
                    Eğitim Koçum, şu anda yalnızca YKS’ye aktif olarak
                    hazırlanan 12. sınıf ve mezun öğrencilere destek olmak
                    amacıyla hazırlanmıştır.
                  </Text>
                </View>
              </View>
            )}

            {/* HATA */}

            {hata ? (
              <View style={s.errorBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={17}
                  color="#C24141"
                />

                <Text style={s.errorText}>
                  {hata}
                </Text>
              </View>
            ) : null}

            {/* KAYIT BUTONU */}

            <TouchableOpacity
              style={[
                s.registerButton,
                yksIcinUygunDegil && s.registerButtonDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleKayit}
              disabled={yksIcinUygunDegil}
            >
              <Text style={s.registerText}>
                Kayıt Ol
              </Text>

              <View style={s.registerArrow}>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#F97316"
                />
              </View>
            </TouchableOpacity>

            {/* LOGIN */}

            <View style={s.loginArea}>
              <Text style={s.loginQuestion}>
                Zaten bir hesabın var mı?
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Giris')}
              >
                <Text style={s.loginText}>
                  Giriş Yap
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ALT BİLGİ */}

          <View style={s.infoCard}>
            <View style={s.infoIcon}>
              <Ionicons
                name="sparkles-outline"
                size={19}
                color="#4776E6"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={s.infoTitle}>
                Sana özel hazırlanacak
              </Text>

              <Text style={s.infoText}>
                Sınıfın, alanın, seviyen, çalışma stilin ve kullandığın
                kaynaklara göre kişiselleştirilmiş bir program oluşturacağız.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 35,
  },

  topArea: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 28,
  },

  logoIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#FFF1E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 11,
  },

  logoText: {
    color: '#202939',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  logoSub: {
    color: '#98A2B3',
    fontSize: 10,
    marginTop: 5,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0EFED',

    shadowColor: '#25324B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },

  formHeader: {
    marginBottom: 22,
  },

  miniLabel: {
    color: '#F97316',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  title: {
    color: '#202939',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 5,
  },

  description: {
    color: '#667085',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
    maxWidth: '95%',
  },

  inputLabel: {
    color: '#344054',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 7,
    marginLeft: 3,
  },

  inputLabelNoMargin: {
    color: '#344054',
    fontSize: 10,
    fontWeight: '800',
  },

  inputContainer: {
    width: '100%',
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDECEA',
    paddingHorizontal: 11,
    marginBottom: 16,
  },

  inputActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FBC49E',
  },

  inputIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#FFF1E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    color: '#202939',
    fontSize: 13,
    marginLeft: 10,
    paddingVertical: 0,
  },

  eyeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  passwordArea: {
    marginTop: -7,
    marginBottom: 16,
  },

  passwordBars: {
    flexDirection: 'row',
    gap: 5,
  },

  passwordBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },

  passwordText: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 5,
  },

  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 10,
  },

  educationHelp: {
    color: '#98A2B3',
    fontSize: 9,
    marginTop: 3,
  },

  educationIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#FFF1E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  educationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },

  educationCard: {
    width: '48.5%',
    minHeight: 72,
    borderRadius: 15,
    backgroundColor: '#FAFAF9',
    borderWidth: 1,
    borderColor: '#EDECEA',
    paddingHorizontal: 11,
    paddingVertical: 10,
    position: 'relative',
  },

  educationCardSelected: {
    backgroundColor: '#FFF8F3',
    borderColor: '#F97316',
  },

  educationRadio: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  educationRadioSelected: {
    borderColor: '#F97316',
  },

  educationRadioDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F97316',
  },

  educationTitle: {
    color: '#344054',
    fontSize: 11,
    fontWeight: '900',
    paddingRight: 22,
  },

  educationTitleSelected: {
    color: '#F97316',
  },

  educationSub: {
    color: '#98A2B3',
    fontSize: 8,
    marginTop: 5,
  },

  eligibilityBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 15,
    padding: 12,
    marginBottom: 16,
  },

  eligibilityIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  eligibilityTitle: {
    color: '#9A3412',
    fontSize: 10,
    fontWeight: '900',
  },

  eligibilityText: {
    color: '#B45309',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FFF0F0',
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },

  errorText: {
    flex: 1,
    color: '#C24141',
    fontSize: 10,
    fontWeight: '600',
  },

  registerButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: '#F97316',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    position: 'relative',
  },

  registerButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },

  registerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  registerArrow: {
    position: 'absolute',
    right: 9,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    gap: 5,
  },

  loginQuestion: {
    color: '#98A2B3',
    fontSize: 10,
  },

  loginText: {
    color: '#F97316',
    fontSize: 10,
    fontWeight: '900',
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF3FF',
    borderRadius: 20,
    padding: 15,
    marginTop: 14,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  infoTitle: {
    color: '#202939',
    fontSize: 11,
    fontWeight: '900',
  },

  infoText: {
    color: '#667085',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },
});
