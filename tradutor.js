import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';

const GOOGLE_API_KEY = 'AIzaSyC_6U3NNEmin5S4cfopBi1c38RZRwNls9o'; 

//declaração do componente hook
const SpeakApp = () => {
  const [entradaTexto, setEntradaTexto] = useState('');
  const [tradutorTexto, setTradutorTexto] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [imagemTradutorTexto, setImagemTradutorTexto] = useState('');
  
  const traduzirTexto = async (text, targetLanguage) => {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ${response.status}: ${errorData.error.message}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText; // Retornar o texto traduzido
    } catch (error) {
      console.error('Erro na tradução:', error.message);
      return null; // Retornar null em caso de erro
    }
  };


  const extrairTextoImagem = async (url) => { // extrai texto da imagem
    try {
      const imagemBase64 = await getBase64(url); //converte a imagem em uma string base64
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: imagemBase64 },
              features: [{ type: 'TEXT_DETECTION' }],
            }],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ${response.status}: ${errorData.error.message}`);
      }

      const data = await response.json();
      const text = data.responses[0].fullTextAnnotation?.text || 'Texto não encontrado';
      setImagemTradutorTexto(text); // Define o texto extraído diretamente

      // Traduz o texto extraído da imagem para o português
      const tradutorImagemTexto = await traduzirTexto(text, 'pt');
      if (tradutorImagemTexto) {
        setImagemTradutorTexto(tradutorImagemTexto); // Armazena a tradução na variável correta
      }

    } catch (error) {
      console.error('Erro ao extrair texto da imagem:', error.message);
      setImagemTradutorTexto('Erro ao processar a imagem.');
    }
  };

  const getBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); //FileReader - cpnverte o blob em uma string base64
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const envioImagem = () => {
    if (imagemUrl) {
      extrairTextoImagem(imagemUrl);
    } else {
      setImagemTradutorTexto('Insira uma URL válida da imagem.');
    }
  };

  const envioTexto = () => {
    if (entradaTexto) {
      traduzirTexto(entradaTexto, 'pt').then(translated => {
        if (translated) {
          setTradutorTexto(translated);
        }
      });
    } else {
      setTradutorTexto('Insira um texto válido para tradução.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Digite o texto para traduzir:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        onChangeText={setEntradaTexto}
        value={entradaTexto}
        placeholder="Digite aqui..."
      />
      <Button title="Traduzir para Português" onPress={envioTexto} color="green"/>

      <Text style={{ fontSize: 18, marginTop: 20 }}>Texto Traduzido:</Text>
      <Text style={{ fontSize: 16, color: 'blue', marginTop: 10 }}>{tradutorTexto}</Text>

      <Text style={{ fontSize: 20, marginTop: 20 }}>Ou insira a URL da imagem:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        onChangeText={setImagemUrl}
        value={imagemUrl}
        placeholder="Cole a URL da imagem aqui..."
      />
      <Button title="Traduzir Texto da Imagem" onPress={envioImagem} color="green"/>
      {imagemUrl ? <Image source={{ uri: imagemUrl }} style={{ width: 200, height: 200, marginTop: 10 }} /> : null}

      <Text style={{ fontSize: 18, marginTop: 20 }}>Texto Traduzido da Imagem:</Text>
      <Text style={{ fontSize: 16, color: 'blue', marginTop: 10 }}>{imagemTradutorTexto}</Text>
    </View>
  );
};

export default SpeakApp;

//imageUri