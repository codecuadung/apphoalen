import React from 'react';
import HomeComponent from '../redux/component/HomeComponent';

const HomeScreen = ({route}) => {
  console.log(route.params.cart)
  return (
      <HomeComponent cart={route.params.cart}/>
  );
};

export default HomeScreen;
