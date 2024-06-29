import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import StepIndicator from 'react-native-step-indicator';
import Color from '../../../Global/Color';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import { Gilmer } from '../../../Global/FontFamily';
import fetchData from '../../../Config/fetchData';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import common_fn from '../../../Config/common_fn';

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
const labels = ['JobDetails', 'Salary & Benefits', 'Advance Information'];

const AdvanceInformation = ({ route }) => {
  const [jobTitle] = useState(route.params.jobTitle);
  const [selectedCategory] = useState(route.params.selectedCategory);
  const [selectedRole] = useState(route.params.selectedRole);
  console.log("selectedRole   ",route.params,);
  const [selectedSkills] = useState(route.params.selectedSkills);
  const [selectedTags] = useState(route.params.selectedTags);
  const [description] = useState(route.params.description);
  const [salaryRange] = useState(route.params.salaryRange);
  const [min] = useState(route.params.min);
  const [max] = useState(route.params.max);
  const [salaryType] = useState(route.params.salaryType);
  const [selectedBenifits] = useState(route.params.selectedBenifits);
  const navigation = useNavigation();
  const [Education, setEducation] = useState({});
  const [Experience, setExperience] = useState({});
  const [totalVacancies, setTotalVacancies] = useState('');
  const [jobType, setJobType] = useState({});
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [remotePosition, setRemotePosition] = useState(false);
  const [screeningQues, setScreeningQues] = useState('');
  const [applyJobOn, setApplyJobOn] = useState({});
  const [applyVenueData, setApplyVenueData] = useState('');
  const [exactLocation, setExactLocation] = useState('');
  const userData = useSelector(state => state.UserReducer.userData);
  var { token, country } = userData;

  const [jobTypeData, setJobTypeData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [DeadlineExpired, setDeadlineExpired] = useState('');

  const applyJobOnList = [
    { label: 'App', value: 'app' },
    { label: 'Email', value: 'email' },
    { label: 'Website', value: 'website' },
  ];

  useEffect(() => {
    getData();
  }, [getData]);

  const getData = async () => {
    try {
      const job_data = await fetchData.jobtype({}, token);
      setJobTypeData(job_data?.data);
      const experience_data = await fetchData.experience({}, token);
      setExperienceData(experience_data?.data);
      const education_data = await fetchData.education({}, token);
      setEducationData(education_data?.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const [FromdatePickerVisible, setFromDatePickerVisible] = useState(false);
  const showFromDatePicker = () => {
    setFromDatePickerVisible(true);
  };

  const hideFromDatePicker = () => {
    setFromDatePickerVisible(false);
  };

  const handleFromConfirm = date => {
    setDeadlineExpired(date);
  };
  // console.log('selectedCategory', selectedCategory);
  const postJob = async () => {
    try { 
      
      if (
        (Education?.name != '' &&
          Experience?.name != '' &&
          jobType?.name != '' &&
          totalVacancies != '' &&
          DeadlineExpired != '' &&
          exactLocation != ''
          //   &&
          //   applyJobOn?.value == 'app') ||
          // (applyJobOn?.value != 'app' && applyVenueData != ''

        )
      ) {
       
        var data = {
          title: jobTitle,
          category_id: selectedCategory?.job_category_id,
          role_id: selectedRole?.job_role_id,
          tags: selectedTags.map(item => item.id),
          skills: selectedSkills.map(item => item.id),
          description: description,
          salary_mode: salaryRange?.value,
          custom_salary: 'Competitive',
          min_salary: min,
          max_salary: max,
          salary_type_id: salaryType?.id,
          benefits: selectedBenifits.map(item => item.benefit_id),
          education_id: Education?.education_id,
          experience_id: Experience?.experience_id,
          job_type_id: jobType?.id,
          vacancies: totalVacancies,
          deadline: moment(DeadlineExpired).format('YYYY-MM-DD'),
          exact_location: exactLocation,
          country: country,
          apply_on: applyJobOn?.value,
          apply_email: applyJobOn?.value == 'email' ? applyVenueData : '',
          apply_url: applyJobOn?.value == 'website' ? applyVenueData : '',
        };

        if (salaryRange?.value === 'range') {
          if (min !== 0) {
            data.min_salary = min;
          }
          if (max !== 0) {
            data.max_salary = max;
          }
        }

        if (salaryRange?.value === 'custom') {
          data.custom_salary = 'Competitive';
        }
        const post_data = await fetchData.job_post(data, token);
        console.log("POST ============= :", post_data);
        if (post_data?.message == 'Job created successfully') {
          navigation.replace('Congratulations', { id: post_data?.id });
          common_fn.showToast(post_data?.message);
        } else {
          common_fn.showToast(post_data?.message);
        }
      } else {
        common_fn.showToast(post_data?.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  };


  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: Color.white }}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={2}
        stepCount={3}
        labels={labels}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.h1}>
            Education <Text style={styles.star}>*</Text>
          </Text>
          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropContainer}
            itemTextStyle={styles.dropTextStyle}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            iconColor={Color.smokeyGrey}
            data={educationData}
            maxHeight={200}
            labelField="name"
            valueField="name"
            placeholder="select your education"
            value={Education}
            onChange={item => {
              setEducation(item);
            }}
          />

          <Text style={styles.h1}>
            Experience <Text style={styles.star}>*</Text>
          </Text>
          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropContainer}
            itemTextStyle={styles.dropTextStyle}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            iconColor={Color.smokeyGrey}
            data={experienceData}
            maxHeight={200}
            labelField="name"
            valueField="name"
            placeholder="Select your experience"
            value={Experience}
            onChange={item => {
              setExperience(item);
            }}
          />

          <Text style={styles.h1}>
            Job Type <Text style={styles.star}>*</Text>
          </Text>
          <View style={styles.tagsContainer}>
            {jobTypeData.map((item, index) => (
              <TouchableOpacity
                style={{
                  backgroundColor:
                    jobType?.name == item?.name ? Color.lightSky : Color.white,
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
                  setJobType(item);
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
          <Text style={styles.h1}>
            Total Vacancies <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={{
              color: Color.black,
              fontFamily: Gilmer.Medium,
              borderWidth: 1,
              borderColor: Color.lightgrey,
              paddingHorizontal: 10,
              borderRadius: 5,
              marginTop: 10,
              padding: 10,
            }}
            placeholder="Enter Your Vacancies"
            value={totalVacancies}
            placeholderTextColor={Color.cloudyGrey}
            keyboardType="numeric"
            onChangeText={text => {
              setTotalVacancies(text);
            }}
          />
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.h1}>
              Deadline Expired <Text style={styles.star}>*</Text>
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
                {DeadlineExpired == ''
                  ? 'Select Your Date'
                  : moment(DeadlineExpired).format('YYYY MM DD')}
              </Text>
              <FontAwesome name="calendar" size={20} color={Color.black} />
            </TouchableOpacity>
            <DateTimePickerModal
              date={DeadlineExpired || new Date()}
              isVisible={FromdatePickerVisible}
              mode="date"
              onConfirm={handleFromConfirm}
              onCancel={hideFromDatePicker}
            />
          </View>
          <Text style={styles.h1}>
            Location <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            value={exactLocation}
            onChangeText={text => {
              setExactLocation(text);
            }}
            style={styles.input}
            placeholder="Enter Company Address"
          />
          <View style={styles.remotePositionView}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.checkBox}
              onPress={() => setRemotePosition(!remotePosition)}>
              {remotePosition && (
                <FontAwesome name="check" size={15} color={Color.green} />
              )}
            </TouchableOpacity>
            <Text style={styles.p}>Fully Remote Position-Worldwide</Text>
          </View>
          {/* <Text style={styles.h1}>Add Screening Questions</Text>
          <TextInput
            style={styles.input}
            placeholder="New screening question"
          />
          <View style={styles.radioView}>
            <TouchableOpacity onPress={() => setScreeningQues('saveForLater')}>
              {screeningQues === 'saveForLater' ? (
                <Fontisto
                  name="radio-btn-active"
                  size={20}
                  color={Color.blue}
                />
              ) : (
                <Fontisto
                  name="radio-btn-passive"
                  size={20}
                  color={Color.smokeyGrey}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.p}>Save For Later</Text>
          </View>
          <View style={styles.radioVie1w}>
            <TouchableOpacity onPress={() => setScreeningQues('Required')}>
              {screeningQues === 'Required' ? (
                <Fontisto
                  name="radio-btn-active"
                  size={20}
                  color={Color.blue}
                />
              ) : (
                <Fontisto
                  name="radio-btn-passive"
                  size={20}
                  color={Color.smokeyGrey}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.p}>Required ( Candidate must answer )</Text>
          </View> */}

          <View style={styles.applyJobOnView}>
            <Text style={styles.h1}>Apply for Job On</Text>
            <Text style={styles.p2}>
              Candidate apply for a job on your website, all applications on
              your own website
            </Text>
          </View>
          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropContainer}
            itemTextStyle={styles.dropTextStyle}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            iconColor={Color.smokeyGrey}
            data={applyJobOnList}
            maxHeight={200}
            labelField="label"
            valueField="label"
            placeholder="Select Your Platform To Apply"
            value={applyJobOn}
            onChange={item => {
              setApplyJobOn(item);
            }}
          />
          <View style={styles.urlView}>
            {applyJobOn?.value != 'app' && (
              <Entypo
                name={
                  applyJobOn?.value == 'website'
                    ? 'link'
                    : applyJobOn?.value == 'app'
                      ? 'mobile'
                      : 'mail'
                }
                size={20}
                color={Color.smokeyGrey}
              />
            )}
            {applyJobOn?.value != 'app' && (
              <TextInput
                style={styles.urlInput}
                placeholder={
                  applyJobOn?.value == 'website'
                    ? 'Enter Your Webite'
                    : 'Enter Your mail id'
                }
                value={applyVenueData}
                onChangeText={text => {
                  setApplyVenueData(text);
                }}
              />
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.nextView}
          onPress={() => {
            postJob();
          }}>
          <Text style={styles.next}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AdvanceInformation;

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: '#ffff',
    gap: 15,
  },
  inputContainer: {
    // paddingHorizontal: 20,
    gap: 15,
  },
  h1: {
    color: Color.black,
    fontSize: 16,
    fontFamily: Gilmer.Medium,
  },
  h2: {
    color: Color.black,
    fontSize: 20,
    fontFamily: Gilmer.Medium,
  },
  p: {
    color: Color.black,
    fontSize: 14,
    fontFamily: Gilmer.Medium,
  },
  p2: {
    color: Color.lightBlack,
    fontSize: 12,
    fontFamily: Gilmer.Medium,
  },
  star: {
    color: Color.red,
    fontSize: 14,
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
  /////dropdown
  dropDownContainer: {
    // paddingHorizontal: 10,
    gap: 15,
  },
  dropdown: {
    // margin: height * 0.005,
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
    fontSize: 16,
    fontFamily: Gilmer.Medium,
    marginLeft: width * 0.04,
  },
  dropTextStyle: {
    color: Color.black,
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
    fontSize: 20,
    fontFamily: Gilmer.Medium,
    textAlign: 'center',
    backgroundColor: Color.primary,
    paddingVertical: 10,
    marginHorizontal: 18,
    borderRadius: 8,
  },
  ////Date
  dataView: {
    backgroundColor: Color.Fantasy,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Color.lightgrey,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    width: 250,
    fontSize: 16,
    fontFamily: Gilmer.Medium,
    color: Color.black,
  },
  remotePositionView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Color.lightgrey,
    padding: 1,
    borderRadius: 2,
  },
  radioView: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 5,
  },
  applyJobOnView: {
    gap: 10,
  },
  urlView: {
    backgroundColor: Color.Fantasy,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Color.lightgrey,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  urlInput: {
    width: 250,
    fontSize: 16,
    fontFamily: Gilmer.Medium,
    color: Color.black,
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
