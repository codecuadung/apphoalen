import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByLoaiSP, fetchProducts, clearProducts } from '../slices/ProductSlice';
import { useNavigation } from '@react-navigation/native';

const ProductComponent = ({cart}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const { items, filteredItems, status, error } = useSelector(state => state.SanPham);

  const [productsCache, setProductsCache] = useState({});
  const [productsToDisplay, setProductsToDisplay] = useState([]);

  useEffect(() => {
    if (selectedCategory === 'Tất cả') {
      if (!productsCache['Tất cả']) {
        dispatch(fetchProducts());
      } else {
        setProductsToDisplay(productsCache['Tất cả']);
      }
    } else {
      if (!productsCache[selectedCategory]) {
        dispatch(fetchProductsByLoaiSP(selectedCategory));
      } else {
        setProductsToDisplay(productsCache[selectedCategory]);
      }
    }
  }, [selectedCategory, dispatch, productsCache]);

  useEffect(() => {
    if (status === 'succeeded') {
      if (selectedCategory === 'Tất cả') {
        setProductsCache(prevCache => ({ ...prevCache, 'Tất cả': items }));
        setProductsToDisplay(items);
      } else {
        setProductsCache(prevCache => ({ ...prevCache, [selectedCategory]: filteredItems }));
        setProductsToDisplay(filteredItems);
      }
    }
  }, [status, selectedCategory, items, filteredItems]);

  const handleCategoryPress = useCallback((category) => {
    setProductsToDisplay([]); // Reset the displayed products before loading new data
    setSelectedCategory(category);
    dispatch(clearProducts()); // Clear the products before fetching new ones
  }, [dispatch]);

  const renderCategoryItem = useCallback((category) => (
    <TouchableOpacity 
      key={category}
      onPress={() => handleCategoryPress(category)}
      style={{
        backgroundColor: selectedCategory === category ? '#FFC0CB' : 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
      }}
    >
      <Text style={{ fontWeight: selectedCategory === category ? 'bold' : 'normal' }}>
        {category}
      </Text>
    </TouchableOpacity>
  ), [selectedCategory, handleCategoryPress]);

  const renderProductItem = useCallback(({ item }) => (
    <View style={{ width: 180, height: 330, marginHorizontal: 5 }}>
      <Image style={{ resizeMode: 'cover', width: '100%', height: 185 }} source={{ uri: item.image }} />
      <View style={{ height: 50 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F26398' }} numberOfLines={2} ellipsizeMode="tail">{item.tenSP}</Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>Giá: {item.giaSP}đ</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('DetailScreen', { selectedItem: item,cart })} style={{ backgroundColor: '#F26398', padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: 'white' }}>Xem thêm</Text>
      </TouchableOpacity>
    </View>
  ), [navigation]);

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, margin: 15 }}>
      <View style={{ width: '100%', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderCategoryItem('Tất cả')}
            {renderCategoryItem('Hoa len lẻ')}
            {renderCategoryItem('Hoa len bó')}
            {renderCategoryItem('Phụ kiện len')}
            {renderCategoryItem('Len trang trí')}
          </ScrollView>
        </View>

        <FlatList
          data={productsToDisplay}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderProductItem}
        />
      </View>
    </View>
  );
};

export default ProductComponent;
