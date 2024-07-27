import React from 'react';
import { Modal, Text, TouchableOpacity, View, FlatList } from 'react-native';

const OptionModal = ({ visible, options, onSelect, onClose }) => {
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      >
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
          <FlatList
            data={options}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelect(item)} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 18 }}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default OptionModal;
