import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tradutor from './tradutor'

const Stack = createNativeStackNavigator();//gerencia a navegação entre telas

// Componente TelaFundo - Gerencia a troca de fundo
const TelaFundo = ({ children }) => {
  const images = [
    require('./assets/cristo.jpg'),
    require('./assets/liberdade.jpg'),
    require('./assets/la.jpg'),
    require('./assets/eiffel.jpg'),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ImageBackground
      source={images[currentImageIndex]}
      style={styles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
};

// Componente Entrar - Tela inicial com botão para navegar
function Entrar({ navigation }) {
  return (
    <TelaFundo>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate('Speak Easy School')}>
          <Text style={styles.buttontxt}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </TelaFundo>
  );
}

// Componente principal tela
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Entrar">
        <Stack.Screen name="Entrar" component={Entrar} options={{ headerShown: false }} />
        <Stack.Screen name="Speak Easy School" component={tradutor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos para todos os componentes
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '100%',
    
  },

  buttontxt: {
    marginTop: 20,
    backgroundColor: 'black',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    textAlign: 'margin top',
    fontSize: 30,
  },
  greetingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  
});