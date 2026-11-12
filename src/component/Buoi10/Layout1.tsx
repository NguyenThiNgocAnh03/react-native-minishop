import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Layout1 = () => {
  return (
    <View style={{ flex: 1 }}>
      
      <View
        style={{ flex: 1, backgroundColor: '#93c1db', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'black', borderColor: 'black', flexDirection: 'row' }}
      >
        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: 'black' }}>
          <Text>Layout1</Text>
        </View>
        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: 'black' }}>
          <Text>Layout1</Text>
        </View>
        
        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
           {/* Đã sửa đường dẫn từ 3 lần ../ thành 1 lần ../ để đúng với thư mục trong component */}
           <Image style={{ position: 'absolute', width: '100%', height: '100%' }} source={require('../assets/images/banner.jpg')} />
          <Text>Layout1</Text>
        </View>
      </View>
      
      <View
        style={{ flex: 3, backgroundColor: '#e185ca', justifyContent: 'center', alignItems: 'center' }}
      >
        <Text>Layout2</Text>
      </View>
      
      <View
        style={{ flex: 1, backgroundColor: '#b6e232', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'black', borderColor: 'black', flexDirection: 'row' }}
      >
        {/* Đã xoá thẻ View rỗng thừa ở đây để 4 cột không bị co lệch */}
        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: 'black' }}>
          <Text>Layout3</Text>
        </View>
        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: 'black' }}>
          <Text>Layout3</Text>
        </View>
        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: 'black' }}>
          <Text>Layout3</Text>
        </View>
        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Layout3</Text>
        </View>
       
      </View>
        
    </View>
  )
}

export default Layout1;