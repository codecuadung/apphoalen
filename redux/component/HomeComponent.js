import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert, ActivityIndicator, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, fetchProductsByKieuSP } from '../slices/ProductSlice';
import { updateProduct, deleteProduct } from '../slices/CRUDSlice';
import Slider from '../../Component/Slider';
import auth from '@react-native-firebase/auth';
import AddProductModal from './cleanCode/AddProductModal';
import OptionModal from './cleanCode/OptionModal';
import ProductList from './cleanCode/ProductList';
import UpdateProductModal from './cleanCode/UpdateProductModal';
import HeaderComponent from './HeaderComponent';
import { searchProduct } from '../slices/SearchSlice';
import SearchComponent from './cleanCode/SearchComponent';

const HomeComponent = ({ navigation, cart }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loaiSPModalVisible, setLoaiSPModalVisible] = useState(false);
  const [kieuSPModalVisible, setKieuSPModalVisible] = useState(false);
  const [xepHangModalVisible, setXepHangModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const { items, filteredItems, status, error } = useSelector(state => state.SanPham);
  const searchStatus = useSelector(state => state.search.status);
  const searchError = useSelector(state => state.search.error);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState('none');
  const [tenSP, setTenSP] = useState('');
  const [mieuTa, setMieuTa] = useState('');
  const [image, setImage] = useState('');
  const [giaSP, setGiaSP] = useState(0);
  const [loaiSP, setLoaiSP] = useState('');
  const [giamGia, setGiamGia] = useState(0);
  const [kieuSP, setKieuSP] = useState('');
  const [soLuong, setSoLuong] = useState(0);
  const [soLuongDanhGia, setSoLuongDanhGia] = useState(0);
  const [xepHang, setXepHang] = useState(0);

  const [newProducts, setNewProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);

  const dispatch = useDispatch();

  const loaiSPOptions = ['Hoa len lẻ', 'Hoa len bó', 'Phụ kiện len', 'Len trang trí'];
  const kieuSPOptions = ['Sản phẩm mới', 'Sản phẩm nổi bật', 'Sản phẩm sale'];
  const xepHangOptions = ['1', '2', '3', '4', '5'];

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const idTokenResult = await user.getIdTokenResult();
        setRole(idTokenResult.claims.role || 'none');
      } else {
        setUser(null);
        setRole('none');
      }
    });
    return unsubscribe;
  }, []);

  const fetchProducts = async () => {
    const newProducts = await dispatch(fetchProductsByKieuSP('Sản phẩm mới')).unwrap();
    const featuredProducts = await dispatch(fetchProductsByKieuSP('Sản phẩm nổi bật')).unwrap();
    const saleProducts = await dispatch(fetchProductsByKieuSP('Sản phẩm sale')).unwrap();

    setNewProducts(newProducts);
    setFeaturedProducts(featuredProducts);
    setSaleProducts(saleProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  const resetFormFields = () => {
    setTenSP('');
    setMieuTa('');
    setImage('');
    setGiaSP(0);
    setLoaiSP('');
    setGiamGia(0);
    setKieuSP('');
    setSoLuong(0);
    setSoLuongDanhGia(0);
    setXepHang(0);
  };

  const handleAddProduct = async () => {
    const newProduct = {
      tenSP,
      mieuTa,
      image,
      giaSP,
      loaiSP,
      giamGia,
      kieuSP,
      soLuong,
      soLuongDanhGia,
      xepHang,
    };
    await dispatch(addProduct(newProduct)).unwrap();
    setModalVisible(false);
    resetFormFields();
    fetchProducts();
  };

  const handleUpdateProduct = async () => {
    const updatedProduct = {
      ...selectedProduct,
      tenSP,
      mieuTa,
      image,
      giaSP,
      loaiSP,
      giamGia,
      kieuSP,
      soLuong,
      soLuongDanhGia,
      xepHang,
    };
    await dispatch(updateProduct(updatedProduct)).unwrap();
    setUpdateModalVisible(false);
    fetchProducts();
  };

  const handleSelectOption = (option, setOption, closeModal) => {
    setOption(option);
    closeModal(false);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setTenSP(product.tenSP);
    setMieuTa(product.mieuTa);
    setImage(product.image);
    setGiaSP(product.giaSP);
    setLoaiSP(product.loaiSP);
    setGiamGia(product.giamGia);
    setKieuSP(product.kieuSP);
    setSoLuong(product.soLuong);
    setSoLuongDanhGia(product.soLuongDanhGia);
    setXepHang(product.xepHang);
    setUpdateModalVisible(true);
  };

  const handleDelete = (product) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sản phẩm này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            await dispatch(deleteProduct(product.id)).unwrap();
            fetchProducts();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập từ khóa tìm kiếm');
      return;
    }

    try {
      const results = await dispatch(searchProduct(searchTerm)).unwrap();
      setSearchResults(results);
      if (results.length === 0) {
        Alert.alert('Không có sản phẩm phù hợp');
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình tìm kiếm');
    }
  };

  const handleBack = () => {
    setSearchResults([]);
  };

  if (status === 'loading' || searchStatus === 'loading') {
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

  if (searchStatus === 'failed') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{searchError}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <HeaderComponent email={cart.replace(/@gmail\.com$/, '')} onSearch={handleSearch} />
      {role === 'admin' && (
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 110, right: 20, zIndex: 1, backgroundColor: '#FF714B', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>+</Text>
        </TouchableOpacity>
      )}
      <ScrollView style={{ flex: 1 }}>
        {searchResults.length > 0 ? (
          <View style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity onPress={handleBack}>
              <Image source={require('../../img/back.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
            </TouchableOpacity>
            <SearchComponent
              title="Kết quả tìm kiếm"
              products={searchResults}
              role={role}
              navigation={navigation}
              onEdit={handleEdit}
              onDelete={handleDelete}
              cart={cart}
            />
          </View>
        ) : (
          <>
            <Slider />
            <View style={{ paddingHorizontal: 10 }}>
              <ProductList title="Sản phẩm mới" products={newProducts} role={role} navigation={navigation} onEdit={handleEdit} onDelete={handleDelete} cart={cart} />
              <ProductList title="Sản phẩm nổi bật" products={featuredProducts} role={role} navigation={navigation} onEdit={handleEdit} onDelete={handleDelete} cart={cart} />
              <ProductList title="Sản phẩm sale" products={saleProducts} role={role} navigation={navigation} onEdit={handleEdit} onDelete={handleDelete} cart={cart} />
            </View>
          </>
        )}
      </ScrollView>

      <AddProductModal
        visible={modalVisible}
        tenSP={tenSP} setTenSP={setTenSP}
        mieuTa={mieuTa} setMieuTa={setMieuTa}
        image={image} setImage={setImage}
        giaSP={giaSP} setGiaSP={setGiaSP}
        loaiSP={loaiSP} setLoaiSP={setLoaiSP}
        giamGia={giamGia} setGiamGia={setGiamGia}
        kieuSP={kieuSP} setKieuSP={setKieuSP}
        soLuong={soLuong} setSoLuong={setSoLuong}
        soLuongDanhGia={soLuongDanhGia} setSoLuongDanhGia={setSoLuongDanhGia}
        xepHang={xepHang} setXepHang={setXepHang}
        onClose={() => {
          setModalVisible(false);
          resetFormFields();
        }}
        onSave={handleAddProduct}
        setLoaiSPModalVisible={() => setLoaiSPModalVisible(true)}
        setKieuSPModalVisible={() => setKieuSPModalVisible(true)}
        setXepHangModalVisible={() => setXepHangModalVisible(true)}
      />

      <OptionModal
        visible={loaiSPModalVisible}
        options={loaiSPOptions}
        onSelect={(option) => handleSelectOption(option, setLoaiSP, setLoaiSPModalVisible)}
        onClose={() => setLoaiSPModalVisible(false)}
      />

      <OptionModal
        visible={kieuSPModalVisible}
        options={kieuSPOptions}
        onSelect={(option) => handleSelectOption(option, setKieuSP, setKieuSPModalVisible)}
        onClose={() => setKieuSPModalVisible(false)}
      />

      <OptionModal
        visible={xepHangModalVisible}
        options={xepHangOptions}
        onSelect={(option) => handleSelectOption(option, setXepHang, setXepHangModalVisible)}
        onClose={() => setXepHangModalVisible(false)}
      />

      <UpdateProductModal
        visible={updateModalVisible}
        tenSP={tenSP} setTenSP={setTenSP}
        mieuTa={mieuTa} setMieuTa={setMieuTa}
        image={image} setImage={setImage}
        giaSP={giaSP} setGiaSP={setGiaSP}
        loaiSP={loaiSP} setLoaiSP={setLoaiSP}
        giamGia={giamGia} setGiamGia={setGiamGia}
        kieuSP={kieuSP} setKieuSP={setKieuSP}
        soLuong={soLuong} setSoLuong={setSoLuong}
        soLuongDanhGia={soLuongDanhGia} setSoLuongDanhGia={setSoLuongDanhGia}
        xepHang={xepHang} setXepHang={setXepHang}
        onClose={() => {
          setUpdateModalVisible(false);
          resetFormFields();
        }}
        onSave={handleUpdateProduct}
        setLoaiSPModalVisible={() => setLoaiSPModalVisible(true)}
        setKieuSPModalVisible={() => setKieuSPModalVisible(true)}
        setXepHangModalVisible={() => setXepHangModalVisible(true)}
      />
    </View>
  );
};

export default HomeComponent;
