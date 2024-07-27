import React, { useRef, useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const images = [
  'https://hoalenhandmade.com/wp-content/uploads/2024/06/sieu-sale-sinh-nhat-hoa-len-handmade.jpg',
  'https://hoalenhandmade.com/wp-content/uploads/2023/06/Sieu-Uu-Dai-Hoa-Len-mai-yeu-1-1536x672.jpg',
  'https://hoalenhandmade.com/wp-content/uploads/2023/11/dan-moc-len-handmade.jpg',
  'https://hoalenhandmade.com/wp-content/uploads/2023/11/ho-tro-khach-hang-tan-tam.jpg',
  'https://hoalenhandmade.com/wp-content/uploads/2023/11/giam-gia-uu-dai.jpg',
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentIndex,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height:170 // Customize height as needed
  },
  image: {
    width: screenWidth,
    height: '100%',
    resizeMode: 'cover',
    borderRadius:20
    
  },
});

export default Slider;
