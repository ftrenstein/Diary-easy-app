import React from 'react';
import { View } from 'react-native';

import Diary from '../assets/images/diarylogo.svg';
import Diarylock from '../assets/images/diarylock.svg';
import CustomButton from '../components/CustomButton';
import { navigate } from 'expo-router/build/global-state/routing';

const LoginScreen = () => {
  return (
    <View className='flex-1 w-full overflow-hidden bg-white'>
      <View className='absolute top-28 left-20 w-44 h-12'>
        <Diary className='absolute top-0.5 left-12' width={130} height={46} />
      </View>
      <CustomButton title='Login' />
      <Diarylock className='absolute top-52 left-10' width={282} height={282} />
    </View>
  );
};

export default LoginScreen;
