import React from 'react';
import { ActivityIndicator } from 'react-native';

const ILoader = ({ size, color }) => {
  return (
    <ActivityIndicator size={size} color={color} />
  );
};

export default ILoader;