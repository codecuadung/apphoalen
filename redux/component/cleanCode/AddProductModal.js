import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

const AddProductModal = ({
  visible,
  tenSP, setTenSP,
  mieuTa, setMieuTa,
  image, setImage,
  giaSP, setGiaSP,
  loaiSP, setLoaiSP,
  giamGia, setGiamGia,
  kieuSP, setKieuSP,
  soLuong, setSoLuong,
  soLuongDanhGia, setSoLuongDanhGia,
  xepHang, setXepHang,
  onClose,
  onSave,
  setLoaiSPModalVisible,
  setKieuSPModalVisible,
  setXepHangModalVisible,
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!tenSP.trim()) {
      newErrors.tenSP = 'Tên sản phẩm là bắt buộc';
      setErrors(newErrors);
      return false;
    }
    if (!mieuTa.trim()) {
      newErrors.mieuTa = 'Miêu tả là bắt buộc';
      setErrors(newErrors);
      return false;
    }
    if (!image.trim()) {
      newErrors.image = 'Link hình ảnh là bắt buộc';
      setErrors(newErrors);
      return false;
    }
    if (!giaSP || isNaN(giaSP) || giaSP <= 0) {
      newErrors.giaSP = 'Giá sản phẩm phải là một số lớn hơn 0';
      setErrors(newErrors);
      return false;
    }
    if (!loaiSP) {
      newErrors.loaiSP = 'Loại sản phẩm là bắt buộc';
      setErrors(newErrors);
      return false;
    }
    if (giamGia && (isNaN(giamGia) || giamGia < 0 || giamGia > 100)) {
      newErrors.giamGia = 'Giảm giá phải là một số từ 0 đến 100';
      setErrors(newErrors);
      return false;
    }
    if (!kieuSP) {
      newErrors.kieuSP = 'Kiểu sản phẩm là bắt buộc';
      setErrors(newErrors);
      return false;
    }
    if (!soLuong || isNaN(soLuong) || soLuong <= 0) {
      newErrors.soLuong = 'Số lượng phải là một số lớn hơn 0';
      setErrors(newErrors);
      return false;
    }
    if (soLuongDanhGia && (isNaN(soLuongDanhGia) || soLuongDanhGia < 0)) {
      newErrors.soLuongDanhGia = 'Số lượng đánh giá phải là một số không âm';
      setErrors(newErrors);
      return false;
    }
    if (!xepHang) {
      newErrors.xepHang = 'Xếp hạng là bắt buộc';
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    const productData = {
      tenSP,
      mieuTa,
      image,
      giaSP: giaSP ? Number(giaSP) : null,
      loaiSP,
      giamGia: giamGia ? Number(giamGia) : null,
      kieuSP,
      soLuong: soLuong ? Number(soLuong) : null,
      soLuongDanhGia: soLuongDanhGia ? Number(soLuongDanhGia) : null,
      xepHang,
    };

    onSave(productData);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', marginTop: 50 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Thêm sản phẩm mới</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
            placeholder="Tên sản phẩm"
            value={tenSP}
            onChangeText={setTenSP}
          />
          {errors.tenSP && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.tenSP}</Text>}
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
            placeholder="Miêu tả"
            value={mieuTa}
            onChangeText={setMieuTa}
          />
          {errors.mieuTa && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.mieuTa}</Text>}
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
            placeholder="Link hình ảnh"
            value={image}
            onChangeText={setImage}
          />
          {errors.image && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.image}</Text>}
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
            placeholder="Giá sản phẩm"
            value={giaSP}
            onChangeText={setGiaSP}
            keyboardType="numeric"
          />
          {errors.giaSP && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.giaSP}</Text>}
          <TouchableOpacity
            onPress={() => setLoaiSPModalVisible(true)}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
          >
            <Text>{loaiSP || 'Chọn loại sản phẩm'}</Text>
          </TouchableOpacity>
          {errors.loaiSP && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.loaiSP}</Text>}
          <TouchableOpacity
            onPress={() => setKieuSPModalVisible(true)}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
          >
            <Text>{kieuSP || 'Chọn kiểu sản phẩm'}</Text>
          </TouchableOpacity>
          {errors.kieuSP && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.kieuSP}</Text>}
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
            placeholder="Giảm giá (%)"
            value={giamGia}
            onChangeText={setGiamGia}
            keyboardType="numeric"
          />
          {errors.giamGia && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.giamGia}</Text>}
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
            placeholder="Số lượng"
            value={soLuong}
            onChangeText={setSoLuong}
            keyboardType="numeric"
          />
          {errors.soLuong && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.soLuong}</Text>}
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
            placeholder="Số lượng đánh giá"
            value={soLuongDanhGia}
            onChangeText={setSoLuongDanhGia}
            keyboardType="numeric"
          />
          {errors.soLuongDanhGia && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.soLuongDanhGia}</Text>}
          <TouchableOpacity
            onPress={() => setXepHangModalVisible(true)}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
          >
            <Text>{xepHang || 'Chọn xếp hạng'}</Text>
          </TouchableOpacity>
          {errors.xepHang && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.xepHang}</Text>}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ backgroundColor: '#F26398', padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', flex: 1, marginRight: 5 }}
            >
              <Text style={{ color: 'white' }}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={{ backgroundColor: '#F26398', padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', flex: 1, marginLeft: 5 }}
            >
              <Text style={{ color: 'white' }}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddProductModal;
