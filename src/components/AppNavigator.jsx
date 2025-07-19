import React from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AddWorkOrderScreen from '../view/AddWorkOrderScreen';
import WorkOrdersScreen from '../view/WorkOrdersScreen';
import ProfileScreen from '../view/ProfileScreen';

const Tab = createBottomTabNavigator();

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={styles.customButton}
  >
    {children}
  </TouchableOpacity>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
        tabBarIcon: ({ focused }) => {
          const scaleAnim = new Animated.Value(focused ? 1.2 : 1);

          Animated.spring(scaleAnim, {
            toValue: focused ? 1.3 : 1,
            useNativeDriver: true,
          }).start();

          let iconName;
          if (route.name === 'WorkOrdersScreen') iconName = 'home-outline';
          else if (route.name === 'Add') iconName = 'add-circle-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return (
            <AnimatedIcon
              name={iconName}
              size={28}
              color={focused ? '#007BFF' : '#888'}
              style={{ transform: [{ scale: scaleAnim }] }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="WorkOrdersScreen" component={WorkOrdersScreen} />
      <Tab.Screen name="Add" component={AddWorkOrderScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  customButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
});
