
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect, sendMessage } from './mqtt2';

export default function App() {
  const [ message, setMessage] = useState();
  const [ topic, setTopic] = useState('teste');

  useEffect(()=>{
    connect();
  }, [])

  const handleSend=()=>{
    sendMessage(topic, message);  
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topo}> 
        <Text style={styles.titulo}>ALERTAS DE SISTEMA</Text>
        <Image source={require('./assets/logo.png')} style={styles.logo} />        
      </View>
      <View style={styles.body}>
        <Text style={styles.subtitulo}>ALARMES</Text>
        <TextInput style={styles.input}
          placeholder='topic'
          value={topic}
          onChangeText={setTopic}
        />

        <TextInput style={styles.input}
          placeholder='message'
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.botao} onPress={handleSend}>
          <Text style={styles.botaoTexto}>
            Enviar
          </Text>
        </TouchableOpacity >
        <StatusBar style="auto" />
      </View>

      <View>
        <Text style={styles.lista}>Lista de alarmes</Text>
        <View>
        </View>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 120,  
    resizeMode: 'contain', // ajusta a imagem sem cortar
    //marginBottom: 20,      // espaço abaixo da imagem
  },
  topo: {
    width: '100%',
    height: 80,
    backgroundColor: '#c7c7c7ff',
    marginTop: 0,
    flexDirection: "row", 
    justifyContent: "space-around", // alinha no eixo principal
    alignItems: "center",     // alinha no eixo cruzado
    marginTop: 40,
    
  },
  body:{
    width: '90%',
    flexDirection: "column",  // alinha no eixo principal
    alignItems: "center",     // alinha no eixo cruzado
    marginTop: 20,
  },

  titulo: {
    color: '#353535ff',
    fontSize: 20,
    fontWeight: 500,
  },
  subtitulo: {
    color: '#353535ff',
    fontSize: 20,
    marginTop: 20,
    fontWeight: 500,
    
  },
  input:{
    backgroundColor: '#eee',
    width: '100%',
    margin: 10,
    fontSize: 18,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  botao:{
    width: '100%',
    backgroundColor: '#5b86ffff',
    fontWeight: 500,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  botaoTexto:{
    fontSize: 20
  },
  lista:{
    fontSize: 20,
    marginTop: 20
  }

});
