import React, { useState } from 'react';
import { View, Text,FlatList, StyleSheet,TouchableOpacity,Image,ImageSourcePropType   } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import MultiSlider from '@ptomasroos/react-native-multi-slider'; // Ensure this package is installed
import { Picker } from '@react-native-picker/picker';
import axios from 'axios'; 


type SearchProps = {
  navigation: any; 
};
type Tag = {
  key: string;
  icon: ImageSourcePropType;
  icon2: ImageSourcePropType;
};

type SelectedTag = Tag & { id: string };
const tagsData: Tag[] = [
  { key: '식사', icon: require('../assets/icons/icon_Utensils_w.png'),icon2: require('../assets/icons/icon_Utensils_b.png') },
  { key: '카페', icon: require('../assets/icons/icon_MugHot_w.png'),icon2: require('../assets/icons/icon_MugHot_b.png')  },
  { key: '활동', icon: require('../assets/icons/icon_Running_w.png'),icon2: require('../assets/icons/icon_Running_b.png') },
  { key: '숙소', icon: require('../assets/icons/icon_Bed_w.png'),icon2: require('../assets/icons/icon_Bed_b.png') },
];

const Search: React.FC<SearchProps> = ({ navigation }) => {

  const pointColor = '#2FDBBC';

  const [priceRange, setPriceRange] = useState([1000, 50000]);
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const Category = ['한식','양식','중식','일식','분식','기타','카페','맥주/소주','막걸리','와인','위스키','칵테일','실내','실외','게임/오락','힐링','방탈출','클래스','영화','전시','책방'];
  const FoodNum = 6;
  const DrinkNum = 12;
  const ActivityNum = 21;

  const sendToResult = async () => {
    navigation.navigate('Result', {
      priceRange: priceRange,
      selectedTags: selectedTags,
      selectedCategory: selectedCategory
    });
  }


  // 태그 선택
  const selectTag = (tag: Tag) => {
    // 태그 선택 시 현재 시각과 랜덤 값을 조합하여 고유 ID 생성
    const newTag: SelectedTag = {
      ...tag,
      id: `${tag.key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setSelectedTags((prevSelectedTags) => [...prevSelectedTags, newTag]);
  };
  // 태그 삭제
  const removeTag = (id: string) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.filter((tag) => tag.id !== id)
    );
  };

  // 선택 가능한 태그 렌더링
  const renderTag = ({ item }: { item: Tag }) => (
    <TouchableOpacity style={styles.tag} onPress={() => selectTag(item)}>
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.tagText}>{item.key}</Text>
    </TouchableOpacity>
  );
  // 선택된 태그 렌더링
  const renderSelectedTag = ({ item, index }: { item: SelectedTag; index: number }) => (
    <View style={styles.selectedTag}>
      <Image source={item.icon2} style={styles.icon} />
      <TouchableOpacity onPress={() => removeTag(item.id)}>
        <Text style={styles.removeIcon}>x</Text>
      </TouchableOpacity>
    </View>
  );
  const multiSliderValuesChange = (values: number[]) => setPriceRange(values);

  //카테고리
  const handleButtonPress = (value: string) => {
    setSelectedCategory(prevActiveButtons => {
      if (prevActiveButtons.includes(value)) {
        // 이미 선택된 버튼을 다시 클릭하면 선택 해제
        return prevActiveButtons.filter(button => button !== value);
      } else {
        // 선택되지 않은 버튼을 클릭하면 선택
        return [...prevActiveButtons, value];
      }
    });
  };

  // 선택된 버튼에 따라 스타일을 결정하는 함수
  const getButtonStyle = (value: string) => {
    return {
      ...styles.categoryTag, // 기존 categoryTag 스타일을 적용
      backgroundColor: selectedCategory.includes(value) ? '#2FDBBC' : '#ffffff', // 선택된 상태에 따라 배경색 변경
    };
  };
  return (
    <View style={tw`flex-1 bg-white px-4 py-4`}>
      <Text
            style={{
              marginBottom: 5,
              fontFamily: "BM-HANNAStd",
              fontSize: 16,
              marginRight: 5,
            }}
          >
            선호가격대
          </Text>
      <MultiSlider
        values={priceRange}
        sliderLength={370}
        onValuesChange={multiSliderValuesChange}
        min={10000}
        max={200000}
        step={10000}
        allowOverlap={false}
        minMarkerOverlapDistance={10}
        snapped
        selectedStyle={styles.selectedTrack}
        unselectedStyle={styles.unselectedTrack}
        containerStyle={styles.sliderContainer}
        trackStyle={styles.track}
        touchDimensions={styles.touchDimensions}
        customMarkerLeft={() => (
          <View style={tw`h-5 w-5 rounded-full bg-blue-600`} />
        )}
        customMarkerRight={() => (
          <View style={tw`h-5 w-5 rounded-full bg-red-600`} />
        )}
      />
      <View style={{
            height: 70,
            flexDirection: 'row',
            justifyContent: 'space-between',
      }
        
      }>
        <Text style={tw`text-lg`}>{`${priceRange[0].toLocaleString()} 원`}</Text>
        <Text style={tw`text-lg`}>{`${priceRange[1].toLocaleString()} 원`}</Text>
      </View>
      <Text
            style={{
              marginBottom: 15,
              fontFamily: "BM-HANNAStd",
              fontSize: 16,
              marginRight: 5,
            }}
          >
            데이트장소를 순서대로 선택해주세요
          </Text>

      <View style={styles.container}>
        <FlatList
          data={tagsData}
          renderItem={renderTag}
          keyExtractor={(item) => item.key}
          horizontal
        />
        <FlatList
          data={selectedTags}
          renderItem={renderSelectedTag}
          keyExtractor={(item, index) => index.toString()} // 여기를 수정했습니다.
          horizontal
        />
      </View>
      <Text
            style={{
              marginBottom: 15,
              fontFamily: "BM-HANNAStd",
              fontSize: 16,
              marginRight: 5,
            }}
          >
            데이트 코스 취향을 선택해주세요
          </Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
      <Text style={styles.categoryText}>식사</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
    {
      
    Category.slice(0, FoodNum).map((button) => (
      <TouchableOpacity
        key={button}
        style={getButtonStyle(button)}
        onPress={() => handleButtonPress(button)}
      >
        <Text>{button}</Text>
      </TouchableOpacity>
    ))
    
    }
</View>
</View>

<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
      <Text style={styles.categoryText}>마시기</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
    {
      
    Category.slice(FoodNum, DrinkNum).map((button) => (
      <TouchableOpacity
        key={button}
        style={getButtonStyle(button)}
        onPress={() => handleButtonPress(button)}
      >
        <Text>{button}</Text>
      </TouchableOpacity>
    ))
    
    }
</View>
</View>
<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
      <Text style={styles.categoryText}>활동</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
    {
      
    Category.slice(DrinkNum, DrinkNum+2).map((button) => (
      <TouchableOpacity
        key={button}
        style={getButtonStyle(button)}
        onPress={() => handleButtonPress(button)}
      >
        <Text>{button}</Text>
      </TouchableOpacity>
    ))
    
    }
</View>
</View>
<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
<Text style={styles.categoryText}></Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
    {
      
    Category.slice(DrinkNum+2, ActivityNum).map((button) => (
      <TouchableOpacity
        key={button}
        style={getButtonStyle(button)}
        onPress={() => handleButtonPress(button)}
      >
        <Text>{button}</Text>
      </TouchableOpacity>
    ))
    
    }
</View>
</View>


    <TouchableOpacity
        style={[tw`rounded-full py-2 mb-4`, { backgroundColor: pointColor }]}
        onPress={sendToResult}
      >
        <Text style={tw`text-center text-white text-lg`}>CREATE CORSE</Text>

      </TouchableOpacity>
    </View>
    
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 3,
  },
  selectedTrack: {
    backgroundColor: '#2FDBBC',
  },
  unselectedTrack: {
    backgroundColor: '#CDE5E9',
  },
  sliderContainer: {
    height: 30,
    
  },
  track: {
    height: 10,
    borderRadius: 10,
  },
  touchDimensions: {
    height: 40,
    width: 40,
    borderRadius: 20,
    slipDisplacement: 40,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    height: 50,
    flex: 1, // 가로로 균등하게 피커들을 배분
  },
  tag: {
    backgroundColor:'#2FDBBC',
    width:85,
    height: 30,
    margin: 5,
    padding: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 배열합니다.
    alignItems: 'center',
  },
  selectedTag: {
    width:85,
    height: 40,
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 배열합니다.
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: 'contain'
    
  },
  removeIcon: {
    marginLeft: 5,
    color: 'red',
  },
  tagText: {
    color: 'white',},
  category:{
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    alignItems: 'center'

  },
  categoryTag : {
    width:85,
    height: 40,
    margin: 4,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    flexDirection: 'row', // 아이콘과 텍스트를 가로로 배열합니다.
    alignItems: 'center',
  },
  categoryText:{
    fontFamily: "BM-HANNAStd",
    backgroundColor: 'transparent',
    margin: 1, // 외부 여백
    padding: 1, // 내부 여백
    width: 20, // 박스의 너비
    textAlign: 'center', // 텍스트 중앙 정렬
    justifyContent: 'center', // 세로축에서도 중앙 정렬
    alignItems: 'center', // 가로축에서도 중앙 정렬
    display: 'flex', // flexbox를 사용한 정렬
  }
});

export default Search;