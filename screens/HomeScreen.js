// screens/HomeScreen.js

import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
  Animated,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Keyboard,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Menu } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ExpenseContext } from '../context/ExpenseContext';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
/* ─────────────── for voice message ─────────────── */
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';


/* ─────────────── constants ─────────────── */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const INFO_PANEL_WIDTH = 300;
const INFO_PANEL_MAX_HEIGHT = 350;

const WELCOME_CONTENT = {
  question: 'What can I help you with?'
};

const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5678' 
  : 'http://localhost:5678';

/* ─────────────── Main Component ─────────────── */
export default function HomeScreen({ route }) {
/* ─────────────── hooks and contents ─────────────── */
  const navigation = useNavigation();
  const { addExpense, expenses } = useContext(ExpenseContext);
  const { user } = useContext(UserContext);
  const userName = user?.name?.trim() || route.params?.name?.trim() || 'guest';

  // Don't render if no user - AuthWrapper will handle navigation
  if (!user || !user.name) {
    return null;
  }

/* ─────────────── state ─────────────── */
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDates, setExpandedDates] = useState({});
  const [inputHeight, setInputHeight] = useState(48); // default height
  const maxHeight = 120; // around 5 lines depending on font size
  /* ─────────────── for voice message ─────────────── */
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingWaveform, setRecordingWaveform] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const recordingIntervalRef = useRef(null);

/* ─────────────── refs ─────────────── */
  const flatListRef = useRef(null);
  const slideSidebarAnim = useRef(new Animated.Value(-INFO_PANEL_WIDTH)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

/* ─────────────── animations ─────────────── */
  const interpolatedOverlayOpacity = slideSidebarAnim.interpolate({
    inputRange: [-INFO_PANEL_WIDTH, 0],
    outputRange: [0, 0.35],
    extrapolate: 'clamp',
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const groupedExpenses = useMemo(() => {
    return expenses.reduce((acc, item) => {
      const dateKey = item.date;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [expenses]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedExpenses).sort((a, b) => {
      return new Date(b) - new Date(a);
    });
  }, [groupedExpenses]);

/* ─────────────── effects ─────────────── */
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    let intervalId;
    
    if (isRecording && !isPaused) {
      intervalId = setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [isRecording, isPaused, recording]);

/* ─────────────── handlers ─────────────── */
  const updateMessageStatus = (id, newStatus) =>
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, status: newStatus } : m))
    );

  const looksLikeExpense = text => {
    const parts = text.split('-');
    if (parts.length !== 2) return false;
    const amount = parseFloat(parts[1].trim());
    return parts[0].trim().length > 0 && !isNaN(amount);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return 'document';
    
    const type = mimeType.split('/')[0];
    const subtype = mimeType.split('/')[1];
    
    switch(type) {
      case 'image': return 'image';
      case 'video': return 'videocam';
      case 'audio': return 'musical-notes';
      case 'application':
        if (subtype.includes('pdf')) return 'document-text';
        if (subtype.includes('zip')) return 'folder';
        if (subtype.includes('word')) return 'document-text';
        if (subtype.includes('excel')) return 'document-text';
        if (subtype.includes('powerpoint')) return 'document-text';
        return 'document';
      default: return 'document';
    }
  };

/* ─────────────── menu handlers ─────────────── */
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    
    Animated.timing(rotateAnim, {
      toValue: menuVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    setMenuVisible(false);
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleSidebar = () => {
    Keyboard.dismiss(); // <--- This line dismisses the keyboard

    const sidebarTo = isSidebarOpen ? -INFO_PANEL_WIDTH : 0;

    Animated.timing(slideSidebarAnim, {
      toValue: sidebarTo,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setIsSidebarOpen(!isSidebarOpen));
  };

/* ─────────────── message handlers ─────────────── */
  const sendMessage = async (retryMsg) => {
    // Handle file attachments
    if (attachments.length > 0) {
      setIsLoading(true);
      try {
        const data = new FormData();
        data.append('type', 'attachments');
        data.append('date', new Date().toISOString());
        
        attachments.forEach((file, index) => {
          data.append(`file${index}`, {
            uri: file.uri,
            type: file.mimeType || 'application/octet-stream',
            name: file.name || `file${index}`,
          });
        });

        const res = await axios.post(`${API_BASE_URL}/webhook-test/papi-finance`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'bot',
            text: res.data.answer || `📁 Sent ${attachments.length} files`,
            status: 'sent',
          },
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: '⚠️ Could not send files',
            status: 'sent',
          },
        ]);
      } finally {
        setIsLoading(false);
        setAttachments([]);
      }
      return;
    }

    // Handle text messages
    const trimmed = retryMsg ? retryMsg.text : entry.trim();
    if (!trimmed) return;

    const timestamp = Date.now();
    const userMsg = retryMsg ?? {
      id: timestamp.toString(),
      sender: 'user',
      text: trimmed,
      status: 'sending',
    };

    if (!retryMsg) {
      setMessages(prev => [...prev, userMsg]);
      setEntry('');
    } else {
      updateMessageStatus(userMsg.id, 'sending');
    }

    // Handle expense format
    if (looksLikeExpense(trimmed)) {
      const [catRaw, amtRaw] = trimmed.split('-');
      addExpense({
        type: 'text',
        value: catRaw.trim().toLowerCase(),
        amount: parseFloat(amtRaw.trim()),
        date: new Date().toLocaleDateString(),
      });

      updateMessageStatus(userMsg.id, 'sent');
      setMessages(prev => [
        ...prev,
        {
          id: (timestamp + 1).toString(),
          sender: 'bot',
          text: '✅ Expense added.',
          status: 'sent',
        },
      ]);
      return;
    }

    // Send to API
    setIsLoading(true);
    try {
      const apiUrl = Platform.OS === 'android'
        ? `${API_BASE_URL}/webhook-test/papi-finance`
        : `${API_BASE_URL}/webhook/papi-finance`;

      const res = await axios.post(
        apiUrl,
        { message: trimmed, sessionId: userName },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botText =
        res.data.answer?.trim() ||
        (typeof res.data === 'string' ? res.data : JSON.stringify(res.data));

      updateMessageStatus(userMsg.id, 'sent');
      setMessages(prev => [
        ...prev,
        {
          id: (timestamp + 1).toString(),
          sender: 'bot',
          text: botText,
          status: 'sent',
        },
      ]);
    } catch (err) {
      updateMessageStatus(userMsg.id, 'failed');
      setMessages(prev => [
        ...prev,
        {
          id: (timestamp + 1).toString(),
          sender: 'bot',
          text: '⚠️ Could not reach service.',
          status: 'sent',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

/* ─────────────── handlers ─────────────── */
  const handleCamera = async () => {
    closeMenu();
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      base64: false,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const image = result.assets[0];
    const newImageAttachment = {
      type: 'image',
      uri: image.uri,
      name: image.fileName || `camera_${Date.now()}.jpg`,
      mimeType: image.mimeType || 'image/jpeg'
    };

    setAttachments(prev => [...prev, newImageAttachment]);
  };

  const handleGallery = async () => {
    closeMenu();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });
      
      if (!result.canceled) {
        const newImages = result.assets.map(asset => ({
          type: 'image',
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          mimeType: asset.mimeType || 'image/jpeg'
        }));
        setAttachments(prev => [...prev, ...newImages]);
      }
    } catch (err) {
      console.log('Gallery picker error:', err);
      Alert.alert('Error', 'An error occurred while selecting images.');
    }
  };

  const handleFilePicker = async () => {
    closeMenu();
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const files = result.assets;
        const newFiles = files.map(file => ({
          type: 'file',
          uri: file.uri,
          name: file.name || `file_${Date.now()}`,
          size: file.size || null,
          mimeType: file.mimeType || 'application/octet-stream',
        }));

        if (newFiles.length > 0) {
          setAttachments(prev => [...prev, ...newFiles]);
        } else {
          Alert.alert('Upload Failed', 'No valid files were selected.');
        }
      }
    } catch (err) {
      console.log('Document picker error:', err);
      Alert.alert('Error', 'An unexpected error occurred while selecting files.');
    }
  };

  /* ─────────────── voice message handlers ─────────────── */
  const handleVoice = async (voiceUri) => {
    closeMenu();
    
    // If we're already recording, stop first
    if (isRecording) {
      await stopRecording();
      return;
    }
    
    // If we have a recording ready to send
    if (voiceUri) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('sessionId', userName);
        formData.append('type', 'voice');
        formData.append('file', {
          uri: voiceUri,
          name: 'voice.aac',
          type: 'audio/aac',
        });

        const res = await axios.post(`${API_BASE_URL}/webhook-test/papi-finance`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: res.data.answer || '🎤 Voice message sent.',
            status: 'sent',
          },
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: '❌ Could not send voice message.',
            status: 'sent',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Otherwise start a new recording
    await startRecording();
  };

const startRecording = async () => {
  try {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(recording);
    setIsRecording(true);
    setRecordingDuration(0);
    setRecordingWaveform([]);

    // Start waveform interval
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => {
        const newDuration = prev + 0.1;
        setRecordingWaveform(prevWave => {
          const newWave = [...prevWave, Math.random() * 40 + 10];
          return newWave.length > 20 ? newWave.slice(1) : newWave;
        });
        return newDuration;
      });
    }, 100);
  } catch (err) {
    console.error('Failed to start recording', err);
    Alert.alert('Error', 'Failed to start recording');
  }
};

const stopRecording = async () => {
  try {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

    const uri = recording.getURI();
    setRecordingUri(uri);
    setIsRecording(false);
    setRecording(null);

    // Cleanup interval
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  } catch (err) {
    console.error('Failed to stop recording', err);
  }
};

const pauseRecording = async () => {
  if (!recording) return;
  
  try {
    if (isPaused) {
      await recording.startAsync();
    } else {
      await recording.pauseAsync();
    }
    setIsPaused(!isPaused);
  } catch (err) {
    console.error('Failed to pause/resume recording', err);
  }
};

  const deleteRecording = () => {
    setRecordingUri(null);
    if (recording) {
      recording.stopAndUnloadAsync();
      setRecording(null);
    }
    setIsRecording(false);
    setIsPaused(false);
    setRecordingDuration(0);
  };

  const sendRecording = async () => {
    if (!recordingUri) return;
    
    try {
      await handleVoice(recordingUri);
      deleteRecording();
    } catch (err) {
      console.error('Failed to send recording', err);
      Alert.alert('Error', 'Failed to send voice message');
    }
  };

  const Waveform = ({ waveform }) => (
  <View style={styles.waveformContainer}>
    {waveform.map((height, index) => (
      <View 
        key={index} 
        style={[
          styles.waveformBar,
          { height }
        ]}
      />
    ))}
  </View>
);

  const handleDrivePick = () => {
    closeMenu();
    const driveFile = {
      type: 'drive',
      uri: 'https://drive.google.com/file/d/abc123/view?usp=sharing',
      name: 'Quarterly_Report_Q3_2023.pdf',
      size: '2.4 MB',
      mimeType: 'application/pdf',
      lastModified: 'Oct 15, 2023',
      sharedBy: 'team@company.com'
    };
    setAttachments(prev => [...prev, driveFile]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

/* ─────────────── render methods ─────────────── */
  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={isUser ? styles.userText : styles.botText}>
          {item.text}
        </Text>
        {isUser && item.status === 'failed' && (
          <TouchableOpacity
            style={styles.resendBtn}
            onPress={() => sendMessage(item)}>
            <Ionicons name="refresh" size={16} color="#e74c3c" />
            <Text style={styles.resendTxt}>Resend</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderAttachment = ({ item, index }) => (
    <View style={styles.attachmentWrapper}>
      {item.type === 'image' ? (
        <Image 
          source={{ uri: item.uri }} 
          style={styles.attachmentImage}
          resizeMode="cover"
        />
      ) : item.type === 'drive' ? (
        <View style={styles.drivePreview}>
          <View style={styles.driveIconContainer}>
            <Image 
              source={require('../assets/google-drive-icon.png')}
              style={styles.driveIcon}
            />
          </View>
          <Text style={styles.driveFileName} numberOfLines={1}>
            {item.name || 'Google Drive File'}
          </Text>
          {item.size && <Text style={styles.driveFileSize}>{item.size}</Text>}
        </View>
      ) : (
        <View style={styles.filePreview}>
          <Ionicons 
            name={getFileIcon(item.mimeType)} 
            size={24} 
            color="#061437" 
          />
          <Text style={styles.fileName} numberOfLines={1}>
            {item.name || 'Unnamed'}
          </Text>
          <Text style={styles.fileSize}>
            {item.size ? formatFileSize(item.size) : ''}
          </Text>
        </View>
      )}
      <TouchableOpacity 
        style={styles.removeAttachmentButton}
        onPress={() => removeAttachment(index)}
      >
        <Ionicons name="close" size={14} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderSidebar = () => (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideSidebarAnim }] }]}>
      <View style={styles.sidebarTopRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search chats..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.iconNewChatButton}
          onPress={() => {
            toggleSidebar();
            setMessages([]);
          }}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.sidebarContent}>
        {Object.keys(groupedExpenses).length === 0 ? (
          <Text style={styles.sidebarEmpty}>No chat history yet.</Text>
        ) : (
          sortedDates.map((date) => {
            const isExpanded = !!expandedDates[date];
            const filteredItems = groupedExpenses[date].filter(item =>
              item.value?.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <View key={date} style={styles.groupContainer}>
                <TouchableOpacity
                  style={styles.dateHeaderContainer}
                  onPress={() =>
                    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }))
                  }>
                  <Text style={styles.dateHeader}>{date}</Text>
                  <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {isExpanded &&
                  filteredItems.map((item, idx) => (
                    <TouchableOpacity
                      key={`${date}-${idx}`}
                      style={styles.chatHistoryItem}
                      onPress={() => {
                        toggleSidebar();
                        setMessages(prev => [
                          ...prev,
                          {
                            id: Date.now().toString(),
                            sender: 'bot',
                            text: `📂 Reopened: ${item.value}`,
                            status: 'sent',
                          },
                        ]);
                      }}
                    >
                      <Text style={styles.metaText}>{item.type.toUpperCase()}</Text>
                      <Text style={styles.valueText} numberOfLines={1}>{item.value}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderMenu = () => (
    <Menu
      visible={menuVisible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Animated.View
            style={[
              styles.menuIconContainer,
              { transform: [{ rotate: rotateInterpolate }] }
            ]}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      }
      contentStyle={styles.menuContent}
      style={styles.menuWrapper}
    >
      {isInputFocused && attachments.length === 0 && (
        <>
            <View style={styles.menuItem}>
              <TouchableOpacity
                style={styles.menuItemButton}
                onPress={handleVoice}
              >
                <View style={styles.menuIconWrapper}>
                  <Ionicons 
                    name={isRecording ? "stop" : "mic"} 
                    size={20} 
                    color="#061437" 
                  />
                </View>
                <Text style={styles.menuItemText}>
                  {isRecording ? "Stop Recording" : "Voice Message"}
                </Text>
              </TouchableOpacity>
            </View>
          <View style={styles.menuDivider} />
        </>
      )}

      <View style={styles.menuItem}>
        <TouchableOpacity
          style={styles.menuItemButton}
          onPress={handleCamera}
        >
          <View style={styles.menuIconWrapper}>
            <Ionicons name="camera" size={20} color="#061437" />
          </View>
          <Text style={styles.menuItemText}>Camera</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.menuDivider} />
      
      <View style={styles.menuItem}>
        <TouchableOpacity
          style={styles.menuItemButton}
          onPress={handleGallery}
        >
          <View style={styles.menuIconWrapper}>
            <Ionicons name="images" size={20} color="#061437" />
          </View>
          <Text style={styles.menuItemText}>Gallery</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.menuDivider} />
      
      <View style={styles.menuItem}>
        <TouchableOpacity
          style={styles.menuItemButton}
          onPress={handleFilePicker}
        >
          <View style={styles.menuIconWrapper}>
            <Ionicons name="document" size={20} color="#061437" />
          </View>
          <Text style={styles.menuItemText}>Files</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.menuDivider} />
      
      <View style={styles.menuItem}>
        <TouchableOpacity
          style={styles.menuItemButton}
          onPress={handleDrivePick}
        >
          <View style={styles.menuIconWrapper}>
            <Ionicons name="cloud" size={20} color="#061437" />
          </View>
          <Text style={styles.menuItemText}>Drive</Text>
        </TouchableOpacity>
      </View>
    </Menu>
  );

/* ─────────────── render ─────────────── */
return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 60}
    >
      {/* Sidebar */}
      {renderSidebar()}
      
      {/* Overlay */}
      {isSidebarOpen && (
        <Animated.View style={[styles.overlay, { opacity: interpolatedOverlayOpacity }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={toggleSidebar}
          />
        </Animated.View>
      )}

      {/* Main Content */}
      <Animated.View style={styles.mainScreenWrapper}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.iconRow}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={toggleSidebar}
            >
              <Ionicons name="menu" size={28} color="#000" />
            </TouchableOpacity>

            <Text style={styles.headerText}>New Chat</Text>
            
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-vertical" size={25} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Welcome Content */}
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <Text style={styles.greetingText}>
                {`Hello, ${userName.charAt(0).toUpperCase() + userName.slice(1)}`}
              </Text>
              <Text style={styles.questionText}>{WELCOME_CONTENT.question}</Text>
            </View>
          )}

          {/* Chat Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.chat}
          />

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              <FlatList
                keyboardShouldPersistTaps="handled"
                scrollEnabled
                horizontal
                data={attachments}
                renderItem={renderAttachment}
                keyExtractor={(item, index) => `${item.uri}-${index}`}
                contentContainerStyle={styles.attachmentsList}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}


            {/* Voice Recording UI */}
            {(isRecording || recordingUri) && (
              <View style={styles.voiceContainer}>
                {isRecording ? (
                  <>
                    <TouchableOpacity 
                      style={styles.recordingButton}
                      onPress={pauseRecording}
                    >
                      <Feather 
                        name={isPaused ? "mic" : "pause"} 
                        size={24} 
                        color="#e74c3c" 
                      />
                    </TouchableOpacity>
                    
                    <Waveform waveform={recordingWaveform} />
                    
                    <Text style={styles.recordingTime}>
                      {Math.floor(recordingDuration)}.{(recordingDuration % 1).toFixed(1).substring(2)}s
                    </Text>
                    
                    <TouchableOpacity 
                      style={styles.recordingActionButton}
                      onPress={stopRecording}
                    >
                      <Feather name="check" size={24} color="#2ecc71" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Feather name="mic" size={24} color="#061437" />
                    <Text style={styles.recordingTime}>
                      Voice message ready
                    </Text>
                    <TouchableOpacity 
                      style={styles.recordingActionButton}
                      onPress={sendRecording}
                    >
                      <Feather name="send" size={24} color="#061437" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.recordingActionButton}
                      onPress={deleteRecording}
                    >
                      <Feather name="trash-2" size={24} color="#e74c3c" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

          {/* Wrapper Row: Menu + Input */}
          <View style={[styles.fullInputRow,(isRecording || recordingUri) && { marginTop: 0 }]}>
            
            {/* Menu Button */}
            <View style={styles.menuWrapperBox}>
              {renderMenu()}
            </View>

            {/* Input Row */}
            <View style={styles.inputRow}>  
              <View style={styles.inputContainer}>                  
                {!isInputFocused && attachments.length === 0 && (
                  <TouchableOpacity onPress={handleVoice} style={styles.micButton}>
                    <MaterialIcons name="keyboard-voice" size={22} color="#061437" />
                  </TouchableOpacity>
                )}

                <TextInput
                  style={[
                    styles.input,
                    isInputFocused ? styles.inputFocused : styles.inputBlurred,
                    { height: inputHeight },
                  ]}
                  placeholder="Ask me anything"
                  value={entry}
                  onChangeText={setEntry}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onContentSizeChange={(e) => {
                    const newHeight = e.nativeEvent.contentSize.height;
                    setInputHeight(Math.min(newHeight, maxHeight));
                  }}
                  multiline={true}
                  scrollEnabled={inputHeight >= maxHeight}
                  textAlignVertical="top"
                />
              </View>
              
              <TouchableOpacity
                onPress={() => sendMessage()}
                style={styles.sendButton}
                disabled={isLoading || (!entry.trim() && attachments.length === 0)}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={entry.trim() || attachments.length > 0 ? '#061437' : '#06143773'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </KeyboardAvoidingView>
);
}

/* ─────────────── styles ─────────────── */
const styles = StyleSheet.create({
  // Layout
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#fff' },
  mainScreenWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 1,
  },

  // Header
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  headerText: {
    fontSize: 22,
    color: '#061437',
    fontFamily: 'Sansation-Bold',
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Welcome
  welcomeContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }], 
    width: 300, 
    alignItems: 'left',
    padding: 15,          
  },
  greetingText: {
    fontSize: 24,
    marginBottom: 6,
    color: '#061437',
    fontFamily: 'Sansation-Bold',  
  },
  questionText: {
    fontSize: 20,
    marginBottom: 16,
    color: '#061437',
    fontFamily: 'Sansation-Bold',
  },

  // Chat
  chat: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
    elevation: 2,
  },
  bubble: { 
    marginVertical: 4, 
    padding: 10, 
    borderRadius: 12, 
    maxWidth: '80%' 
  },
  userBubble: { 
    backgroundColor: '#DCF8C6', 
    alignSelf: 'flex-end' 
  },
  botBubble: { 
    backgroundColor: '#EEE', 
    alignSelf: 'flex-start' 
  },
  userText: { color: '#000' },
  botText: { color: '#000' },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  resendTxt: {
    marginLeft: 4,
    fontSize: 12,
    color: '#e74c3c',
  },

  // Attachments
  attachmentsContainer: {
    padding: 8,
  },
  attachmentsList: {
    paddingVertical: 10,
    marginLeft: 4,
    marginBottom: -8,
    marginRight: 1,
  },
  attachmentWrapper: {
    position: 'relative',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  attachmentImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filePreview: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  fileName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Sansation-Regular',
  },
  fileSize: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Sansation-Regular',
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  drivePreview: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  driveIcon: {
    width: 24,
    height: 24,
    tintColor: '#061437',
  },
  driveFileName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Sansation-Regular',
  },
  driveFileSize: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Sansation-Regular',
  },

  // Input
  inputRow: {
    flex: 1, 
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 15,
    borderWidth: 0.8,
    borderColor: '#EEE',
    backgroundColor: '#FFF',
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FFF',
    fontFamily: 'Sansation-Regular',
    textAlignVertical: 'top',
  },
  sendButton: {
    padding: 4,
    marginRight: 4,
  },

  // Menu
  menuButton: {
    padding: 8,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#061437',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  micButton: {
    padding: 8,
    marginRight: -4,
  },
  menuWrapperBox: {
    marginRight: 2, // space between menu and input row
  },
  fullInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuWrapper: {
    marginTop: -55,
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuItem: {
    paddingHorizontal: 4,
    paddingVertical: 0, 
  },
  menuItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: 'transparent',
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  menuItemText: {
    fontSize: 16,
    color: '#061437',
    fontFamily: 'Sansation-Regular',
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
    marginVertical: 4,
  },

  // Sidebar
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: INFO_PANEL_WIDTH,
    backgroundColor: '#FFF',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    zIndex: 3,
    elevation: 4,
  },
  sidebarTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Sansation-Regular',
  },
  iconNewChatButton: {
    marginLeft: 10,
    backgroundColor: '#061437',
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarContent: {
    padding: 16,
  },
  sidebarEmpty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  groupContainer: {
    marginBottom: 12,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#061437',
    fontFamily: 'Sansation-Bold',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  chatHistoryItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  metaText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'Sansation-Regular',
  },
  valueText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Sansation-Regular',
  },

  // Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    zIndex: 2,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Voice recording styles
voiceContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: 20,
  padding: 10,
  marginVertical: 8,
},
waveformContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  height: 50,
  marginHorizontal: 10,
},
waveformBar: {
  width: 3,
  backgroundColor: '#061437',
  marginRight: 2,
  borderRadius: 2,
},
recordingTime: {
  color: '#061437',
  fontSize: 14,
  marginHorizontal: 10,
  fontFamily: 'Sansation-Regular',
},
recordingButton: {
  padding: 8,
},
recordingActionButton: {
  padding: 8,
  marginLeft: 10,
},
});
