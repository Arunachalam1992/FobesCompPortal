import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Image,
  ScrollView,
} from 'react-native';
import Color from '../../Global/Color';
import { Gilmer } from '../../Global/FontFamily';
import { ActivityIndicator, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import FeIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { Media } from '../../Global/Media';
import { TabView, TabBar } from 'react-native-tab-view';
import moment from 'moment';
import common_fn from '../../Config/common_fn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserData } from '../../Redux';
import { useDispatch, useSelector } from 'react-redux';
import fetchData from '../../Config/fetchData';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { base_image_url } from '../../Config/base_url';
import { SafeAreaView } from 'react-native';
import PrimeModal from '../../Componens/PrimeModal';

const All = ({ navigation, token, index }) => {
  const [acticityData, setActivityData] = useState([]);
  const [SearchendReached, setSearchEndReached] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    setActivityLoading(true);
    getActivityData()
      .then(() => setActivityLoading(false))
      .catch(error => {
        console.log('Error fetching data:', error);
        setActivityLoading(false);
      });
  }, [token, index]);

  const getActivityData = useCallback(async () => {
    try {
      var activity_data = ``;
      const company_activity = await fetchData.company_activity(
        activity_data,
        token,
      );
      setActivityData(company_activity?.data);
    } catch (error) {
      console.log('error', error);
    }
  }, [token]);

  const loadMoreData = async () => {
    if (loadMore || endReached) {
      return;
    }
    setLoadMore(true);
    try {
      const nextPage = page + 1;
      var activity_data = `page=${nextPage}`;
      const filterData = await fetchData.company_activity(activity_data, token);
      if (filterData.length > 0) {
        setPage(nextPage);
        const updatedData = [...acticityData, ...filterData];
        setActivityData(updatedData);
      } else {
        setEndReached(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadMore(false);
    }
  };

  const job_profile_view = async id => {
    try {
      var data = {
        candidate_id: id,
      };
      const job_view = await fetchData.company_profile_view(data, token);
      if (job_view?.status == 200) {
        navigation.navigate('candidateDetails', { id: id });
      } else {
        navigation.navigate('BuySubscriptions');
        common_fn.showToast(job_view?.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {activityLoading ? (
        <View style={{ padding: 10 }}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item style={{}}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <FlatList
          data={acticityData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  job_profile_view(item?.candidate_id);
                }}
                key={index}
                style={{
                  marginTop: 10,
                  borderColor: Color.lightgrey,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 5,
                  marginRight: 5,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}>
                {item?.image != null ? (
                  <Image
                    source={{ uri: base_image_url + item?.image }}
                    style={{ width: 70, height: 70, resizeMode: 'contain' }}
                  />
                ) : (
                  <Image
                    source={Media.user}
                    style={{ width: 70, height: 70, resizeMode: 'contain' }}
                  />
                )}
                <View
                  style={{
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '50%',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.black,
                        fontFamily: Gilmer.Bold,
                      }}
                      numberOfLines={1}>
                      {item?.name}{' '}
                    </Text>
                    {item?.applied_job != '' && (
                      <Text
                        style={{
                          fontSize: 16,
                          color: Color.black,
                          fontFamily: Gilmer.Bold,
                        }}
                        numberOfLines={1}>
                        | {item?.applied_job}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: Color.cloudyGrey,
                      fontFamily: Gilmer.Regular,
                    }}
                    numberOfLines={1}>
                    {item?.profession_name}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: Color.cloudyGrey,
                      fontFamily: Gilmer.Medium,
                    }}>
                    {moment(item?.created_at).format('DD MMM YY')}
                  </Text>
                </View>
                {item?.is_called == true && (
                  <FeIcon
                    name="phone-call"
                    size={20}
                    color={'#309CD2'}
                    style={{ padding: 10 }}
                  />
                )}
                {item?.is_mailed == true && (
                  <Icon
                    name="mail"
                    size={20}
                    color={'#309CD2'}
                    style={{ padding: 10 }}
                  />
                )}
                {item?.is_viewed == true && (
                  <MCIcon
                    name="account-search"
                    size={20}
                    color={'#309CD2'}
                    style={{ padding: 10 }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          onEndReached={() => {
            loadMoreData();
          }}
          onEndReachedThreshold={3}
          // ListFooterComponent={() => {
          //   return (
          //     <View style={{alignItems: 'center', justifyContent: 'center'}}>
          //       {loadMore && (
          //         <View style={{flexDirection: 'row', alignItems: 'center'}}>
          //           <Text
          //             style={{
          //               fontSize: 12,
          //               color: Color.black,
          //               marginHorizontal: 10,
          //               fontFamily: Gilmer.Medium,
          //             }}>
          //             Loading...
          //           </Text>
          //           <ActivityIndicator />
          //         </View>
          //       )}
          //     </View>
          //   );
          // }}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 10,
                  width: '100%',
                }}>
                <MCIcon
                  name="account-tie-voice-off"
                  size={30}
                  color={Color.primary}
                />
                <Text
                  style={{
                    fontSize: 14,
                    borderRadius: 5,
                    color: Color.primary,
                    marginVertical: 5,
                    fontFamily: Gilmer.Bold,
                  }}>
                  No Activity
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};
const Called = ({ navigation, token, index }) => {
  const [acticityData, setActivityData] = useState([]);
  const [SearchendReached, setSearchEndReached] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    setActivityLoading(true);
    getActivityData()
      .then(() => setActivityLoading(false))
      .catch(error => {
        console.log('Error fetching data:', error);
        setActivityLoading(false);
      });
  }, [token, index]);

  const getActivityData = useCallback(async () => {
    try {
      var activity_data = `is_called=1`;
      const company_activity = await fetchData.company_activity(
        activity_data,
        token,
      );
      setActivityData(company_activity?.data);
    } catch (error) {
      console.log('error', error);
    }
  }, [token]);

  const loadMoreData = async () => {
    if (loadMore || endReached) {
      return;
    }
    setLoadMore(true);
    try {
      const nextPage = page + 1;
      var activity_data = `is_called=1&page=${nextPage}`;
      const filterData = await fetchData.company_activity(activity_data, token);
      if (filterData.length > 0) {
        setPage(nextPage);
        const updatedData = [...acticityData, ...filterData];
        setActivityData(updatedData);
      } else {
        setEndReached(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadMore(false);
    }
  };

  const job_profile_view = async id => {
    try {
      var data = {
        candidate_id: id,
      };
      const job_view = await fetchData.company_profile_view(data, token);
      if (job_view?.status == 200) {
        navigation.navigate('candidateDetails', { id: id });
      } else {
        navigation.navigate('BuySubscriptions');
        common_fn.showToast(job_view?.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {activityLoading ? (
        <View style={{ padding: 10 }}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item style={{}}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <FlatList
          data={acticityData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  job_profile_view(item?.candidate_id);
                }}
                key={index}
                style={{
                  marginTop: 10,
                  borderColor: Color.lightgrey,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 5,
                  marginRight: 5,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}>
                {item?.image != null ? (
                  <Image
                    source={{ uri: base_image_url + item?.image }}
                    style={{ width: 70, height: 70, resizeMode: 'contain' }}
                  />
                ) : (
                  <Image
                    source={Media.user}
                    style={{ width: 70, height: 70, resizeMode: 'contain' }}
                  />
                )}
                <View
                  style={{
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        // flex: 1,
                        fontSize: 16,
                        color: Color.black,
                        fontFamily: Gilmer.Bold,
                      }}
                      numberOfLines={1}>
                      {item?.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.black,
                        fontFamily: Gilmer.Bold,
                      }}
                      numberOfLines={1}>
                      {item?.applied_job}
                    </Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: Color.cloudyGrey,
                      fontFamily: Gilmer.Regular,
                    }}
                    numberOfLines={1}>
                    {item?.profession_name}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: Color.cloudyGrey,
                      fontFamily: Gilmer.Medium,
                    }}>
                    {moment(item?.created_at).format('DD MMM YY')}
                  </Text>
                </View>
                {item?.is_called == true && (
                  <FeIcon
                    name="phone-call"
                    size={20}
                    color={'#309CD2'}
                    style={{ padding: 10 }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          onEndReached={() => {
            loadMoreData();
          }}
          onEndReachedThreshold={3}
          // ListFooterComponent={() => {
          //   return (
          //     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          //       {loadMore && (
          //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          //           <Text
          //             style={{
          //               fontSize: 12,
          //               color: Color.black,
          //               marginHorizontal: 10,
          //               fontFamily: Gilmer.Medium,
          //             }}>
          //             Loading...
          //           </Text>
          //           <ActivityIndicator />
          //         </View>
          //       )}
          //     </View>
          //   );
          // }}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 10,
                  width: '100%',
                }}>
                <FeIcon name="phone-call" size={25} color={Color.primary} />
                <Text
                  style={{
                    fontSize: 14,
                    borderRadius: 5,
                    color: Color.primary,
                    marginVertical: 5,
                    fontFamily: Gilmer.Bold,
                  }}>
                  No Called
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};
const Viewed = ({ navigation, token, index }) => {
  const [acticityData, setActivityData] = useState([]);
  const [SearchendReached, setSearchEndReached] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    setActivityLoading(true);
    getActivityData()
      .then(() => setActivityLoading(false))
      .catch(error => {
        console.log('Error fetching data:', error);
        setActivityLoading(false);
      });
  }, [token, index]);

  const getActivityData = useCallback(async () => {
    try {
      var activity_data = `is_viewed=1`;
      const company_activity = await fetchData.company_activity(
        activity_data,
        token,
      );
      setActivityData(company_activity?.data);
    } catch (error) {
      console.log('error', error);
    }
  }, [token]);

  const loadMoreData = async () => {
    if (loadMore || endReached) {
      return;
    }
    setLoadMore(true);
    try {
      const nextPage = page + 1;
      var activity_data = `is_viewed=1&page=${nextPage}`;
      const filterData = await fetchData.company_activity(activity_data, token);
      if (filterData.length > 0) {
        setPage(nextPage);
        const updatedData = [...acticityData, ...filterData];
        setActivityData(updatedData);
      } else {
        setEndReached(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadMore(false);
    }
  };

  const job_profile_view = async id => {
    try {
      var data = {
        candidate_id: id,
      };
      const job_view = await fetchData.company_profile_view(data, token);
      if (job_view?.status == 200) {
        navigation.navigate('candidateDetails', { id: id });
      } else {
        navigation.navigate('BuySubscriptions');
        common_fn.showToast(job_view?.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {activityLoading ? (
        <View style={{ padding: 10 }}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item style={{}}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <FlatList
          data={acticityData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  job_profile_view(item?.candidate_id);
                }}
                key={index}
                style={{
                  marginTop: 10,
                  borderColor: Color.lightgrey,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 5,
                  marginRight: 5,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}>
                {item?.image != null ? (
                  <Image
                    source={{ uri: base_image_url + item?.image }}
                    style={{ width: 70, height: 70, resizeMode: 'contain' }}
                  />
                ) : (
                  <Image
                    source={Media.user}
                    style={{ width: 70, height: 70, resizeMode: 'contain' }}
                  />
                )}
                <View
                  style={{
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 16,
                        color: Color.black,
                        fontFamily: Gilmer.Bold,
                      }}
                      numberOfLines={1}>
                      {item?.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.black,
                        fontFamily: Gilmer.Bold,
                      }}
                      numberOfLines={1}>
                      {item?.applied_job}
                    </Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: Color.cloudyGrey,
                      fontFamily: Gilmer.Regular,
                    }}
                    numberOfLines={1}>
                    {item?.profession_name}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: Color.cloudyGrey,
                      fontFamily: Gilmer.Medium,
                    }}>
                    {moment(item?.created_at).format('DD MMM YY')}
                  </Text>
                </View>
                {item?.is_viewed == true && (
                  <MCIcon
                    name="account-search"
                    size={20}
                    color={'#309CD2'}
                    style={{ padding: 10 }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          onEndReached={() => {
            loadMoreData();
          }}
          onEndReachedThreshold={3}
          // ListFooterComponent={() => {
          //   return (
          //     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          //       {loadMore && (
          //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          //           <Text
          //             style={{
          //               fontSize: 12,
          //               color: Color.black,
          //               marginHorizontal: 10,
          //               fontFamily: Gilmer.Medium,
          //             }}>
          //             Loading...
          //           </Text>
          //           <ActivityIndicator />
          //         </View>
          //       )}
          //     </View>
          //   );
          // }}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 10,
                  width: '100%',
                }}>
                <MCIcon
                  name="account-search"
                  size={20}
                  color={Color.primary}
                  style={{ padding: 10 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    borderRadius: 5,
                    color: Color.primary,
                    marginVertical: 5,
                    fontFamily: Gilmer.Bold,
                  }}>
                  No Viewed
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};
const Mailed = ({ navigation, token, index }) => {
  const [acticityData, setActivityData] = useState([]);
  const [SearchendReached, setSearchEndReached] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    setActivityLoading(true);
    getActivityData()
      .then(() => setActivityLoading(false))
      .catch(error => {
        console.log('Error fetching data:', error);
        setActivityLoading(false);
      });
  }, [token, index]);

  const getActivityData = useCallback(async () => {
    try {
      var activity_data = `is_mailed=1`;
      const company_activity = await fetchData.company_activity(
        activity_data,
        token,
      );
      setActivityData(company_activity?.data);
    } catch (error) {
      console.log('error', error);
    }
  }, [token]);

  const loadMoreData = async () => {
    if (loadMore || endReached) {
      return;
    }
    setLoadMore(true);
    try {
      const nextPage = page + 1;
      var activity_data = `is_mailed=1&page=${nextPage}`;
      const filterData = await fetchData.company_activity(activity_data, token);
      if (filterData.length > 0) {
        setPage(nextPage);
        const updatedData = [...acticityData, ...filterData];
        setActivityData(updatedData);
      } else {
        setEndReached(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadMore(false);
    }
  };

  const job_profile_view = async id => {
    try {
      var data = {
        candidate_id: id,
      };
      const job_view = await fetchData.company_profile_view(data, token);
      if (job_view?.status == 200) {
        navigation.navigate('candidateDetails', { id: id });
      } else {
        navigation.navigate('BuySubscriptions');
        common_fn.showToast(job_view?.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {activityLoading ? (
        <View style={{ padding: 10 }}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item style={{}}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <FlatList
          data={acticityData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  job_profile_view(item?.candidate_id);
                }}
                key={index}
                style={{
                  marginTop: 10,
                  borderColor: Color.lightgrey,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 5,
                  marginRight: 5,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}>
                {item?.image != null ? (
                  <Image
                    source={{ uri: base_image_url + item?.image }}
                    style={{ width: 70, height: 70, resizeMode: 'contain' }}
                  />
                ) : (
                  <Image
                    source={Media.user}
                    style={{ width: 70, height: 70, resizeMode: 'contain' }}
                  />
                )}
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: Color.black,
                      fontFamily: Gilmer.Bold,
                    }}
                    numberOfLines={1}>
                    {item?.name}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: Color.cloudyGrey,
                      fontFamily: Gilmer.Regular,
                    }}
                    numberOfLines={1}>
                    {item?.profession_name}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: Color.cloudyGrey,
                      fontFamily: Gilmer.Medium,
                    }}>
                    {moment(item?.created_at).format('DD MMM YY')}
                  </Text>
                </View>
                {item?.is_mailed == true && (
                  <Icon
                    name="mail"
                    size={20}
                    color={'#309CD2'}
                    style={{ padding: 10 }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          onEndReached={() => {
            loadMoreData();
          }}
          onEndReachedThreshold={3}
          // ListFooterComponent={() => {
          //   return (
          //     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          //       {loadMore && (
          //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          //           <Text
          //             style={{
          //               fontSize: 12,
          //               color: Color.black,
          //               marginHorizontal: 10,
          //               fontFamily: Gilmer.Medium,
          //             }}>
          //             Loading...
          //           </Text>
          //           <ActivityIndicator />
          //         </View>
          //       )}
          //     </View>
          //   );
          // }}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 10,
                  width: '100%',
                }}>
                <MCIcon name="account-search" size={25} color={Color.primary} />
                <Text
                  style={{
                    fontSize: 14,
                    borderRadius: 5,
                    color: Color.primary,
                    marginVertical: 5,
                    fontFamily: Gilmer.Bold,
                  }}>
                  No Viewed
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [job_posting, setJobPosting] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [planLimit, setPlanLimit] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const userData = useSelector(state => state.UserReducer.userData);
  var { name, token } = userData;

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'all', title: 'all' },
    { key: 'called', title: 'called' },
    { key: 'viewed', title: 'viewed' },
    { key: 'mailed', title: 'mailed' },
  ]);

  useEffect(() => {
    getUserData();
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      getSingleCompanyData();
    }, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('user_data');
      if (value !== null) {
        dispatch(setUserData(JSON.parse(value)));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getData()
      .then(() => setLoading(false))
      .catch(error => {
        console.log('Error fetching data:', error);
        setLoading(false);
      });
    getCategory_data(``);
  }, [token]);

  useEffect(() => {
    getPlanLimit();
  }, [index, token]);

  const getSingleCompanyData = useCallback(async () => {
    try {
      const single_data = await fetchData.single_company(null, token);
      if (single_data) {
        const combinedData = {
          ...single_data?.data,
          token: token,
        };
        if (combinedData !== userData) {
          dispatch(setUserData(combinedData));
          await AsyncStorage.setItem('user_data', JSON.stringify(combinedData));
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [token]);

  const getData = useCallback(async () => {
    try {
      const company_job = await fetchData.job_applicants(``, token);
      setJobPosting(company_job?.data);
      const category_data = await fetchData.job_Categories_list(``, token);
      setCategoryData([{ id: null, name: 'All Jobs' }, ...category_data?.data]);
    } catch (error) {
      console.log('error', error);
    }
  }, [token, index]);

  const getCategory_data = useCallback(
    async id => {
      try {
        setJobLoading(true);
        const data = id ? `category_id=${id}` : ``;
        const company_job = await fetchData.job_applicants(data, token);
        setJobPosting(company_job?.data);
        setSelectedCategoryId(id);
      } catch (error) {
        console.log('error', error);
      } finally {
        setJobLoading(false);
      }
    },
    [token],
  );

  const getPlanLimit = useCallback(async () => {
    try {
      const PlanLimit = await fetchData.plan_limit(``, token);
      setPlanLimit(PlanLimit?.data);
    } catch (error) {
      console.log('error', error);
    }
  }, [token, index]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'all':
        return (
          <All
            // acticityData={acticityData}
            // activityLoading={activityLoading}
            navigation={navigation}
            token={token}
            index={index}
          />
        );
      case 'called':
        return (
          <Called
            // acticityData={acticityData}
            // activityLoading={activityLoading}
            navigation={navigation}
            token={token}
            index={index}
          />
        );
      case 'viewed':
        return (
          <Viewed
            // acticityData={acticityData}
            // activityLoading={activityLoading}
            navigation={navigation}
            token={token}
            index={index}
          />
        );
      case 'mailed':
        return (
          <Mailed
            // acticityData={acticityData}
            // activityLoading={activityLoading}
            navigation={navigation}
            token={token}
            index={index}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ marginHorizontal: 10 }}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item style={{}}>
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={180}
                borderRadius={10}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item style={{ marginTop: 10 }}>
              <SkeletonPlaceholder.Item
                width={150}
                height={15}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <SkeletonPlaceholder.Item
                  width={100}
                  height={40}
                  borderRadius={100}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={100}
                  height={40}
                  borderRadius={100}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={100}
                  height={40}
                  borderRadius={100}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={100}
                  height={40}
                  borderRadius={100}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={100}
                  height={40}
                  borderRadius={100}
                  marginRight={10}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <SkeletonPlaceholder.Item
                  width={250}
                  height={120}
                  borderRadius={10}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={250}
                  height={120}
                  borderRadius={10}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={250}
                  height={120}
                  borderRadius={10}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={250}
                  height={120}
                  borderRadius={10}
                  marginRight={10}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item style={{ marginTop: 10 }}>
              <SkeletonPlaceholder.Item
                width={150}
                height={15}
                borderRadius={10}
                marginTop={10}
              />
              <SkeletonPlaceholder.Item
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <SkeletonPlaceholder.Item
                  width={150}
                  height={50}
                  borderRadius={10}
                  marginRight={5}
                />
                <SkeletonPlaceholder.Item
                  width={150}
                  height={50}
                  borderRadius={10}
                  marginRight={5}
                />
                <SkeletonPlaceholder.Item
                  width={150}
                  height={50}
                  borderRadius={10}
                  marginRight={5}
                />
                <SkeletonPlaceholder.Item
                  width={150}
                  height={50}
                  borderRadius={10}
                  marginRight={5}
                />
                <SkeletonPlaceholder.Item
                  width={150}
                  height={50}
                  borderRadius={10}
                  marginRight={5}
                />
                <SkeletonPlaceholder.Item
                  width={150}
                  height={50}
                  borderRadius={10}
                  marginRight={5}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                style={{
                  marginTop: 20,
                }}>
                <SkeletonPlaceholder.Item
                  width={'100%'}
                  height={120}
                  borderRadius={10}
                  marginTop={10}
                />
                <SkeletonPlaceholder.Item
                  width={'100%'}
                  height={120}
                  borderRadius={10}
                  marginTop={10}
                />
                <SkeletonPlaceholder.Item
                  width={'100%'}
                  height={120}
                  borderRadius={10}
                  marginTop={10}
                />
                <SkeletonPlaceholder.Item
                  width={'100%'}
                  height={120}
                  borderRadius={10}
                  marginTop={10}
                />
                <SkeletonPlaceholder.Item
                  width={'100%'}
                  height={120}
                  borderRadius={10}
                  marginTop={10}
                />
                <SkeletonPlaceholder.Item
                  width={'100%'}
                  height={120}
                  borderRadius={10}
                  marginTop={10}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: Color.primary,
              padding: 10,
              paddingVertical: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Color.white,
                    fontFamily: Gilmer.Light,
                  }}>
                  {'Hello,'}
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    color: Color.white,
                    fontFamily: Gilmer.Medium,
                  }}
                  numberOfLines={1}>
                  {name}
                </Text>
              </View>
              <Button
                mode="contained"
                onPress={async () => {
                  try {
                    planLimit?.job_limit == 0 || planLimit?.job_limit == undefined
                      ? navigation.navigate('BuySubscriptions')
                      : navigation.navigate('JobDetails');
                  } catch (err) { }
                }}
                style={{
                  backgroundColor: Color.white,
                  marginHorizontal: 10,
                }}
                textColor={Color.black}>
                Post Job +
              </Button>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: Color.white,
                flexDirection: 'row',
                marginTop: 20,
                alignItems: 'center',
                borderRadius: 50,
                width: '100%',
                height: 45,
                paddingHorizontal: 20,
              }}
              onPress={() => {
                navigation.navigate('SearchTab');
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: Color.cloudyGrey,
                  fontFamily: Gilmer.Medium,
                }}
                numberOfLines={1}>
                {`Search candidates.. `}
              </Text>
              <Icon color={Color.black} name="search" size={25} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} nestedScrollEnabled>
            <View style={{ padding: 10, flex: 1 }}>
              <View
                style={{
                  marginVertical: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: Color.black,
                      fontFamily: Gilmer.Bold,
                    }}>
                    Recent Job Post
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('RecentJob')}
                    style={{ padding: 5 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: Color.lightBlack,
                        fontFamily: Gilmer.Medium,
                        paddingHorizontal: 10,
                      }}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={categoryData}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item, index }) => {
                    const isSelected = item.id === selectedCategoryId;
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          getCategory_data(item.id);
                        }}
                        key={index}
                        style={{
                          marginVertical: 10,
                          borderColor: Color.lightgrey,
                          borderWidth: 1,
                          borderRadius: 50,
                          padding: 10,
                          marginRight: 5,
                          backgroundColor: isSelected
                            ? Color.primary
                            : Color.white,
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: isSelected ? Color.white : Color.cloudyGrey,
                            fontFamily: Gilmer.Regular,
                          }}>
                          {item?.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
                {jobLoading ? (
                  <View style={{ padding: 10 }}>
                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <SkeletonPlaceholder.Item
                          width={280}
                          height={100}
                          borderRadius={10}
                          marginRight={10}
                        />
                        <SkeletonPlaceholder.Item
                          width={280}
                          height={100}
                          borderRadius={10}
                          marginRight={10}
                        />
                        <SkeletonPlaceholder.Item
                          width={280}
                          height={100}
                          borderRadius={10}
                          marginRight={10}
                        />
                        <SkeletonPlaceholder.Item
                          width={280}
                          height={100}
                          borderRadius={10}
                          marginRight={10}
                        />
                        <SkeletonPlaceholder.Item
                          width={280}
                          height={100}
                          borderRadius={10}
                          marginRight={10}
                        />
                        <SkeletonPlaceholder.Item
                          width={280}
                          height={100}
                          borderRadius={10}
                          marginRight={10}
                        />
                      </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                  </View>
                ) : (
                  <FlatList
                    data={job_posting}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item, index }) => {
                      const twentyFourHoursAgo = moment(
                        new Date() - 24 * 60 * 60 * 1000,
                      ).format('YYYY-MM-DD');
                      const createdAt = moment(item?.created_at).format(
                        'YYYY-MM-DD',
                      );
                      const newItem = twentyFourHoursAgo > createdAt;
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('JobApplicants', {
                              id: item?.id,
                              title: item?.title,
                            });
                          }}
                          key={index}
                          style={{
                            marginVertical: 10,
                            borderColor: Color.lightgrey,
                            borderWidth: 1,
                            padding: 15,
                            margin: 5,
                            borderRadius: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              justifyContent: 'center',
                            }}>
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  width: 200,
                                  fontSize: 16,
                                  color: Color.black,
                                  fontFamily: Gilmer.Bold,
                                }}>
                                {item?.title}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: Color.cloudyGrey,
                                  fontFamily: Gilmer.Medium,
                                  marginVertical: 5,
                                }}>
                                {`${item?.job_type}`}
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color:
                                      common_fn.calculateRemainingTime(
                                        item?.deadline,
                                      ) == 'Expired'
                                        ? Color.red
                                        : Color.lightBlack,
                                    fontFamily: Gilmer.Medium,
                                    marginVertical: 5,
                                  }}>
                                  {` ${common_fn.calculateRemainingTime(
                                    item?.deadline,
                                  )}`}
                                </Text>
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: Color.primary,
                                    fontFamily: Gilmer.Bold,
                                    marginRight: 10,
                                  }}>
                                  {item?.applicants} applied applicants
                                </Text>
                                {!newItem ? (
                                  <View
                                    style={{
                                      alignItems: 'flex-start',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 14,
                                        color: Color.red,
                                        fontFamily: Gilmer.Medium,
                                        backgroundColor: '#F94F4F10',
                                        padding: 5,
                                      }}>
                                      New
                                    </Text>
                                  </View>
                                ) : (
                                  <View style={{}} />
                                )}
                              </View>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: Color.cloudyGrey,
                                  fontFamily: Gilmer.Medium,
                                }}>
                                {moment(item?.created_at).format('DD MMM YY')}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginVertical: 10,
                            flex: 1,
                          }}>
                          <MIcon name="work" size={30} color={Color.primary} />
                          <Text
                            style={{
                              fontSize: 14,
                              borderRadius: 5,
                              color: Color.primary,
                              marginVertical: 5,
                              fontFamily: Gilmer.Bold,
                            }}>
                            No Job Post
                          </Text>
                        </View>
                      );
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              </View>
              <View style={{}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Color.black,
                    fontFamily: Gilmer.Bold,
                  }}>
                  Your Activities
                </Text>
              </View>
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                swipeEnabled={false}
                onIndexChange={setIndex}
                // style={{
                //   height: acticityData?.length * 100 + 50 + 10 + 50,
                // }}
                style={{ flex: 1 }}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => {
                  return (
                    <TabBar
                      {...props}
                      style={{
                        backgroundColor: Color.white,
                        height: 50,
                        marginVertical: 10,
                      }}
                      labelStyle={{
                        color: Color.primary,
                        fontSize: 14,
                        fontFamily: Gilmer.Bold,
                        borderBottomColor: Color.primary,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                      indicatorStyle={{
                        backgroundColor: Color.primary,
                        height: 5,
                      }}
                      inactiveColor={Color.cloudyGrey}
                    />
                  );
                }}
              />
            </View>
          </ScrollView>
        </View>
      )}
      <PrimeModal navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default HomeScreen;
