import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Svg, Circle } from 'react-native-svg';
import { colors } from '../../utils/color';

const { width, height } = Dimensions.get('window');

const OwnerStats = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Stats</Text>
        </View>

        <View style={styles.content}>

          <View style={styles.recovery}>
            <Svg width={0.2 * width} height={0.2 * width}>
              <Circle cx="36" cy="36" r="28" stroke={colors.graydark} strokeWidth={8} fill="none" />
              <Circle
                cx="36"
                cy="36"
                r="28"
                stroke={colors.PRIMARY}
                strokeWidth={4}
                fill="none"
                strokeDasharray={176}
                strokeDashoffset={38}
                strokeLinecap="round"
                transform="rotate(-90, 36, 36)"
              />
            </Svg>
            <View style={styles.circleText}>
              <Text style={styles.percentage}>78%</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <StatItem title="Payments" value={20} progress={20} color={colors.PRIMARY} />
            <StatItem title="Redeems" value={60} progress={60} color={colors.PRIMARY} />
            <StatItem title="Students" value={100} progress={100} color={colors.PRIMARY} />
          </View>
        </View>
      </View>
    </View>
  );
};

const StatItem = ({ title, value, progress, color }) => {
  return (
    <View style={styles.statContainer}>
      <Text style={styles.statLabel}>{title}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    marginVertical:5
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e4e4e4',
    width: '90%',  // Make the card width responsive
    maxWidth: 400,  // Maximum width for larger screens
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 0.05 * width,  // Responsive font size based on screen width
    fontWeight: '700',
    color: '#1f2937',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statsContainer: {
    flex: 1,
    justifyContent:"flex-start"
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: '#000',
    width:"35%",
    fontSize: 0.04 * width,  // Dynamic font size
  },
  progressBar: {
    flex: 1,
    height: 7,
    backgroundColor: colors.graydark,
    padding: 1,
    borderRadius: 5,
    marginHorizontal: 8,
    width:"60%"
  },
  progress: {
    height: '100%',
    borderRadius: 3,
  },
  statValue: {
    fontWeight: '800',
    textAlign:"right",
    color: colors.graydark,
    fontSize: 0.04 * width,  // Responsive font size
  },
  recovery: {
    alignItems: 'center',
    marginRight: 10,
  },
  circleText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -14 }],
    alignItems: 'center',
  },
  percentage: {
    fontSize: 0.04 * width,  // Responsive font size
    textAlign: 'center',
    fontWeight: '700',
    color: '#1f2937',
  },
});

export default OwnerStats;
