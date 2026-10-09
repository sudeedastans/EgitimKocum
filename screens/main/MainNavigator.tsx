import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import AnaSayfaEkrani from './AnaSayfaEkrani';
import RaporlarNavigator from './RaporlarNavigator';
import AIEkrani from './AIEkrani';
import ProgramEkrani from './ProgramEkrani';
import ProfilEkrani from './ProfilEkrani';

import {
  PROGRAM,
  type HaftalikProgram,
} from '../../data/programData';

const Tab = createBottomTabNavigator();

export default function MainNavigator({ route }: any) {
  const adSoyad =
    route?.params?.adSoyad ?? 'Öğrenci';

  const secimler =
    route?.params?.secimler;

  const [program, setProgram] =
    useState<HaftalikProgram>(PROGRAM);

  const iconGetir = (name: string) => {
    const icons: Record<string, string> = {
      AnaSayfa: 'home',
      Raporlar: 'stats-chart',
      AI: 'sparkles',
      Program: 'calendar',
      Profil: 'person',
    };

    return icons[name] ?? 'ellipse';
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: '#F97316',
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarIcon: ({ focused }) => {
          const ikon = iconGetir(
            route.name
          );

          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: focused
                  ? 'rgba(255,255,255,0.25)'
                  : 'transparent',
              }}
            >
              <Ionicons
                name={
                  (
                    focused
                      ? ikon
                      : `${ikon}-outline`
                  ) as any
                }
                size={24}
                color="#FFF"
              />
            </View>
          );
        },
      })}
    >
      {/* ANA SAYFA */}

      <Tab.Screen
        name="AnaSayfa"
        initialParams={{
          adSoyad,
          secimler,
        }}
      >
        {props => (
          <AnaSayfaEkrani
            {...props}
            program={program}
            setProgram={setProgram}
          />
        )}
      </Tab.Screen>

      {/* RAPORLAR */}

     <Tab.Screen
  name="Raporlar"
  initialParams={{
    adSoyad,
    secimler,
  }}
>
  {props => (
    <RaporlarNavigator
      {...props}
      program={program}
    />
  )}
</Tab.Screen>

      {/* AI KOÇ */}

      <Tab.Screen
        name="AI"
        component={AIEkrani}
        initialParams={{
          adSoyad,
          secimler,
        }}
      />

      {/* PROGRAM */}

      <Tab.Screen name="Program">
        {props => (
          <ProgramEkrani
            {...props}
            program={program}
            setProgram={setProgram}
          />
        )}
      </Tab.Screen>

      {/* PROFİL */}

      <Tab.Screen
        name="Profil"
        initialParams={{
          adSoyad,
          secimler,
        }}
      >
        {props => (
          <ProfilEkrani
            {...props}
            program={program}
            setProgram={setProgram}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}