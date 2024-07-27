import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProductComponent from '../redux/component/ProductComponent'
const ProductScreen = ({route}) => {
  console.log(route.params.cart)
  return (
      <ProductComponent cart={route.params.cart}/>
  )
}

export default ProductScreen

const styles = StyleSheet.create({})