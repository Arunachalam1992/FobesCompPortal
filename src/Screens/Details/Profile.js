import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Color from '../../Global/Color';
import FIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Gilmer} from '../../Global/FontFamily';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-paper';
import fetchData from '../../Config/fetchData';
import common_fn from '../../Config/common_fn';
import {useSelector} from 'react-redux';

const ProfileDetails = ({navigation, route}) => {
  const [FromdatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [OrganizationType, setOrganizationType] = useState(0);
  const [IndustryType, setIndustryType] = useState(0);
  const [TeamSize, setTeamSize] = useState(0);
  const [Website, setWebsite] = useState([]);
  const [extablishDate, setEstablishDate] = useState('');

  const [OrganizationData, setOrganizationData] = useState([]);
  const [IndustryData, setIndustryData] = useState([]);
  const [TeamSizeData, setTeamSizeData] = useState([]);
  const userData = useSelector(state => state.UserReducer.userData);
  var {token} = userData;

  const showFromDatePicker = () => {
    setFromDatePickerVisible(true);
  };

  const hideFromDatePicker = () => {
    setFromDatePickerVisible(false);
  };

  const handleFromConfirm = date => {
    setEstablishDate(date);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const getOrganization = await fetchData.organization_data();
      setOrganizationData(getOrganization?.data);
      const getIndutry = await fetchData.industry_data();
      setIndustryData(getIndutry?.data);
      const getTeamSize = await fetchData.teamsize_data();
      setTeamSizeData(getTeamSize?.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const set_profile_data = async () => {
    try {
      if (
        OrganizationType != 0 &&
        IndustryType != 0 &&
        TeamSize != 0 
        // &&
        // extablishDate != '' &&
        // Website != ''
      ) {
        var data = {
          organization_type_id: OrganizationType,
          industry_type_id: IndustryType,
          team_size_id: TeamSize,
          establishment_date: extablishDate,
          website: Website,
        };
        const complete_data = await fetchData.update_company_details(
          data,
          token,
        );
        if (complete_data?.message == 'Profile Updated Successfully') {
          navigation.navigate('SocialMedia');
        }
      } else {
        common_fn.showToast('Please select the fields');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{}}>
        <View
          style={{
            width: '15%',
            height: 6,
            backgroundColor: Color.primary,
            borderRadius: 10,
            position: 'absolute',
            zIndex: 1,
          }}
        />
        <View
          style={{
            width: '100%',
            height: 6,
            backgroundColor: Color.Whisper,
            borderRadius: 10,
          }}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontSize: 16,
                color: Color.black,
                fontWeight: 'bold',
                marginVertical: 10,
              }}>
              Organization Type
            </Text>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              itemTextStyle={{color: Color.black}}
              data={OrganizationData}
              value={OrganizationType}
              maxHeight={300}
              labelField="name"
              valueField="organization_type_id"
              placeholder={'Select Organization Type'}
              searchPlaceholder="Search..."
              onChange={item => {
                setOrganizationType(item?.organization_type_id);
              }}
            />
          </View>
          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontSize: 16,
                color: Color.black,
                fontWeight: 'bold',
                marginVertical: 10,
              }}>
              Industry Type
            </Text>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={{color: Color.black}}
              iconStyle={styles.iconStyle}
              data={IndustryData}
              value={IndustryType}
              maxHeight={300}
              labelField="name"
              valueField="industry_type_id"
              placeholder={'Select Industry Type'}
              searchPlaceholder="Search..."
              onChange={item => {
                setIndustryType(item?.industry_type_id);
              }}
            />
          </View>
          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontSize: 16,
                color: Color.black,
                fontWeight: 'bold',
                marginVertical: 10,
              }}>
              Team Size
            </Text>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={{color: Color.black}}
              iconStyle={styles.iconStyle}
              data={TeamSizeData}
              value={TeamSize}
              maxHeight={300}
              labelField="name"
              valueField="id"
              placeholder={'Select Your Team size'}
              searchPlaceholder="Search..."
              onChange={item => {
                setTeamSize(item?.id);
              }}
            />
          </View>
          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontSize: 16,
                color: Color.black,
                fontFamily: Gilmer.Bold,
              }}>
              Website URL
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: Color.lightgrey,
                borderWidth: 1,
                borderRadius: 5,
                marginVertical: 10,
                paddingHorizontal: 10,
              }}>
              <Icon name="link-sharp" size={30} color={Color.cloudyGrey} />
              <TextInput
                placeholder="Your Company Website link"
                placeholderTextColor={Color.cloudyGrey}
                value={Website}
                onChangeText={text => {
                  setWebsite(text);
                }}
                style={{
                  fontSize: 14,
                  color: Color.cloudyGrey,
                  fontFamily: Gilmer.Medium,
                  marginHorizontal: 10,
                }}
              />
            </View>
          </View>
          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontSize: 16,
                color: Color.black,
                fontFamily: Gilmer.SemiBold,
              }}>
              Year of Establishment
            </Text>
            <TouchableOpacity
              onPress={() => showFromDatePicker()}
              style={{
                borderColor: Color.cloudyGrey,
                borderWidth: 1,
                borderRadius: 5,
                marginVertical: 10,
                paddingHorizontal: 10,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: Color.cloudyGrey,
                  fontFamily: Gilmer.Medium,
                }}>
                {extablishDate == ''
                  ? 'Select Your Date'
                  : moment(extablishDate).format('YYYY MM DD')}
              </Text>
              <FIcon name="calendar" size={20} color={Color.black} />
            </TouchableOpacity>
            <DateTimePickerModal
              date={extablishDate || new Date()}
              isVisible={FromdatePickerVisible}
              mode="date"
              onConfirm={handleFromConfirm}
              onCancel={hideFromDatePicker}
            />
          </View>
          <Button
            mode="contained"
            onPress={async () => {
              try {
                set_profile_data();
              } catch (err) {}
            }}
            style={{
              backgroundColor: Color.primary,
              marginHorizontal: 10,
            }}
            textColor={Color.white}>
            Save & Next
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 10,
  },
  dropdown: {
    height: 50,
    borderColor: Color.lightgrey,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: Color.black,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Color.cloudyGrey,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Color.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: Color.black,
  },
});
