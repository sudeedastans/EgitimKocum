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
  Alert,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type Mod = 'secim' | 'giris';
type KullaniciTipi = 'ogrenci' | 'veli';

export default function GirisEkrani({ navigation }: any) {
  const { height } = useWindowDimensions();

  const [mod, setMod] = useState<Mod>('secim');
  const [kullaniciTipi, setKullaniciTipi] =
    useState<KullaniciTipi>('ogrenci');

  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);

  const girisFormunuAc = (tip: KullaniciTipi) => {
    setKullaniciTipi(tip);
    setHata('');
    setEmail('');
    setSifre('');
    setMod('giris');
  };

  const handleGiris = () => {
    setHata('');

    if (!email.trim()) {
      setHata('Lütfen e-posta adresinizi girin.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setHata('Geçerli bir e-posta adresi girin.');
      return;
    }

    if (sifre.length < 6) {
      setHata('Şifreniz en az 6 karakter olmalı.');
      return;
    }

    /*
      ŞİMDİLİK DEMO GİRİŞİ:

      Backend/Auth bağlandığında burada kullanıcının rolü de
      kontrol edilecek: "ogrenci" veya "veli".

      Veli panelini henüz ayrı navigator olarak oluşturmadıysak
      mevcut Main ekranına rol bilgisi gönderiyoruz.
    */

    navigation.replace('Main', {
      kullaniciTipi,
    });
  };

  const sifremiUnuttum = () => {
    if (!email.trim()) {
      Alert.alert(
        'Şifremi Unuttum',
        'Şifre sıfırlama bağlantısı gönderebilmemiz için önce e-posta adresinizi yazın.'
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert(
        'Geçersiz E-posta',
        'Lütfen geçerli bir e-posta adresi girin.'
      );
      return;
    }

    Alert.alert(
      'Şifre Sıfırlama',
      `Şifre sıfırlama bağlantısı ${email.trim()} adresine gönderilecek.`
    );
  };

  const girisBaslik =
    kullaniciTipi === 'veli'
      ? 'Veli girişi'
      : 'Öğrenci girişi';

  const girisAciklama =
    kullaniciTipi === 'veli'
      ? 'Öğrencinizin ilerlemesini ve çalışma sürecini takip etmek için hesabınıza giriş yapın.'
      : 'Programına ve gelişim verilerine kaldığın yerden devam et.';

  return (
    <SafeAreaView
      style={[
        s.container,
        Platform.OS === 'web' && { height },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={s.scrollView}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO */}

          <View style={s.logoArea}>
            <View style={s.logoIcon}>
              <Ionicons
                name="school-outline"
                size={27}
                color="#F97316"
              />
            </View>

            <Text style={s.logoText}>
              EĞİTİM KOÇUM
            </Text>

            <Text style={s.logoSub}>
              YKS yolculuğunda yanında
            </Text>
          </View>

          {/* KARŞILAMA / GİRİŞ TİPİ SEÇİMİ */}

          {mod === 'secim' && (
            <>
              <View style={s.heroCard}>
                <View style={s.heroMiniBadge}>
                  <Ionicons
                    name="sparkles"
                    size={13}
                    color="#F97316"
                  />

                  <Text style={s.heroMiniText}>
                    KİŞİSEL ÇALIŞMA KOÇUN
                  </Text>
                </View>

                <Text style={s.heroTitle}>
                  Hedefe giden yolu birlikte planlayalım.
                </Text>

                <Text style={s.heroDescription}>
                  Öğrenciler için kişiselleştirilmiş çalışma programı,
                  veliler için gelişim ve süreç takibi.
                </Text>

                <View style={s.features}>
                  <Feature
                    icon="calendar-outline"
                    title="Kişisel Program"
                    text="Öğrenciye özel haftalık çalışma planı"
                  />

                  <Feature
                    icon="analytics-outline"
                    title="Gelişim Takibi"
                    text="İlerleme, görevler ve eksik konular"
                  />

                  <Feature
                    icon="sparkles-outline"
                    title="AI Koç"
                    text="İhtiyaca göre kişiselleştirilmiş destek"
                  />
                </View>
              </View>

              {/* ÖĞRENCİ GİRİŞİ */}

              <TouchableOpacity
                style={s.loginChoice}
                activeOpacity={0.85}
                onPress={() => girisFormunuAc('ogrenci')}
              >
                <View style={s.studentChoiceIcon}>
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color="#F97316"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.choiceTitle}>
                    Öğrenci Girişi
                  </Text>

                  <Text style={s.choiceText}>
                    Programını, görevlerini ve gelişimini takip et
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color="#98A2B3"
                />
              </TouchableOpacity>

              {/* VELİ GİRİŞİ */}

              <TouchableOpacity
                style={s.loginChoice}
                activeOpacity={0.85}
                onPress={() => girisFormunuAc('veli')}
              >
                <View style={s.parentChoiceIcon}>
                  <Ionicons
                    name="people-outline"
                    size={22}
                    color="#4776E6"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.choiceTitle}>
                    Veli Girişi
                  </Text>

                  <Text style={s.choiceText}>
                    Öğrencinizin çalışma sürecini ve ilerlemesini görün
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color="#98A2B3"
                />
              </TouchableOpacity>

              {/* KAYIT */}

              <TouchableOpacity
                style={s.registerButton}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Kayit')}
              >
                <Ionicons
                  name="person-add-outline"
                  size={17}
                  color="#F97316"
                />

                <Text style={s.registerButtonText}>
                  Yeni Öğrenci Hesabı Oluştur
                </Text>
              </TouchableOpacity>

              <View style={s.infoCard}>
                <View style={s.infoIcon}>
                  <Ionicons
                    name="school-outline"
                    size={18}
                    color="#4776E6"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.infoTitle}>
                    YKS öğrencileri için
                  </Text>

                  <Text style={s.infoText}>
                    Eğitim Koçum şu anda 12. sınıf ve mezun YKS
                    öğrencilerine yönelik hazırlanmıştır.
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* GİRİŞ FORMU */}

          {mod === 'giris' && (
            <>
              <TouchableOpacity
                style={s.backButton}
                onPress={() => {
                  setMod('secim');
                  setHata('');
                }}
              >
                <Ionicons
                  name="chevron-back"
                  size={17}
                  color="#667085"
                />

                <Text style={s.backButtonText}>
                  Geri
                </Text>
              </TouchableOpacity>

              <View style={s.formCard}>
                <View style={s.formHeader}>
                  <View
                    style={[
                      s.roleBadge,
                      kullaniciTipi === 'veli' && s.parentRoleBadge,
                    ]}
                  >
                    <Ionicons
                      name={
                        kullaniciTipi === 'veli'
                          ? 'people-outline'
                          : 'person-outline'
                      }
                      size={14}
                      color={
                        kullaniciTipi === 'veli'
                          ? '#4776E6'
                          : '#F97316'
                      }
                    />

                    <Text
                      style={[
                        s.roleBadgeText,
                        kullaniciTipi === 'veli' &&
                          s.parentRoleBadgeText,
                      ]}
                    >
                      {kullaniciTipi === 'veli'
                        ? 'VELİ'
                        : 'ÖĞRENCİ'}
                    </Text>
                  </View>

                  <Text style={s.title}>
                    {girisBaslik} 👋
                  </Text>

                  <Text style={s.description}>
                    {girisAciklama}
                  </Text>
                </View>

                {/* EMAIL */}

                <Text style={s.inputLabel}>
                  E-posta
                </Text>

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

                {/* PASSWORD */}

                <View style={s.passwordTitleRow}>
                  <Text style={s.inputLabelNoMargin}>
                    Şifre
                  </Text>

                  <TouchableOpacity onPress={sifremiUnuttum}>
                    <Text style={s.forgotText}>
                      Şifremi unuttum
                    </Text>
                  </TouchableOpacity>
                </View>

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
                    placeholder="Şifrenizi girin"
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
                    onPress={() =>
                      setSifreGoster(prev => !prev)
                    }
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

                {/* ERROR */}

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

                {/* LOGIN BUTTON */}

                <TouchableOpacity
                  style={[
                    s.mainButton,
                    kullaniciTipi === 'veli' && s.parentMainButton,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleGiris}
                >
                  <Text style={s.mainButtonText}>
                    {kullaniciTipi === 'veli'
                      ? 'Veli Olarak Giriş Yap'
                      : 'Giriş Yap'}
                  </Text>

                  <View style={s.mainButtonArrow}>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={
                        kullaniciTipi === 'veli'
                          ? '#4776E6'
                          : '#F97316'
                      }
                    />
                  </View>
                </TouchableOpacity>

                {kullaniciTipi === 'ogrenci' ? (
                  <View style={s.registerArea}>
                    <Text style={s.registerQuestion}>
                      Henüz hesabın yok mu?
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Kayit')
                      }
                    >
                      <Text style={s.registerText}>
                        Kayıt Ol
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={s.parentNote}>
                    <Ionicons
                      name="information-circle-outline"
                      size={16}
                      color="#4776E6"
                    />

                    <Text style={s.parentNoteText}>
                      Veli hesabı, öğrencinin hesabıyla eşleştirildikten
                      sonra öğrencinin gelişim bilgilerini görüntüler.
                    </Text>
                  </View>
                )}
              </View>

              <View style={s.securityCard}>
                <View style={s.securityIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={19}
                    color="#18A66A"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.securityTitle}>
                    Hesabın güvende
                  </Text>

                  <Text style={s.securityText}>
                    Giriş bilgileriniz yalnızca hesabınıza erişmek
                    için kullanılır.
                  </Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <View style={s.feature}>
      <View style={s.featureIcon}>
        <Ionicons
          name={icon}
          size={18}
          color="#F97316"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={s.featureTitle}>
          {title}
        </Text>

        <Text style={s.featureText}>
          {text}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#F8F7F4',
  },

  scrollView: {
    flex: 1,
    minHeight: 0,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 60,
  },

  logoArea: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 32,
  },

  logoIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#FFF1E7',
    alignItems: 'center',
    justifyContent: 'center',
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

  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 27,
    padding: 21,
    borderWidth: 1,
    borderColor: '#F0EFED',
    marginBottom: 14,

    shadowColor: '#25324B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },

  heroMiniBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFF1E7',
    marginBottom: 15,
  },

  heroMiniText: {
    color: '#F97316',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  heroTitle: {
    color: '#202939',
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
    maxWidth: '95%',
  },

  heroDescription: {
    color: '#667085',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 10,
  },

  features: {
    marginTop: 24,
    gap: 10,
  },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
    borderRadius: 15,
    padding: 11,
  },

  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF1E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  featureTitle: {
    color: '#344054',
    fontSize: 10,
    fontWeight: '900',
  },

  featureText: {
    color: '#98A2B3',
    fontSize: 8,
    marginTop: 2,
  },

  loginChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0EFED',
    borderRadius: 18,
    padding: 14,
    marginBottom: 9,
  },

  studentChoiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF1E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  parentChoiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  choiceTitle: {
    color: '#202939',
    fontSize: 12,
    fontWeight: '900',
  },

  choiceText: {
    color: '#98A2B3',
    fontSize: 8.5,
    marginTop: 3,
    lineHeight: 13,
  },

  registerButton: {
    height: 51,
    borderRadius: 17,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0EFED',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },

  registerButtonText: {
    color: '#F97316',
    fontSize: 10.5,
    fontWeight: '900',
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF3FF',
    borderRadius: 19,
    padding: 14,
    marginTop: 14,
  },

  infoIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoTitle: {
    color: '#202939',
    fontSize: 10,
    fontWeight: '900',
  },

  infoText: {
    color: '#667085',
    fontSize: 8,
    lineHeight: 13,
    marginTop: 3,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
    marginBottom: 11,
    paddingVertical: 5,
  },

  backButtonText: {
    color: '#667085',
    fontSize: 10,
    fontWeight: '800',
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
    marginBottom: 23,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF1E7',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginBottom: 9,
  },

  parentRoleBadge: {
    backgroundColor: '#EEF3FF',
  },

  roleBadgeText: {
    color: '#F97316',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  parentRoleBadgeText: {
    color: '#4776E6',
  },

  title: {
    color: '#202939',
    fontSize: 25,
    fontWeight: '900',
  },

  description: {
    color: '#667085',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
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

  passwordTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
    paddingHorizontal: 3,
  },

  forgotText: {
    color: '#F97316',
    fontSize: 9,
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
    borderColor: '#FBC49E',
    backgroundColor: '#FFFFFF',
  },

  inputIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#FFF1E7',
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
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

  mainButton: {
    height: 55,
    borderRadius: 17,
    backgroundColor: '#F97316',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  parentMainButton: {
    backgroundColor: '#4776E6',
  },

  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  mainButtonArrow: {
    position: 'absolute',
    right: 9,
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 18,
  },

  registerQuestion: {
    color: '#98A2B3',
    fontSize: 10,
  },

  registerText: {
    color: '#F97316',
    fontSize: 10,
    fontWeight: '900',
  },

  parentNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: '#EEF3FF',
    borderRadius: 13,
    padding: 10,
    marginTop: 15,
  },

  parentNoteText: {
    flex: 1,
    color: '#667085',
    fontSize: 8.5,
    lineHeight: 13,
  },

  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF8F1',
    borderRadius: 19,
    padding: 14,
    marginTop: 14,
  },

  securityIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  securityTitle: {
    color: '#202939',
    fontSize: 10,
    fontWeight: '900',
  },

  securityText: {
    color: '#667085',
    fontSize: 8,
    lineHeight: 13,
    marginTop: 3,
  },
});
