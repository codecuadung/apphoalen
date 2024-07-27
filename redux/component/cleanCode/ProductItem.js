import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductItem = ({ item, role, onEdit, onDelete, cart }) => {
  const navigation = useNavigation();

  return (
    <View style={{ width: 150, height: 400, marginHorizontal: 5 }}>
      <Image style={{ resizeMode: 'cover', width: '100%', height: 155 }} source={{ uri: item.image }} />
      <View style={{ height: 40 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F26398' }} numberOfLines={2} ellipsizeMode="tail">{item.tenSP}</Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 5 }}>Giá: {item.giaSP}đ</Text>
      </View>
      <TouchableOpacity 
        onPress={() => navigation.navigate('DetailScreen', { selectedItem: item, cart })} 
        style={{ backgroundColor: '#F26398', padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ fontSize: 18, color: 'white' }}>Xem thêm</Text>
      </TouchableOpacity>
      {role === 'admin' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <TouchableOpacity onPress={() => onEdit(item)} style={{ backgroundColor: '#F26398', padding: 10, borderRadius: 5, flex: 1, alignItems: 'center', marginRight: 5 }}>
            <Text style={{ color: 'white' }}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item)} style={{ backgroundColor: '#F26398', padding: 10, borderRadius: 5, flex: 1, alignItems: 'center', marginLeft: 5 }}>
            <Text style={{ color: 'white' }}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProductItem;
