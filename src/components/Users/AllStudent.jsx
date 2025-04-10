import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/color';

const students = [
  {
    id: 1,
    name: 'John Doe',
    timeIn: '3/8/2025, 5:12:34 PM',
    tokensPresent: 5,
    status: 'active',
    createdAt: '3/8/2025, 5:00:00 PM',
  },
  {
    id: 2,
    name: 'Alice Smith',
    timeIn: '8/5/2025, 9:25:22',
    tokensPresent: 3,
    status: 'active',
    createdAt: '8/5/2025, 9:00:00 AM',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    timeIn: '3/8/2025, 5:12:34 PM',
    tokensPresent: 0,
    status: 'inactive',
    createdAt: '3/8/2025, 4:45:00 PM',
  },
  {
    id: 4,
    name: 'Eve Adams',
    timeIn: '8/5/2025, 9:25:22 PM',
    tokensPresent: 4,
    status: 'active',
    createdAt: '8/5/2025, 8:30:00 PM',
  },
];

const filters = [
  { label: 'Created At', value: 'createdAt' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const StudentsInMessScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('createdAt');

  const sortedStudents = students.sort((a, b) => {
    if (selectedFilter === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt); 
    } else if (selectedFilter === 'active') {
      return b.status === 'active' ? 1 : -1; 
    } else if (selectedFilter === 'inactive') {
      return b.status === 'inactive' ? 1 : -1; 
    }
    return 0;
  });

  return (
    <View style={styles.container}>
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
        {sortedStudents.map((student) => (
          <View key={student.id} style={styles.student}>
            <MaterialIcons name="account-circle" size={40} color="gray" />

            <View style={styles.studentContent}>
              <View style={styles.studentHeader}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.timeIn}>{student.timeIn}</Text>
              </View>
              <Text style={styles.tokensPresent}>Tokens Present: {student.tokensPresent}</Text>
              <Text style={styles.status}>Status: {student.status}</Text>
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
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal:2,
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
  student: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  studentContent: {
    flex: 1,
    marginLeft: 12,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studentName: {
    fontWeight: '600',
  },
  timeIn: {
    fontSize: 12,
    color: '#6b7280',
  },
  tokensPresent: {
    fontSize: 14,
    color: '#4b5563',
  },
  status: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default StudentsInMessScreen;
