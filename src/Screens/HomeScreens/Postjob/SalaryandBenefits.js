import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import StepIndicator from 'react-native-step-indicator';
import Color from '../../../Global/Color';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import {Gilmer} from '../../../Global/FontFamily';
import fetchData from '../../../Config/fetchData';
import {useSelector} from 'react-redux';
import {Button} from 'react-native-elements';
import common_fn from '../../../Config/common_fn';

const labels = ['JobDetails', 'Salary & Benefits', 'Advance Information'];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 4,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#309CD2',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#309CD2',
  stepStrokeUnFinishedColor: '#EAEAEF',
  separatorFinishedColor: '#309CD2',
  separatorUnFinishedColor: '#EAEAEF',
  stepIndicatorFinishedColor: '#309CD2',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#309CD2',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#EAEAEF',
  labelColor: '#EAEAEF',
  labelSize: 13,
  currentStepLabelColor: Color.black,
};
const SalaryandBenefits = ({route}) => {
  const [jobTitle] = useState(route.params.jobTitle);
  const [selectedCategory] = useState(route.params.selectedCategory);
  const [selectedRole] = useState(route.params.selectedRole);
  console.log("Salary Ben ========== : ",selectedRole);
  const [selectedSkills] = useState(route.params.selectedSkills);
  const [selectedTags] = useState(route.params.selectedTags);
  const [description] = useState(route.params.description);
  const navigation = useNavigation();
  const [salaryRange, setSalaryRange] = useState({});
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [BenifitsVisible, setBenifitsVisible] = useState(false);
  const [salaryType, setSalaryType] = useState({});
  const [benifitsData, setBenifitsData] = useState([]);
  // console.log('benifitsData', benifitsData)
  const [queryBenefits, setQueryBenefits] = useState('');
  const [selectedBenifits, setSelectedBenifits] = useState([]);
  const [benifitsSelectedItem, setBenifitsSelectedItem] = useState([]);
  const [salaryTypeData, setSalaryTypeData] = useState([]);
  const userData = useSelector(state => state.UserReducer.userData);
  var {token} = userData;

  const [SalaryRangeData] = useState([
    {
      id: 1,
      name: 'Salary Range',
      value: 'range',
    },
    {
      id: 2,
      name: 'Custom Salary',
      value: 'custom',
    },
  ]);

  const handleBenifitsPress = itemId => {
    if (benifitsSelectedItem.includes(itemId)) {
      setBenifitsSelectedItem(
        benifitsSelectedItem?.filter(single => single !== itemId),
      );
      setSelectedBenifits(
        selectedBenifits?.filter(single => single.benefit_id !== itemId),
      );
    } else {
      setBenifitsSelectedItem([...benifitsSelectedItem, itemId]);
      const selectedItem = benifitsData.find(
        single => single.benefit_id === itemId,
      );
      setSelectedBenifits([...selectedBenifits, selectedItem]);
    }
  };

  useEffect(() => {
    getData();
  }, [getData, token]);

  const getData = async () => {
    try {
      const benifits_data = await fetchData.benefits(``, token);
      setBenifitsData(benifits_data?.data);
      const salarytype_data = await fetchData.salarytype(``, token);
      console.log('salarytype_data?.data', salarytype_data?.data);
      setSalaryTypeData(salarytype_data?.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addBenifitsItem = async newItem => {
    try {
      if (!newItem) {
        common_fn.showToast('Please Enter Any Benifits');
      } else {
        var data = {
          name: newItem,
          locale: 'en',
        };
        const create_data = await fetchData.create_benifits(data, token);
        if (create_data?.status == true) {
          common_fn.showToast(create_data?.message);
        } else {
          common_fn.showToast(create_data?.message);
        }
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const salary_details_data = async () => {
    try {
      if (
        (salaryRange?.value != 'range' ||
          (salaryRange?.value == 'range' && min != 0 && max != 0)) &&
        salaryType?.name != '' &&
        selectedBenifits?.length > 0
      ) {
        navigation.navigate('AdvanceInformation', {
          jobTitle,
          selectedCategory,
          selectedRole,
          selectedSkills,
          selectedTags,
          description,
          salaryRange,
          min,
          max,
          salaryType,
          selectedBenifits,
        });
      } else {
        common_fn.showToast('Please Select All the Required fields');
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <View style={{flex: 1, padding: 10, backgroundColor: Color.white}}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={1}
        stepCount={3}
        labels={labels}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.h2}>Salary</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {SalaryRangeData?.map((item, index) => {
              return (
                <View style={styles.salaryView} key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      setSalaryRange(item);
                    }}>
                    <Text
                      style={[
                        styles.salaryType,
                        salaryRange?.name == item?.name
                          ? {backgroundColor: Color.lightSky}
                          : null,
                      ]}>
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          {salaryRange?.value == 'range' && (
            <View style={styles.salaryInputView}>
              <View>
                <Text style={styles.h2}>Minimum Salary</Text>
                <TextInput
                  style={styles.salaryInput}
                  placeholder="₹ Minimum Salary"
                  value={min}
                  placeholderTextColor={Color.cloudyGrey}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setMin(text);
                  }}
                />
              </View>
              <View>
                <Text style={styles.h2}>Maximum Salary</Text>
                <View style={styles.salaryInputView2}>
                  <TextInput
                    style={styles.salaryInput}
                    placeholder="₹ Maximum Salary"
                    value={max}
                    placeholderTextColor={Color.cloudyGrey}
                    keyboardType="numeric"
                    onChangeText={text => {
                      setMax(text);
                    }}
                  />
                </View>
              </View>
            </View>
          )}

          <>
            <Text style={styles.h2}>
              Salary Type <Text style={styles.star}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropContainer}
              itemTextStyle={styles.dropTextStyle}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              iconColor={Color.smokeyGrey}
              data={salaryTypeData}
              maxHeight={200}
              labelField="name"
              valueField="name"
              placeholder="Select Your Salary Type"
              value={salaryType}
              onChange={item => {
                setSalaryType(item);
              }}
            />
          </>

          <>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: Color.black,
                  fontSize: 16,
                  fontFamily: Gilmer.Bold,
                  flex: 1,
                }}>
                Benefits
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setBenifitsVisible(true);
                }}>
                <Text
                  style={{
                    color: Color.primary,
                    fontSize: 16,
                    fontFamily: Gilmer.Medium,
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
              {benifitsData.map((item, index) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: benifitsSelectedItem.includes(
                      item.benefit_id,
                    )
                      ? Color.lightSky
                      : Color.white,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 5,
                    margin: 5,
                    borderWidth: 1,
                    borderColor: Color.blue,
                    borderRadius: 50,
                  }}
                  key={index}
                  onPress={() => {
                    handleBenifitsPress(item?.benefit_id);
                  }}>
                  <Text
                    style={{
                      fontFamily: Gilmer.Medium,
                      fontSize: 16,
                      color: Color.black,
                    }}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        </View>
        <TouchableOpacity
          style={styles.nextView}
          onPress={() => {
            salary_details_data();
          }}>
          <Text style={styles.next}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal transparent visible={BenifitsVisible} animationType="slide">
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 10,
            backgroundColor: Color.transparantBlack,
          }}
          onPress={() => {
            setBenifitsVisible(false);
          }}
        />
        <View
          style={{
            backgroundColor: Color.white,
            borderRadius: 10,
            padding: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: Color.black,
              fontFamily: Gilmer.Bold,
              marginVertical: 10,
            }}>
            Enter Your Benifits
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Benifits"
            placeholderTextColor={Color.cloudyGrey}
            value={queryBenefits}
            onChangeText={text => {
              setQueryBenefits(text);
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Button
              title={'Close'}
              onPress={() => {
                setBenifitsVisible(false);
              }}
              titleStyle={{
                fontSize: 16,
                fontFamily: Gilmer.SemiBold,
                color: Color.white,
              }}
              buttonStyle={{
                marginVertical: 20,
                backgroundColor: '#DA000080',
                borderRadius: 10,
                marginHorizontal: 10,
              }}
              containerStyle={{
                flex: 1,
              }}
            />
            <Button
              title={'Add Benifits'}
              onPress={() => {
                addBenifitsItem(queryBenefits);
                setQueryBenefits('');
              }}
              titleStyle={{
                fontSize: 16,
                fontFamily: Gilmer.SemiBold,
                color: Color.white,
              }}
              buttonStyle={{
                marginVertical: 20,
                backgroundColor: Color.primary,
                borderRadius: 10,
                marginHorizontal: 10,
              }}
              containerStyle={{
                flex: 1,
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SalaryandBenefits;

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: '#ffff',
    gap: 15,
  },
  inputContainer: {
    gap: 15,
  },
  h1: {
    color: Color.black,
    fontSize: 20,
    fontFamily: Gilmer.Medium,
  },
  h2: {
    color: Color.black,
    fontSize: 16,
    fontFamily: Gilmer.Medium,
  },
  p: {
    color: Color.black,
    fontSize: 14,
    fontFamily: Gilmer.Medium,
  },
  p2: {
    color: Color.white,
    fontFamily: Gilmer.Medium,
  },
  star: {
    color: Color.red,
    fontFamily: Gilmer.Medium,
  },
  input: {
    backgroundColor: Color.Fantasy,
    fontSize: 16,
    fontFamily: Gilmer.Medium,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Color.lightgrey,
    borderRadius: 5,
  },
  salaryView: {
    flexDirection: 'row',
  },
  salaryType: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: Color.blue,
    color: Color.black,
    fontFamily: Gilmer.Medium,
    borderRadius: 20,
  },
  salaryInputView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  salaryInputView2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    // borderWidth: 1,
    // borderColor: Color.lightgrey,
  },
  salaryInput: {
    color: Color.black,
    fontFamily: Gilmer.Medium,
    borderWidth: 1,
    borderColor: Color.lightgrey,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    // paddingVertical: 5,
    padding: 10,
  },
  ///dropdown
  dropDownContainer: {
    // paddingHorizontal: 15,
    gap: 15,
  },
  dropdown: {
    // margin: height * 0.008,
    // height: height * 0.06,
    // width: width * 0.88,
    height: 45,
    backgroundColor: Color.Fantasy,
    borderColor: Color.lightgrey,
    borderWidth: 1,
    borderRadius: 5,
  },
  dropContainer: {
    color: Color.black,
    fontFamily: Gilmer.Medium,
  },
  placeholderStyle: {
    color: Color.smokeyGrey,
    fontFamily: Gilmer.Medium,
    fontSize: 16,
    marginLeft: width * 0.04,
  },
  dropTextStyle: {
    color: Color.black,
    fontFamily: Gilmer.Medium,
  },
  selectedTextStyle: {
    color: Color.black,
    fontFamily: Gilmer.Medium,
    fontSize: 16,
    marginLeft: width * 0.04,
  },
  iconStyle: {
    width: 25,
    height: 25,
    marginRight: 10,
    backgroundColor: Color.primaryColor,
    borderRadius: 10,
  },

  tagList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: Color.blue,
    borderRadius: 20,
  },
  tagsContainer: {
    flexWrap: 'wrap',
    width: width * 0.9,
    Height: height * 0.5,
    resizeMode: 'stretch',
    flexDirection: 'row',
  },
  next: {
    color: Color.white,
    fontSize: 18,
    fontFamily: Gilmer.Medium,
    textAlign: 'center',
    backgroundColor: Color.primary,
    padding: 10,
    marginTop: 30,
    // marginBottom: 40,
    borderRadius: 5,
  },
});
