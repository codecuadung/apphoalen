import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const HeaderComponent = ({ email, onSearch }) => {
  const navigation = useNavigation();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('InforScreen', { email: email })}>
        <Image style={styles.icon} source={require('../../img/person.png')} />
      </TouchableOpacity>

      {isSearching ? (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Image style={styles.searchIcon} source={require('../../img/search.png')} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Hoa len</Text>
          <Text style={styles.subtitle}>Handmade</Text>
        </View>
      )}

      <TouchableOpacity onPress={() => setIsSearching(!isSearching)}>
        {isSearching ? (
          <Image style={styles.icon} source={require('../../img/close.png')} />
        ) : (
          <Image style={styles.icon} source={require('../../img/search.png')} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F26398',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginRight: 10,
  },
  searchIcon: {
    width: 30,
    height: 30,
  },
});
