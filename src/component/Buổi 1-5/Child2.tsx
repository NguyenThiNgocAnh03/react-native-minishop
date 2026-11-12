import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useState,useRef } from 'react';

type Props = {
  aProp: string;
  bProp: string;
  demProp: number;
  handleReceiveData: (newA: string, newB: string) => void;
};

const ChildComponent = ({ aProp, bProp, demProp, handleReceiveData }: Props) => {
    const [a, setA] = useState('')
    const [b, setB] = useState('')

    const [result, setResult] = useState('')
    const inputRef = useRef<TextInput>(null);
    //gán aProp và bProp vào a và b khi nhận được props mới
    useEffect(() => {
        setA(aProp);
        setB(bProp);
    }, [aProp, bProp,demProp]);
    const onGiai = () => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (isNaN(numA) || isNaN(numB)) {
            Alert.alert('Vui lòng nhập số hợp lệ cho hệ số A và B.');
            return;
        }
        if (numA === 0) {
            if (numB === 0) {
                setResult('Phương trình có vô số nghiệm.');
            } else {
                setResult('Phương trình vô nghiệm.');
            }
        } else {
            const x = -numB / numA;
            setResult(`Nghiệm của phương trình là:\n x = ${x.toFixed(2)}`);
        }
    };
   
   
    const onClear = () => {
        setA('');
        setB('');
        setResult('');
        inputRef.current?.focus();
    }
  return (

    <View>
      <Text style={{textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>{aProp} và {bProp} nhận từ cha</Text>
      <Text style={{textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>Child</Text>
      <TextInput style={styles.input}
          ref={inputRef}
          placeholder="Nhập hệ số A"
          keyboardType="numeric"
          value={a}
          onChangeText={setA}      
        />
        <TextInput style={styles.input}
          placeholder="Nhập hệ số B"
          keyboardType="numeric"
          value={b}
          onChangeText={setB}
   
        />
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
        <TouchableOpacity style= {styles.button}  onPress={onGiai} >
                <Text style={styles.buttonText}>Giải pt</Text>
        </TouchableOpacity>
        <TouchableOpacity style= {styles.button}  onPress={onClear} >
                <Text style={styles.buttonText}>Xóa</Text>        
        </TouchableOpacity>
        <TouchableOpacity style= {[styles.button, { width: '50%'}]} onPress={() => handleReceiveData(a, b)} >
                <Text style={styles.buttonText}>Truyền cha</Text>        
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default ChildComponent

const styles = StyleSheet.create({
    input: {
        padding: 10,
        margin: 2,
        borderRadius: 5,
        backgroundColor: '#f3c5c5da',
        color: '#0e0d0d',
        fontSize: 28,
    },
    button: {
        backgroundColor: '#00daf2',
        width: '20%',
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    buttonText : {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    },
    resultContainer: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
})