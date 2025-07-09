import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockCustomers = [
  { id: '1', name: 'Juan Dela Cruz', earned: 120, used: 50 },
  { id: '2', name: 'Maria Santos', earned: 80, used: 20 },
  { id: '3', name: 'Pedro Reyes', earned: 200, used: 150 },
];

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

  const renderHeader = () => (
    <>
      <Text style={styles.title}><Ionicons name="trophy" size={28} color="#FFD700" /> Loyalty System</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Point Rules</Text>
        <View style={styles.row}>
          <Text style={styles.label}>₱ per 1 point:</Text>
          <TextInput
            style={styles.input}
            value={pesoPerPoint}
            onChangeText={setPesoPerPoint}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>1 point = ₱</Text>
          <TextInput
            style={styles.input}
            value={pointValue}
            onChangeText={setPointValue}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => openRewardModal()}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={rewards}
          renderItem={renderRewardItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ways to Earn Points</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => openRuleModal()}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={earningRules}
          renderItem={renderRuleItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Loyalty Activity</Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockCustomers}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.customerRow} onPress={() => openCustomerModal(item)}>
            <Text style={styles.customerName}>{item.name}</Text>
            <Text style={styles.customerPoints}>Earned: {item.earned} | Used: {item.used} | Total: {item.earned - item.used}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* Customer Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeCustomerModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCustomer && (
              <>
                <Text style={styles.modalTitle}>{selectedCustomer.name}</Text>
                <Text style={styles.modalText}>Points Earned: {selectedCustomer.earned}</Text>
                <Text style={styles.modalText}>Points Used: {selectedCustomer.used}</Text>
                <Text style={styles.modalText}>Total Points: {selectedCustomer.earned - selectedCustomer.used}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeCustomerModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
    marginTop: 40,
  },
  section: {
    marginBottom: 28,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 16,
    marginRight: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    minWidth: 50,
    marginRight: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  customerPoints: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
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
  },
  rewardDetails: {
    fontSize: 13,
    color: '#666',
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
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
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
    fontWeight: 'bold',
    color: '#222',
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
}); 