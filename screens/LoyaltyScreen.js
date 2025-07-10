import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function LoyaltyScreen({ navigation }) {
  const [pesoPerPoint, setPesoPerPoint] = useState('10');
  const [pointValue, setPointValue] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Rewards management
  const [rewards, setRewards] = useState([
    { id: '1', name: '₱100 off', points: 100, type: 'discount', value: 100 },
    { id: '2', name: 'Free Coffee', points: 50, type: 'free_item', value: 'Coffee' },
    { id: '3', name: '₱50 off', points: 50, type: 'discount', value: 50 },
  ]);
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState('');
  const [newRewardValue, setNewRewardValue] = useState('');
  const [newRewardType, setNewRewardType] = useState('discount');
  
  // Points earning rules
  const [earningRules, setEarningRules] = useState([
    { id: '1', name: 'Purchase Points', description: '1 point per ₱10 spent', points: 1, trigger: 10, type: 'purchase' },
    { id: '2', name: 'Birthday Bonus', description: '50 points on birthday', points: 50, trigger: 0, type: 'birthday' },
    { id: '3', name: 'Referral Bonus', description: '100 points per referral', points: 100, trigger: 0, type: 'referral' },
  ]);
  const [ruleModalVisible, setRuleModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDescription, setNewRuleDescription] = useState('');
  const [newRulePoints, setNewRulePoints] = useState('');
  const [newRuleTrigger, setNewRuleTrigger] = useState('');
  const [newRuleType, setNewRuleType] = useState('purchase');

  // Add state for edit mode and temp values
  const [isEditingPointingRules, setIsEditingPointingRules] = useState(false);
  const [tempPesoPerPoint, setTempPesoPerPoint] = useState(pesoPerPoint);
  const [tempPointValue, setTempPointValue] = useState(pointValue);

  const openCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };

  const closeCustomerModal = () => {
    setModalVisible(false);
    setSelectedCustomer(null);
  };

  // Reward management functions
  const openRewardModal = (reward = null) => {
    if (reward) {
      setEditingReward(reward);
      setNewRewardName(reward.name);
      setNewRewardPoints(reward.points.toString());
      setNewRewardValue(reward.value.toString());
      setNewRewardType(reward.type);
    } else {
      setEditingReward(null);
      setNewRewardName('');
      setNewRewardPoints('');
      setNewRewardValue('');
      setNewRewardType('discount');
    }
    setRewardModalVisible(true);
  };

  const closeRewardModal = () => {
    setRewardModalVisible(false);
    setEditingReward(null);
    setNewRewardName('');
    setNewRewardPoints('');
    setNewRewardValue('');
    setNewRewardType('discount');
  };

  const saveReward = () => {
    if (!newRewardName || !newRewardPoints || !newRewardValue) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const rewardData = {
      name: newRewardName,
      points: parseInt(newRewardPoints),
      value: newRewardType === 'discount' ? parseInt(newRewardValue) : newRewardValue,
      type: newRewardType,
    };

    if (editingReward) {
      setRewards(rewards.map(r => r.id === editingReward.id ? { ...rewardData, id: editingReward.id } : r));
    } else {
      setRewards([...rewards, { ...rewardData, id: Date.now().toString() }]);
    }
    closeRewardModal();
  };

  const deleteReward = (rewardId) => {
    Alert.alert(
      'Delete Reward',
      'Are you sure you want to delete this reward?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setRewards(rewards.filter(r => r.id !== rewardId)) }
      ]
    );
  };

  // Rule management functions
  const openRuleModal = (rule = null) => {
    if (rule) {
      setEditingRule(rule);
      setNewRuleName(rule.name);
      setNewRuleDescription(rule.description);
      setNewRulePoints(rule.points.toString());
      setNewRuleTrigger(rule.trigger.toString());
      setNewRuleType(rule.type);
    } else {
      setEditingRule(null);
      setNewRuleName('');
      setNewRuleDescription('');
      setNewRulePoints('');
      setNewRuleTrigger('');
      setNewRuleType('purchase');
    }
    setRuleModalVisible(true);
  };

  const closeRuleModal = () => {
    setRuleModalVisible(false);
    setEditingRule(null);
    setNewRuleName('');
    setNewRuleDescription('');
    setNewRulePoints('');
    setNewRuleTrigger('');
    setNewRuleType('purchase');
  };

  const saveRule = () => {
    if (!newRuleName || !newRuleDescription || !newRulePoints) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const ruleData = {
      name: newRuleName,
      description: newRuleDescription,
      points: parseInt(newRulePoints),
      trigger: parseInt(newRuleTrigger) || 0,
      type: newRuleType,
    };

    if (editingRule) {
      setEarningRules(earningRules.map(r => r.id === editingRule.id ? { ...ruleData, id: editingRule.id } : r));
    } else {
      setEarningRules([...earningRules, { ...ruleData, id: Date.now().toString() }]);
    }
    closeRuleModal();
  };

  const deleteRule = (ruleId) => {
    Alert.alert(
      'Delete Rule',
      'Are you sure you want to delete this earning rule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setEarningRules(earningRules.filter(r => r.id !== ruleId)) }
      ]
    );
  };

  const renderRewardItem = ({ item }) => (
    <View style={styles.rewardItem}>
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardDetails}>
          {item.type === 'discount' ? `₱${item.value} off` : `Free ${item.value}`} • {item.points} points
        </Text>
      </View>
      <View style={styles.rewardActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => openRewardModal(item)}>
          <Ionicons name="pencil" size={16} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReward(item.id)}>
          <Ionicons name="trash" size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRuleItem = ({ item }) => (
    <View style={styles.ruleItem}>
      <View style={styles.ruleInfo}>
        <Text style={styles.ruleName}>{item.name}</Text>
        <Text style={styles.ruleDescription}>{item.description}</Text>
      </View>
      <View style={styles.ruleActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => openRuleModal(item)}>
          <Ionicons name="pencil" size={16} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRule(item.id)}>
          <Ionicons name="trash" size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}> 
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Loyalty System</Text>
        <TouchableOpacity
          style={styles.activityIcon}
          onPress={() => navigation.navigate('CustomerLoyaltyActivityScreen')}
        >
          <MaterialCommunityIcons name="clock-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitleDark}>Pointing Rules</Text>
          <View style={styles.pointingRulesRow}>
            <View style={styles.pointingRulesCol}>
              <View style={styles.inputRowCustom}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Image source={require('../assets/peso1.png')} style={styles.pesoIcon} />
                  <Text style={styles.labelDark}>Per 1 point :</Text>
                </View>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.inputCustom}
                    value={isEditingPointingRules ? tempPesoPerPoint : pesoPerPoint}
                    onChangeText={setTempPesoPerPoint}
                    keyboardType="numeric"
                    editable={isEditingPointingRules}
                  />
                  {!isEditingPointingRules && (
                    <TouchableOpacity style={styles.pencilIconWrap} onPress={() => {
                      setIsEditingPointingRules(true);
                      setTempPesoPerPoint(pesoPerPoint);
                      setTempPointValue(pointValue);
                    }}>
                      <Feather name="edit-3" size={18} color="#061437" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.inputRowCustom}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={styles.labelDark}>  One point = </Text>
                  <Image source={require('../assets/peso1.png')} style={styles.pesoIcon} />
                </View>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.inputCustom}
                    value={isEditingPointingRules ? tempPointValue : pointValue}
                    onChangeText={setTempPointValue}
                    keyboardType="numeric"
                    editable={isEditingPointingRules}
                  />
                  {!isEditingPointingRules && (
                    <TouchableOpacity style={styles.pencilIconWrap} onPress={() => {
                      setIsEditingPointingRules(true);
                      setTempPesoPerPoint(pesoPerPoint);
                      setTempPointValue(pointValue);
                    }}>
                      <Feather name="edit-3" size={18} color="#061437" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.coinImageWrapCustom}>
              <Image source={require('../assets/rupee4.png')} style={styles.coinImageCustom} />
              <TouchableOpacity style={styles.applyButtonCustom} onPress={() => {
                if (isEditingPointingRules) {
                  setPesoPerPoint(tempPesoPerPoint);
                  setPointValue(tempPointValue);
                  setIsEditingPointingRules(false);
                }
              }}>
                <Text style={styles.applyButtonTextCustom}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Rewards</Text>
            <TouchableOpacity style={styles.addCircle} onPress={() => openRewardModal()}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
         
        
          {rewards.map(item => (
            <View key={item.id} style={styles.rewardItemRow}>
              <View>
                <Text style={styles.rewardName}>{item.name}</Text>
                <Text style={styles.rewardDetails}>{item.type === 'discount' ? `₱${item.value} off` : `Free ${item.value}`} - {item.points} points</Text>
              </View>
              <View style={styles.rewardActionsRow}>
                <TouchableOpacity onPress={() => openRewardModal(item)}>
                  <Feather name="edit-3" size={18} color="#061437" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteReward(item.id)}>
                  <Feather name="trash-2" size={18} color="#061437" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Ways to earn points</Text>
            <TouchableOpacity style={styles.addCircle} onPress={() => openRuleModal()}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
         
          
         
          {earningRules.map(item => (
            <View key={item.id} style={styles.rewardItemRow}>
              <View>
                <Text style={styles.rewardName}>{item.name}</Text>
                <Text style={styles.rewardDetails}>{item.description}</Text>
              </View>
              <View style={styles.rewardActionsRow}>
                <TouchableOpacity onPress={() => openRuleModal(item)}>
                  <Feather name="edit-3" size={18} color="#061437" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRule(item.id)}>
                  <Feather name="trash-2" size={18} color="#061437" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Reward Modal */}
      <Modal visible={rewardModalVisible} animationType="slide" transparent={true} onRequestClose={closeRewardModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingReward ? 'Edit Reward' : 'Add New Reward'}</Text>
            
            <Text style={styles.modalLabel}>Reward Name</Text>
            <TextInput
              style={styles.modalInput}
              value={newRewardName}
              onChangeText={setNewRewardName}
              placeholder="e.g., ₱100 off, Free Coffee"
            />

            <Text style={styles.modalLabel}>Reward Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, newRewardType === 'discount' && styles.typeButtonActive]}
                onPress={() => setNewRewardType('discount')}
              >
                <Text style={[styles.typeButtonText, newRewardType === 'discount' && styles.typeButtonTextActive]}>Discount</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, newRewardType === 'free_item' && styles.typeButtonActive]}
                onPress={() => setNewRewardType('free_item')}
              >
                <Text style={[styles.typeButtonText, newRewardType === 'free_item' && styles.typeButtonTextActive]}>Free Item</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>
              {newRewardType === 'discount' ? 'Discount Amount (₱)' : 'Item Name'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={newRewardValue}
              onChangeText={setNewRewardValue}
              placeholder={newRewardType === 'discount' ? '100' : 'Coffee'}
              keyboardType={newRewardType === 'discount' ? 'numeric' : 'default'}
            />

            <Text style={styles.modalLabel}>Points Required</Text>
            <TextInput
              style={styles.modalInput}
              value={newRewardPoints}
              onChangeText={setNewRewardPoints}
              placeholder="100"
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeRewardModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveReward}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rule Modal */}
      <Modal visible={ruleModalVisible} animationType="slide" transparent={true} onRequestClose={closeRuleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingRule ? 'Edit Earning Rule' : 'Add New Earning Rule'}</Text>
            
            <Text style={styles.modalLabel}>Rule Name</Text>
            <TextInput
              style={styles.modalInput}
              value={newRuleName}
              onChangeText={setNewRuleName}
              placeholder="e.g., Purchase Points, Birthday Bonus"
            />

            <Text style={styles.modalLabel}>Description</Text>
            <TextInput
              style={styles.modalInput}
              value={newRuleDescription}
              onChangeText={setNewRuleDescription}
              placeholder="e.g., 1 point per ₱10 spent"
            />

            <Text style={styles.modalLabel}>Rule Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, newRuleType === 'purchase' && styles.typeButtonActive]}
                onPress={() => setNewRuleType('purchase')}
              >
                <Text style={[styles.typeButtonText, newRuleType === 'purchase' && styles.typeButtonTextActive]}>Purchase</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, newRuleType === 'birthday' && styles.typeButtonActive]}
                onPress={() => setNewRuleType('birthday')}
              >
                <Text style={[styles.typeButtonText, newRuleType === 'birthday' && styles.typeButtonTextActive]}>Birthday</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, newRuleType === 'referral' && styles.typeButtonActive]}
                onPress={() => setNewRuleType('referral')}
              >
                <Text style={[styles.typeButtonText, newRuleType === 'referral' && styles.typeButtonTextActive]}>Referral</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Points to Award</Text>
            <TextInput
              style={styles.modalInput}
              value={newRulePoints}
              onChangeText={setNewRulePoints}
              placeholder="1"
              keyboardType="numeric"
            />

            {newRuleType === 'purchase' && (
              <>
                <Text style={styles.modalLabel}>Trigger Amount (₱)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newRuleTrigger}
                  onChangeText={setNewRuleTrigger}
                  placeholder="10"
                  keyboardType="numeric"
                />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeRuleModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveRule}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDC856' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 48,
    backgroundColor: '#FDC856',
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20,  color: '#333', flex: 1, textAlign: 'center', fontFamily: 'Sansation-Bold' },
  bellButton: { marginLeft: 12 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontFamily: 'Sansation-Bold', color: '#061437' },
  addCircle: { backgroundColor: '#007AFF', borderRadius: 20, padding: 4 },
  input: { backgroundColor: '#F7F7F7', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#eee', fontSize: 15 },
  label: { color: '#555', marginBottom: 4, fontSize: 13 },
  rulesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rulesCol: { flex: 1, marginRight: 8 },
  applyButton: { backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18, marginLeft: 8 },
  applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  coinImageWrap: { alignItems: 'center', marginTop: 10 },
  coinImage: { width: 80, height: 80, resizeMode: 'contain' },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  checkButton: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 8, marginRight: 8 },
  closeButton: { backgroundColor: '#FF3B30', borderRadius: 8, padding: 8 },
  rewardItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  rewardName: { fontWeight: 'bold', fontSize: 15, color: '#222' ,  fontFamily: 'Sansation-Regular',},
  rewardDetails: { color: '#444', fontSize: 14, marginTop: 2 , fontFamily: 'Sansation-Regular'},
  rewardActionsRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 23,
    
    marginBottom: 12,
    fontFamily:'Sansation-Bold',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: 'Sansation-Regular'
  },
  rewardDetails: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    fontFamily: 'Sansation-Regular'
  },
  rewardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: 15,
    padding: 5,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  ruleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  ruleInfo: {
    flex: 1,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  ruleDescription: {
    fontSize: 13,
    color: '#666',
  },
  ruleActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,

  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
    textAlign: 'left',
    width: '100%',
    fontFamily: 'Sansation-Bold'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    
    
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  cancelButtonText: {
    fontSize: 16,
    
    color: '#222',
    fontFamily: 'Sansation-Bold'
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
  
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily:'Sansation-Bold',
    color: '#222',
  
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  activityButton: {
    marginTop: 10,
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activityButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activityIcon: { marginLeft: 12 },
  sectionTitleDark: { fontSize: 19,
      color: '#1A2343', 
      marginBottom: 16, 
      fontFamily: 'Sansation-Bold' },
      
  labelDark: { color: '#1A2343',  fontSize: 13, marginBottom: 6, fontFamily: 'Sansation-Regular' },
  pointingRulesRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  pointingRulesCol: {
    flex: 1,
    justifyContent: 'space-between',
    height: 140,
  },
  inputRowCustom: { marginBottom: 14 },
  inputWithIcon: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#FDC856', paddingHorizontal: 12, paddingVertical: 4, width: 120 },
  inputCustom: { flex: 1, fontSize: 13, color: '#1A2343', paddingVertical: 6, backgroundColor: 'transparent', borderWidth: 0, fontFamily: 'Sansation-Regular' },
  pencilIconWrap: { marginLeft: 6 },
  applyButtonCustom: {
    backgroundColor: '#4470FF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 32,
    alignSelf: 'center', // center under image
    marginTop: 2,       // space between image and button
  },
  applyButtonTextCustom: { color: '#fff',  fontSize: 15, fontFamily: 'Sansation-Bold' },
  coinImageWrapCustom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -20,
  },
  coinImageCustom: {
    width: 150,
    height: 140,
    resizeMode: 'contain',
  },
  pesoIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 8,
  },
}); 