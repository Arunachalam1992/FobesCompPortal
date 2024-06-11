import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Color from '../../Global/Color';
import { Gilmer } from '../../Global/FontFamily';
import { pick } from 'react-native-document-picker';
import { Iconviewcomponent } from '../../Componens/Icontag';
import { Button } from 'react-native-paper';
import fetchData from '../../Config/fetchData';
import { useSelector } from 'react-redux';
import common_fn from '../../Config/common_fn';
import axios from 'axios';
import { baseUrl } from '../../Config/base_url';

const BasicDetails = ({ navigation }) => {
  const [logo, setLogo] = useState([]);
  const [banner, setBanner] = useState([]);
  const [companyname, setcompanyname] = useState('');
  const [aboutCompany, setAboutCompany] = useState('');
  const userData = useSelector(state => state.UserReducer.userData);
  var { token } = userData;

  const uploadLogoImage = async () => {
    try {
      if (logo?.length > 0) {
        const formData = new FormData();
        const { uri, name, type } = logo?.[0];
        formData.append('logo', { uri, type, name });
        const response = await axios.post(
          `${baseUrl}api/company/logo`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('Image upload response:', response);
        common_fn.showToast(response?.data?.message);
      }
    } catch (error) {
      console.log('Error uploading profile image:', error);
    }
  };

  const uploadBannerImage = async () => {
    try {
      if (logo?.length > 0) {
        const formData = new FormData();
        const { uri, name, type } = banner?.[0];
        formData.append('banner', { uri, type, name });
        const response = await axios.post(
          `${baseUrl}api/company/banner`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('Image upload response:', response);
        common_fn.showToast(response?.data?.message);
      }
    } catch (error) {
      console.log('Error uploading profile image:', error);
    }
  };

  const set_basic_data = async () => {
    try {
      uploadLogoImage();
      uploadBannerImage();
      // if (logo?.length > 0 && banner?.length > 0 && companyname?.length > 0) {
      if (logo?.length > 0 && companyname?.length > 0) {
        var data = {
          name: companyname,
          bio: aboutCompany,
        };
        const basic_data = await fetchData.update_company_details(data, token);
        if (basic_data?.message == 'Profile Updated Successfully') {
          navigation.navigate('profileDetails');
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
      <View
        style={{
          width: '100%',
          height: 6,
          backgroundColor: Color.Whisper,
          borderRadius: 10,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                fontSize: 18,
                color: Color.lightBlack,
                fontFamily: Gilmer.Bold,
              }}>
              Company Information
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginVertical: 10,
              }}>
              <View style={{ flex: 1, marginHorizontal: 5 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Color.lightBlack,
                    fontFamily: Gilmer.Medium,
                  }}>
                  Upload Logo
                </Text>
                {logo?.length > 0 ? (
                  logo?.map((item, index) => {
                    return (
                      <Image
                        source={{ uri: item?.uri }}
                        style={{
                          width: '100%',
                          height: 130,
                          resizeMode: 'contain',
                          marginVertical: 10,
                        }}
                      />
                    );
                  })
                ) : (
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const images = await pick();
                        setLogo(images);
                      } catch (error) {
                        console.log('error', error);
                      }
                    }}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 130,
                      borderWidth: 1,
                      borderColor: Color.cloudyGrey,
                      borderRadius: 5,
                      borderStyle: 'dashed',
                      marginVertical: 10,
                      padding: 10,
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Iconviewcomponent
                        Icontag={'FontAwesome'}
                        iconname={'folder-open'}
                        icon_size={30}
                        icon_color={'#A0C7EB'}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: Color.cloudyGrey,
                          textAlign: 'center',
                          fontFamily: Gilmer.Medium,
                          marginVertical: 10,
                        }}>
                        Image size (68*68)
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: Color.primary,
                          textAlign: 'center',
                          fontFamily: Gilmer.Medium,
                        }}>
                        Browse Files
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ flex: 1, marginHorizontal: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Color.lightBlack,
                      fontFamily: Gilmer.Medium,
                    }}>
                    Cover Image
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Color.cloudyGrey,
                      fontFamily: Gilmer.Medium,
                    }}>
                    {' '}
                    (Optional)
                  </Text>
                </View>
                {banner?.length > 0 ? (
                  banner?.map((item, index) => {
                    return (
                      <Image
                        source={{ uri: item?.uri }}
                        style={{
                          width: '100%',
                          height: 130,
                          resizeMode: 'contain',
                          marginVertical: 10,
                        }}
                      />
                    );
                  })
                ) : (
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        const images = await pick();
                        setBanner(images);
                      } catch (error) {
                        console.log('error', error);
                      }
                    }}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: 130,
                      borderWidth: 1,
                      borderColor: Color.cloudyGrey,
                      borderRadius: 5,
                      borderStyle: 'dashed',
                      marginVertical: 10,
                      padding: 10,
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Iconviewcomponent
                        Icontag={'FontAwesome'}
                        iconname={'folder-open'}
                        icon_size={30}
                        icon_color={'#A0C7EB'}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: Color.cloudyGrey,
                          textAlign: 'center',
                          fontFamily: Gilmer.Medium,
                          marginVertical: 10,
                        }}>
                        Image size (1920*312)
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: Color.primary,
                          textAlign: 'center',
                          fontFamily: Gilmer.Medium,
                        }}>
                        Browse Files
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: Color.black,
                fontFamily: Gilmer.Bold,
              }}>
              Company Name
            </Text>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={Color.cloudyGrey}
              value={companyname}
              onChangeText={text => {
                setcompanyname(text);
              }}
              style={{
                borderColor: Color.lightgrey,
                borderWidth: 1,
                borderRadius: 5,
                marginVertical: 10,
                paddingHorizontal: 10,
                fontSize: 14,
                color: Color.cloudyGrey,
                fontFamily: Gilmer.Medium,
              }}
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: Color.black,
                  fontFamily: Gilmer.Bold,
                }}>
                About Company
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Color.cloudyGrey,
                  fontFamily: Gilmer.Medium,
                }}>
                {' '}
                (optional)
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
                backgroundColor: '#EAEAEF50',
                borderRadius: 5,
              }}>
              <TextInput
                placeholder="About Company"
                placeholderTextColor={Color.cloudyGrey}
                multiline={true}
                value={aboutCompany}
                onChangeText={text => {
                  setAboutCompany(text);
                }}
                returnKeyType={'done'}
                style={{
                  color: 'black',
                  minHeight: 150,
                  borderRadius: 10,
                  padding: 10,
                  width: '100%',
                  borderColor: Color.lightgrey,
                  borderWidth: 1,
                  fontSize: 16,
                  textAlign: 'justify',
                  fontFamily: Gilmer.Medium,
                  paddingHorizontal: 10,
                }}
                textAlignVertical="top"
                showSoftInputOnFocus={true}
              />
            </View>
          </View>
          <Button
            mode="contained"
            onPress={() => {
              set_basic_data();
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

export default BasicDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 10,
  },
});
