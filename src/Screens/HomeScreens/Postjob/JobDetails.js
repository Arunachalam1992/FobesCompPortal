import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {Dropdown} from 'react-native-element-dropdown';
import Color from '../../../Global/Color';
import {useNavigation} from '@react-navigation/native';
import {Gilmer} from '../../../Global/FontFamily';
import fetchData from '../../../Config/fetchData';
import {useSelector} from 'react-redux';
import FIcon from 'react-native-vector-icons/FontAwesome';
import {Divider} from 'react-native-paper';
import common_fn from '../../../Config/common_fn';

const JobDetails = () => {
  const navigation = useNavigation();
  const [jobTitle, setJobTitle] = useState('');
  const [Category, setCategory] = useState({});
  const [role, setRole] = useState({});
  const [description, setDescription] = useState('');
  const [queryCategory, setQueryCategory] = useState('');
  const [categoryModal, setCategoryModal] = useState(false);
  const [roleModal, setRoleModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [queryRole, setQueryRole] = useState('');
  const [selectedRole, setSelectedRole] = useState({});
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [querySkills, setQuerySkills] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const labels = ['JobDetails', 'Salary & Benefits', 'Advance Information'];
  const userData = useSelector(state => state.UserReducer.userData);
  var {token} = userData;
  // console.log('selectedCategory', selectedCategory)

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

  const [categoriesData, setCategoriesData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [tagsData, setTagsData] = useState([]);
  const [requiredSkillsData, setRequiredSkillsData] = useState([]);

  const TagList = ({item, index, onRemove}) => (
    <View style={styles.tagList} key={index}>
      <Text
        style={{
          fontFamily: Gilmer.Medium,
          fontSize: 16,
          color: Color.black,
          textTransform: 'capitalize',
        }}>
        {item?.name}
      </Text>
      <TouchableOpacity
        style={{marginHorizontal: 5}}
        onPress={() => {
          onRemove();
        }}>
        <FIcon name="close" size={16} color={Color.red} />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    getData();
  }, [token]);

  const getData = async () => {
    try {
      // const categories_data = await fetchData.jobcategory(``, token);
      // setCategoriesData(categories_data?.data);
      const roles_data = await fetchData.jobroles(``, token);
      console.log("Job role =========== : ",roles_data);
      setRoleData(roles_data?.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      fetchTagItems(query);
    } else {
      setTagsData([]);
    }
  }, [query]);

  const fetchTagItems = async text => {
    try {
      var tagsData = `name=${text}`;
      const tags_data = await fetchData.tags(tagsData, token);
      setTagsData(tags_data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addTagItem = async newItem => {
    try {
      var data = {name: newItem};
      const create_data = await fetchData.create_tags(data, token);
      if (create_data?.status == true) {
        common_fn.showToast(create_data?.message);
      } else {
        common_fn.showToast(create_data?.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleTagItemPress = item => {
    try {
      setSelectedTags([...selectedTags, item]);
      setQuery(item?.name);
      setTagModal(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleTagRemove = index => {
    const newTags = [...selectedTags];
    newTags.splice(index, 1);
    setSelectedTags(newTags);
  };

  useEffect(() => {
    if (querySkills.length > 0) {
      fetchSkillsItems(querySkills);
    } else {
      setRequiredSkillsData([]);
    }
  }, [querySkills]);

  const fetchSkillsItems = async text => {
    try {
      var skillsData = `name=${text}`;
      const skills_data = await fetchData.skills(skillsData, token);
      console.log('skills_data', skills_data);
      setRequiredSkillsData(skills_data?.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addSkillsItem = async newItem => {
    try {
      var data = {name: newItem, locale: 'en'};
      const create_data = await fetchData.create_skills(data, token);
      if (create_data?.status == true) {
        common_fn.showToast(create_data?.message);
      } else {
        common_fn.showToast(create_data?.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleSkillsItemPress = item => {
    try {
      setSelectedSkills([...selectedSkills, item]);
      setQuerySkills(item?.name);
      setSkillModal(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSkillsRemove = index => {
    const newSkills = [...selectedSkills];
    newSkills.splice(index, 1);
    setSelectedSkills(newSkills);
  };

  useEffect(() => {
    if (queryCategory.length > 0) {
      fetchCategoryItems(queryCategory);
    } else {
      setCategoriesData([]);
    }
  }, [queryCategory]);

  const fetchCategoryItems = async text => {
    try {
      var CategoryData = `name=${text}`;
      const Category_data = await fetchData.jobcategory(CategoryData, token);
      console.log('Category_data', Category_data);
      setCategoriesData(Category_data?.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addCategoryItem = async newItem => {
    try {
      var data = {
        name: newItem,
        locale: 'en',
      };
      const create_data = await fetchData.create_category(data, token);
      if (create_data?.status == true) {
        common_fn.showToast(create_data?.message);
      } else {
        common_fn.showToast(create_data?.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleCategoryItemPress = item => {
    try {
      setSelectedCategory(item);
      setQueryCategory(item?.name);
      setCategoryModal(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (queryRole.length > 0) {
      fetchRoleItems(queryRole);
    } else {
      setRoleData([]);
    }
  }, [queryCategory]);

  const fetchRoleItems = async text => {
    try {
      var RoleData = `name=${text}`;
      const Role_data = await fetchData.jobroles(RoleData, token);
      console.log('Role_data', Role_data);
      setRoleData(Role_data?.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addRoleItem = async newItem => {
    try {
      var data = {
        name: newItem,
        locale: 'en',
      };
      const create_data = await fetchData.create_role(data, token);
      if (create_data?.status == true) {
        common_fn.showToast(create_data?.message);
      } else {
        common_fn.showToast(create_data?.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleRoleItemPress = item => {
    try {
      setSelectedRole(item);
      setQueryRole(item?.name);
      setRoleModal(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const job_details_data = async () => {
    try {
      if (
        jobTitle != '' &&
        selectedCategory?.name != '' &&
        selectedRole?.name != '' &&
        selectedSkills?.length > 0 &&
        selectedTags?.length > 0 &&
        description != ''
      ) {
        navigation.navigate('SalaryandBenefits', {
          jobTitle,
          selectedCategory,
          selectedRole,
          selectedSkills,
          selectedTags,
          description,
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
        currentPosition={0}
        stepCount={3}
        labels={labels}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.h1}>
            Job Title <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={Color.smokeyGrey}
            value={jobTitle}
            placeholder="Enter Job Title"
            onChangeText={text => {
              setJobTitle(text);
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.h1}>
            Job Category <Text style={styles.star}>*</Text>
          </Text>
          {/* <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropContainer}
            itemTextStyle={styles.dropTextStyle}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            iconColor={Color.smokeyGrey}
            data={categoriesData}
            maxHeight={200}
            labelField="name"
            valueField="name"
            placeholder="select your category"
            value={Category}
            onChange={item => {
              setCategory(item);
            }}
          /> */}
          <TextInput
            style={styles.input}
            placeholder="Enter Category"
            placeholderTextColor={Color.cloudyGrey}
            value={queryCategory}
            onChangeText={text => {
              setQueryCategory(text);
            }}
            onSubmitEditing={() => {
              if (queryCategory.length > 0) {
                addCategoryItem(queryCategory);
              }
            }}
            onFocus={() => setCategoryModal(true)}
          />
        </View>
        {categoryModal && (
          <View style={styles.dropdown}>
            {categoriesData.length > 0 ? (
              <FlatList
                data={categoriesData}
                keyExtractor={item => item.job_category_id.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: Color.lightgrey,
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: Color.white,
                    }}
                    onPress={() => {
                      handleCategoryItemPress(item);
                    }}>
                    <Text
                      style={{
                        fontFamily: Gilmer.Medium,
                        fontSize: 16,
                        color: Color.black,
                      }}>
                      {item.name}
                    </Text>
                    {index >= categoriesData.length && (
                      <Divider style={{marginVertical: 5, height: 1}} />
                    )}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: Color.lightgrey,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: Color.white,
                }}
                onPress={() => {
                  addCategoryItem(queryCategory);
                }}>
                <Text
                  style={{
                    fontFamily: Gilmer.Medium,
                    fontSize: 16,
                    color: Color.primary,
                  }}>
                  {queryCategory}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.h1}>
            Job Role <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Role"
            placeholderTextColor={Color.cloudyGrey}
            value={queryRole}
            onChangeText={text => {
              setQueryRole(text);
            }}
            onSubmitEditing={() => {
              if (queryRole.length > 0) {
                addRoleItem(queryRole);
              }
            }}
            onFocus={() => setRoleModal(true)}
          />
        </View>
        {roleModal && (
          <View style={styles.dropdown}>
            {roleData.length > 0 ? (
              <FlatList
                data={roleData}
                keyExtractor={item => item.job_role_id.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: Color.lightgrey,
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: Color.white,
                    }}
                    onPress={() => {
                      handleRoleItemPress(item);
                    }}>
                    <Text
                      style={{
                        fontFamily: Gilmer.Medium,
                        fontSize: 16,
                        color: Color.black,
                      }}>
                      {item.name}
                    </Text>
                    {index >= roleData.length && (
                      <Divider style={{marginVertical: 5, height: 1}} />
                    )}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: Color.lightgrey,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: Color.white,
                }}
                onPress={() => {
                  addRoleItem(queryRole);
                }}>
                <Text
                  style={{
                    fontFamily: Gilmer.Medium,
                    fontSize: 16,
                    color: Color.primary,
                  }}>
                  {queryRole}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.h1}>
            Tags <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Job Title"
            placeholderTextColor={Color.cloudyGrey}
            value={query}
            onChangeText={text => {
              setQuery(text);
            }}
            onSubmitEditing={() => {
              if (query.length > 0) {
                addTagItem(query);
              }
            }}
            onFocus={() => setTagModal(true)}
          />
        </View>
        {tagModal && (
          <View style={styles.dropdown}>
            {tagsData.length > 0 ? (
              <FlatList
                data={tagsData}
                keyExtractor={item => item.id.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: Color.lightgrey,
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: Color.white,
                    }}
                    onPress={() => {
                      handleTagItemPress(item);
                    }}>
                    <Text
                      style={{
                        fontFamily: Gilmer.Medium,
                        fontSize: 16,
                        color: Color.black,
                      }}>
                      {item.name}
                    </Text>
                    {index >= tagsData.length && (
                      <Divider style={{marginVertical: 5, height: 1}} />
                    )}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: Color.lightgrey,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: Color.white,
                }}
                onPress={() => {
                  addTagItem(query);
                }}>
                <Text
                  style={{
                    fontFamily: Gilmer.Medium,
                    fontSize: 16,
                    color: Color.primary,
                  }}>
                  {query}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {selectedTags.length > 0 && (
          <>
            <View style={styles.tagsContainer}>
              {selectedTags.map((tag, index) => (
                <TagList
                  item={tag}
                  index={index}
                  key={index}
                  onRemove={() => handleTagRemove(index)}
                />
              ))}
            </View>
          </>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.h1}>
            Required Skills <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Required Skills"
            placeholderTextColor={Color.cloudyGrey}
            value={querySkills}
            onChangeText={text => {
              setQuerySkills(text);
            }}
            onSubmitEditing={() => {
              if (querySkills.length > 0) {
                addSkillsItem(querySkills);
              }
            }}
            onFocus={() => setSkillModal(true)}
          />
        </View>
        {skillModal && (
          <View style={styles.dropdown}>
            {requiredSkillsData.length > 0 ? (
              <FlatList
                data={requiredSkillsData}
                keyExtractor={item => item.id.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: Color.lightgrey,
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: Color.white,
                    }}
                    onPress={() => {
                      handleSkillsItemPress(item);
                    }}>
                    <Text
                      style={{
                        fontFamily: Gilmer.Medium,
                        fontSize: 16,
                        color: Color.black,
                      }}>
                      {item.name}
                    </Text>
                    {index >= requiredSkillsData.length && (
                      <Divider style={{marginVertical: 5, height: 1}} />
                    )}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: Color.lightgrey,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: Color.white,
                }}
                onPress={() => {
                  addSkillsItem(query);
                }}>
                <Text
                  style={{
                    fontFamily: Gilmer.Medium,
                    fontSize: 16,
                    color: Color.primary,
                  }}>
                  Add {querySkills}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {selectedSkills.length > 0 && (
          <>
            <View style={styles.tagsContainer}>
              {selectedSkills.map((tag, index) => (
                <TagList
                  item={tag}
                  index={index}
                  key={index}
                  onRemove={() => handleSkillsRemove(index)}
                />
              ))}
            </View>
          </>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.h1}>
            Job Description <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={4}
            value={description}
            onChangeText={text => {
              setDescription(text);
            }}
            placeholderTextColor={Color.smokeyGrey}
            textAlignVertical="top"
            placeholder="Enter Job Title"
          />
        </View>
        <TouchableOpacity
          style={styles.nextView}
          onPress={() => {
            job_details_data();
          }}>
          <Text style={styles.next}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

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
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: Color.lightgrey,
    borderRadius: 5,
    color: Color.black,
  },
  ////
  dropDownContainer: {
    gap: 15,
  },
  dropdown: {
    // margin: height * 0.008,
    // height: height * 0.06,
    // width: width * 0.88,
    height: 150,
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
    backgroundColor: Color.lightSky,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: Color.blue,
    borderRadius: 50,
  },
  tagsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 10,
  },
  next: {
    color: Color.white,
    fontSize: 18,
    fontFamily: Gilmer.Medium,
    textAlign: 'center',
    backgroundColor: Color.primary,
    paddingVertical: 10,
    marginTop: 30,
    // marginBottom: 40,
    borderRadius: 5,
  },
});

export default JobDetails;
