import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      className='w-80 h-12 bg-blue-600 rounded-lg justify-center items-center'
      onPress={onPress}
    >
      <Text className='text-white text-lg font-bold'>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
