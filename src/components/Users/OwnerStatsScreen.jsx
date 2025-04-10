import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { colors } from '../../utils/color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const OwnerStats = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Stats Overview</Text>
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

        <View style={styles.statsGrid}>
          <StatsCard title="Total Earnings" value="₹4000" icon="currency-rupee" />
          <StatsCard title="All Payments" value="₹7000" icon="savings" />
          <StatsCard title="Total Students" value="5" icon="groups" />
          <StatsCard title="Total Tokens" value="140" icon="currency-rupee" />
          <StatsCard title="Today's Earnings" value="₹250" icon="currency-rupee" />
          <StatsCard title="Today's Redeems" value="5" icon="currency-rupee" />
        </View>

      </View>
    </ScrollView>
  );
};

const StatItem = ({ title, value, progress, color }) => (
  <View style={styles.statContainer}>
    <Text style={styles.statLabel}>{title}</Text>
    <View style={styles.progressBar}>
      <View style={[styles.progress, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
    {/* <Text style={styles.statValue}>{value}</Text> */}
  </View>
);

const StatsCard = ({ title, value, icon }) => (
  <View style={styles.cardItem}>
    {/* <MaterialIcons name={icon} size={25} color={colors.PRIMARYDARK} /> */}
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

const TransactionItem = ({ name, amount, type }) => (
  <View style={styles.transactionItem}>
    <Text style={styles.transactionName}>{name}</Text>
    <Text style={[styles.transactionAmount, { color: type === "Received" ? "green" : type === "Paid" ? "red" : "orange" }]}>
      {amount} ({type})
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 0.05 * width,
    fontWeight: '700',
    color: '#1f2937',
  },
  subHeader: {
    marginTop: 15,
    alignItems: 'center',
  },
  subHeaderText: {
    fontSize: 0.045 * width,
    fontWeight: '600',
    color: colors.graydark,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statsContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 15,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 7,
    backgroundColor: colors.graydark,
    borderRadius: 5,
    marginHorizontal: 8,
    width: '60%',
  },
  progress: {
    height: '100%',
    borderRadius: 3,
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
    fontSize: 0.04 * width,
    fontWeight: '700',
    color: '#1f2937',
  },
  cardItem: {
    backgroundColor: "#e4e4e4",
    width: '45%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 0.04 * width,
    textAlign: 'center',
    color: colors.graydark,
  },
  cardValue: {
    fontSize: 0.055 * width,
    fontWeight: 'bold',
    marginTop: 5,
    color: colors.PRIMARYDARK,
  }
});

export default OwnerStats;
