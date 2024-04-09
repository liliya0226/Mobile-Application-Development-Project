import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LineChart } from "react-native-chart-kit";
import { format } from "date-fns";

export default function WeightChart({ weightData }) {
  const sortedWeights = weightData
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const dates = sortedWeights.map((item) =>
    format(new Date(item.date), "MM-dd")
  );
  const weights = sortedWeights.map((item) => item.record);
  const chartConfig = {
    backgroundGradientFrom: "#f5f5f5",
    backgroundGradientTo: "#f5f5f5",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Chart</Text>
      <LineChart
        data={{
          labels: dates,
          datasets: [
            {
              data: weights,
            },
          ],
        }}
        width={350}
        height={220}
        yAxisSuffix="kg"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
