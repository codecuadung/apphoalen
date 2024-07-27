import React, { memo, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductItem from './ProductItem';

const SearchComponent = ({ title, products, role, navigation, onEdit, onDelete, cart }) => {
  useEffect(() => {
    // Log thuộc tính id của từng sản phẩm
    products.forEach(product => {
      console.log(product.id);
    });
  }, [products]); // Thực hiện khi products thay đổi

  return (
    <View style={[styles.container, { height: role === 'admin' ? 370 : 320 }]}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={products}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            role={role}
            navigation={navigation}
            onEdit={onEdit}
            onDelete={onDelete}
            cart={cart}
          />
        )}
        keyExtractor={(item) => item.id} // Đảm bảo id là chuỗi
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 10,
  },
});

export default memo(SearchComponent);
