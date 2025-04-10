import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/color';

const notifications = [
  {
    id: 1,
    username: 'John Doe',
    updatedAt: '3/8/2025, 5:12:34 PM',
    body: 'Redeemed a token',
    details: 'Token ID: 12345',
    type: 'redeem',
  },
  {
    id: 2,
    username: 'Alice Smith',
    updatedAt: '8/5/2025, 9:25:22',
    body: 'Purchased a new token',
    details: 'Token ID: 67890',
    type: 'purchase',
  },
  {
    id: 3,
    username: 'Bob Johnson',
    updatedAt: '3/8/2025, 5:12:34 PM',
    body: 'User created successfully',
    details: 'Batch ID: 54321',
    type: 'modify',  // Combined creation and deletion under "modify"
  },
  {
    id: 4,
    username: 'Eve Adams',
    updatedAt: '8/5/2025, 9:25:22 PM',
    body: 'User removed successfully',
    details: 'Token ID: 98765',
    type: 'modify',  // Combined creation and deletion under "modify"
  },
];

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Redeems', value: 'redeem' },
  { label: 'Purchases', value: 'purchase' },
  { label: 'Modifications', value: 'modify' },  // Updated to include combined creation and deletion
];

const NotificationsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredNotifications = selectedFilter === 'all'
    ? notifications
    : notifications.filter((notification) => notification.type === selectedFilter);

  return (
    <View style={styles.container}>
      {/* Filter Options */}
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[styles.filterButton, selectedFilter === filter.value && styles.selectedFilter]}
            onPress={() => setSelectedFilter(filter.value)}
          >
            <Text style={[styles.filterText, selectedFilter === filter.value && styles.selectedFilterText]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {filteredNotifications.map((notification) => (
          <View key={notification.id} style={styles.notification}>
            {/* Default Icon for Profile */}
            <MaterialIcons name="account-circle" size={40} color="gray" />

            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.username}>{notification.username}</Text>
                <Text style={styles.time}>{notification.updatedAt}</Text>
              </View>
              <Text style={styles.notificationText}>{notification.body}</Text>
              {notification.details ? <Text style={styles.details}>{notification.details}</Text> : null}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  selectedFilter: {
    backgroundColor: colors.PRIMARY,
  },
  filterText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  selectedFilterText: {
    color: 'white',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
  },
  notificationText: {
    fontSize: 14,
    color: '#4b5563',
  },
  details: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default NotificationsScreen;
