import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  Alert
} from 'react-native'

import React, {
  useEffect,
  useState
} from 'react'

// pakages imports
import Tts from 'react-native-tts';
import Clipboard from '@react-native-clipboard/clipboard';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Snackbar from 'react-native-snackbar';

// Main App starting 
const App = () => {

  // states 
  const [quote, setQuote] = useState<string>('Loading...')
  const [quoteAuthor, setQuoteAuthor] = useState<string>('Loading...')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)


  const speakNow = () => {
    try {
      setIsSpeaking(true)
      Tts.stop()
      Tts.speak(`${quote} by ${quoteAuthor}`);;
      // Tts.addEventListener('tts-start', () => );
      Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    } catch (error) {
      console.log(error);
    }
  }

  // Copy to clipboard botton pressed handler
  const copyToClipboard = () => {
    Clipboard.setString(quote);
    Snackbar.show({
      text: 'Quote copied!',
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  // Share botton pressed handler
  const onShare = async () => {
    try {
      await Share.share({
        message: quote,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  // getting random Quote from API call
  const getQuote = () => {
    setIsLoading(true)
    fetch('https://api.quotable.io/quotes/random?maxLength=130')
      .then(response => response.json())
      .then(result => {
        setQuote(result[0].content)
        setQuoteAuthor(result[0].author)
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  // for application starting time Api call 
  useEffect(() => {
    getQuote()
  }, [])

  

  return (
    // main container
    <View style={styles.container}>
      <StatusBar backgroundColor={'#5372f0'} barStyle={'light-content'} />
      {/* Qoute section container */}
      <View style={styles.mainSection}>
        {/* main heading */}
        <Text style={styles.headingText}>Quote of the Day</Text>
        {/* main Quote */}
        <Text style={styles.quoteText}>{quote}</Text>
        {/* Author name */}
        <Text style={styles.authorText}>{'---' + quoteAuthor}</Text>
        {/* new quote getting button */}
        <TouchableOpacity
          style={[styles.button, styles.elevation, { backgroundColor: isLoading ? 'rgba(83,114,240,0.7)' : 'rgba(83,114,240,1)' }]}
          activeOpacity={1}
          onPress={getQuote}
        >
          <Text style={[styles.buttonText]}>{isLoading ? 'Loading...' : 'New Qoute'}</Text>
        </TouchableOpacity>

        {/* Bottom icons container */}
        <View style={styles.iconContainer}>
          <TouchableOpacity style={[styles.bottomIcon, { backgroundColor: isSpeaking ? '#5372F0' : '#fff' }]} onPress={speakNow}>
            <FontAwesome5 name='volume-up' size={25} color={isSpeaking ? '#fff' : '#5372F0'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomIcon} onPress={copyToClipboard} activeOpacity={0.6}>
            <FontAwesome5 name='copy' size={25} color={'#5372F0'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bottomIcon]} onPress={onShare} activeOpacity={0.6}>
            <FontAwesome5 name='share-alt' size={25} color={'#5372F0'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default App
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5372F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainSection: {
    width: '90%',
    height: 'auto',
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20
  },
  headingText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 1.2,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  authorText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
    marginBottom: 10,
    fontStyle: 'italic',
    fontWeight: '500'
  },
  button: {
    padding: 15,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 40,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  bottomIcon: {
    borderWidth: 2,
    borderColor: '#5372F0',
    padding: 15,
    borderRadius: 50,

  },
  elevation: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  }
})