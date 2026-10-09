import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import RaporlarEkrani from './RaporlarEkrani';
import TumDenemelerEkrani from './TumDenemelerEkrani';
import DenemeAnalizEkrani from './DenemeAnalizEkrani';
import DenemeEkleEkrani from './DenemeEkleEkrani';

import {
  type HaftalikProgram,
} from '../../data/programData';

type RaporlarStackParamList = {
  RaporlarAna:
    | {
        adSoyad?: string;
        secimler?: any;
      }
    | undefined;

  TumDenemeler:
    undefined;

  DenemeEkle:
    undefined;

  DenemeAnaliz: {
    
    denemeId: string;
  };
};

const Stack =
  createNativeStackNavigator<RaporlarStackParamList>();

type Props = {
  route: any;
  program:
    HaftalikProgram;
};

const storageIdOlustur = (
  deger: unknown
) => {
  const metin =
    String(
      deger ??
        'ogrenci'
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

  return metin ||
    'ogrenci';
};

export default function RaporlarNavigator({
  route,
  program,
}: Props) {
  const adSoyad =
    route?.params
      ?.adSoyad ??
    'Öğrenci';

  const secimler =
    route?.params
      ?.secimler;


  const storageUserKey =
    storageIdOlustur(
      route?.params?.userId ??
      route?.params?.email ??
      route?.params?.secimler?.email ??
      adSoyad
    );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="RaporlarAna"
        initialParams={{
          adSoyad,
          secimler,
          storageUserKey,
        }}
      >
        {props => (
          <RaporlarEkrani
            {...props}
            program={program}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="TumDenemeler"
        initialParams={{
          storageUserKey,
        }}
        component={
          TumDenemelerEkrani
        }
      />

      <Stack.Screen
        name="DenemeEkle"
        initialParams={{
          storageUserKey,
        }}
        component={
          DenemeEkleEkrani
        }
      />

      <Stack.Screen
        name="DenemeAnaliz"
        initialParams={{
          storageUserKey,
          denemeId: '',
        }}
        component={
          DenemeAnalizEkrani
        }
      />
    </Stack.Navigator>
  );
}