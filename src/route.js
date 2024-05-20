import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {Badge} from 'react-native-paper';
import Login from './Screens/AuthScreens/Login';
import Register from './Screens/AuthScreens/Register';
import SavedJobScreen from './Screens/HomeScreens/SavedJobScreen';
import {NavigationDrawerStructure} from './Componens/Nav/NavDrawer';
import {Iconviewcomponent} from './Componens/Icontag';
import Color from './Global/Color';
import HomeScreen from './Screens/HomeScreens/HomeScreen';
import ProfileScreen from './Screens/Profile/ProfileScreen';
import SearchScreen from './Screens/HomeScreens/Search/SearchScreen';
import SearchDataList from './Screens/HomeScreens/Search/SearchDataList';
import JobList from './Screens/JobPosted/JobList';
import JobApplicants from './Screens/JobPosted/JobApplicants';
import RecentJobList from './Screens/HomeScreens/RecentJobList';
import BuySubscriptions from './Screens/BuySubscriptions';
import PromoteJob from './Screens/SideMenu/PromoteJob';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          headerTitle: '',
          headerTitleStyle: {color: Color.white},
          headerStyle: {backgroundColor: Color.primary, elevation: 0},
          headerLeft: () => (
            <NavigationDrawerStructure navigation={navigation} home={true} />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{right: 10}}
              onPress={() => {
                navigation.navigate('Notification');
              }}>
              <Badge
                badgeStyle={{
                  backgroundColor: Color.red,
                }}
                style={{position: 'absolute', zIndex: 1, top: -5, right: -5}}>
                {0}
              </Badge>
              <Iconviewcomponent
                Icontag={'Ionicons'}
                iconname={'notifications'}
                icon_size={26}
                icon_color={Color.white}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="RecentJob"
        component={RecentJobList}
        options={({navigation, route}) => ({
          headerTitle: 'Job Details',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: Color.white},
          headerStyle: {backgroundColor: Color.primary},
          headerLeft: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon
                name="arrow-back"
                size={30}
                color={Color.white}
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="BuySubscriptions"
        component={BuySubscriptions}
        options={({navigation, route}) => ({
          headerTitle: 'Buy Subscriptions',
          headerTitleStyle: {color: Color.black},
          headerStyle: {backgroundColor: Color.white},
          headerLeft: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon
                name="arrow-back"
                size={30}
                color={Color.black}
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="PromoteJob"
        component={PromoteJob}
        options={({navigation, route}) => ({
          headerTitle: 'Promote Your Job',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: Color.white},
          headerStyle: {backgroundColor: Color.primary},
          headerLeft: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon
                name="arrow-back"
                size={30}
                color={Color.white}
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export const SearchStack = () => {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={({navigation, route}) => ({
          headerTitle: '',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: Color.black},
          headerStyle: {backgroundColor: Color.white},
          headerLeft: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon
                name="arrow-back"
                size={30}
                color={Color.black}
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="SearchDataList"
        component={SearchDataList}
        options={({navigation, route}) => ({
          headerTitle: '',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: Color.black},
          headerStyle: {backgroundColor: Color.white},
          headerLeft: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon
                name="arrow-back"
                size={30}
                color={Color.black}
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export const SavedJobStack = () => {
  return (
    <Stack.Navigator initialRouteName="Saved">
      <Stack.Screen
        name="Saved"
        component={SavedJobScreen}
        options={({navigation, route}) => ({
          headerTitle: 'Saved Candidates',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: Color.black},
          headerStyle: {backgroundColor: Color.white},
          headerLeft: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon
                name="arrow-back"
                size={30}
                color={Color.black}
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export const JobPostStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Job"
        component={JobList}
        options={({navigation}) => ({
          headerTitle: 'Jobs',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: Color.black},
          headerStyle: {backgroundColor: Color.white},
          headerLeft: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon
                name="arrow-back"
                size={30}
                color={Color.black}
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="JobApplicants"
        component={JobApplicants}
        options={({navigation, route}) => ({
          headerTitle: route?.params?.item?.job_role,
          headerTitleStyle: {color: Color.white},
          headerStyle: {backgroundColor: Color.primary},
          headerLeft: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon
                name="arrow-back"
                size={30}
                color={Color.white}
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
          headerRight: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon name="list" size={30} color={Color.white} />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="profile"
        component={ProfileScreen}
        options={({navigation}) => ({
          headerTitle: '',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: Color.black},
          headerStyle: {backgroundColor: Color.white},
          headerLeft: () => (
            <View style={{marginHorizontal: 10}}>
              <Icon
                name="arrow-back"
                size={30}
                color={Color.black}
                onPress={() => navigation.goBack()}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export const Auth = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route?.name === 'HomeTab') {
            return focused ? (
              <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name={'home'} size={25} color={Color.primary} />
                </View>
                {/* <Text
                  style={{
                    fontSize: 12,
                    color: focused ? Color.primary : Color.black,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    borderRadius: 50,
                  }}>
                  Home
                </Text> */}
              </View>
            ) : (
              <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                <Icon name={'home'} size={25} color={color} />
                {/* <Text
                  style={{
                    fontSize: 12,
                    marginBottom: -5,
                    color: focused ? '#8C193F' : '#000',
                  }}>
                  Home
                </Text> */}
              </View>
            );
          } else if (route?.name === 'SearchTab') {
            return focused ? (
              <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Iconviewcomponent
                    Icontag={'MaterialIcons'}
                    iconname={'person-search'}
                    icon_size={25}
                    icon_color={Color.primary}
                  />
                </View>
                {/* <Text
                  style={{
                    fontSize: 12,
                    color: focused ? Color.primary : Color.black,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    borderRadius: 50,
                  }}>
                  Applied Jobs
                </Text> */}
              </View>
            ) : (
              <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                <Iconviewcomponent
                  Icontag={'MaterialIcons'}
                  iconname={'person-search'}
                  icon_size={25}
                  icon_color={Color}
                />
                {/* <Text
                  style={{
                    fontSize: 12,
                    marginBottom: -5,
                    color: focused ? Color.primary : Color.black,
                  }}>
                  Applied Jobs
                </Text> */}
              </View>
            );
          } else if (route?.name === 'SavedJobsTab') {
            return focused ? (
              <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Iconviewcomponent
                    Icontag={'Ionicons'}
                    iconname={'bookmark'}
                    icon_size={25}
                    icon_color={Color.primary}
                  />
                </View>
                {/* <Text
                  style={{
                    fontSize: 12,
                    color: focused ? Color.primary : Color.black,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    borderRadius: 50,
                  }}>
                  Saved Jobs
                </Text> */}
              </View>
            ) : (
              <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                <Iconviewcomponent
                  Icontag={'Ionicons'}
                  iconname={'bookmark'}
                  icon_size={25}
                  icon_color={Color}
                />
                {/* <Text
                  style={{
                    fontSize: 12,
                    marginBottom: -5,
                    color: focused ? Color.primary : Color.black,
                  }}>
                  Saved Jobs
                </Text> */}
              </View>
            );
          } else if (route?.name === 'JobPostTab') {
            return focused ? (
              <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Iconviewcomponent
                    Icontag={'FontAwesome'}
                    iconname={'briefcase'}
                    icon_size={25}
                    icon_color={Color.primary}
                  />
                </View>
                {/* <Text
                  style={{
                    fontSize: 12,
                    color: focused ? Color.primary : Color.black,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    borderRadius: 50,
                  }}>
                  Profile
                </Text> */}
              </View>
            ) : (
              <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                <Iconviewcomponent
                  Icontag={'FontAwesome'}
                  iconname={'briefcase'}
                  icon_size={25}
                  icon_color={Color}
                />
                {/* <Text
                  style={{
                    fontSize: 12,
                    marginBottom: -5,
                    color: focused ? Color.primary : Color.black,
                  }}>
                  Profile
                </Text> */}
              </View>
            );
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Color.primary,
        tabBarInactiveTintColor: Color.smokeyGrey,
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="SavedJobsTab"
        component={SavedJobStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="JobPostTab"
        component={JobPostStack}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
