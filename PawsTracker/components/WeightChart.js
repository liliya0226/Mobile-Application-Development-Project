import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LineChart } from "react-native-chart-kit";
import { format } from "date-fns";

export default function WeightChart({ weightData }) {
  const groupByMonth = {};
  weightData.forEach((item) => {
    const month = format(new Date(item.date), "MM");
    if (!groupByMonth[month]) {
      groupByMonth[month] = [];
    }
    groupByMonth[month].push(item.record);
  });

  const averageWeights = {};
  for (const month in groupByMonth) {
    const weights = groupByMonth[month];
    const sum = weights.reduce((total, weight) => total + weight, 0);
    averageWeights[month] = sum / weights.length;
  }

  let dates = Object.keys(averageWeights);
  dates = dates.sort((a, b) => Number(a) - Number(b));
  const weights = dates.map((month) => averageWeights[month]);

  const chartConfig = {
    backgroundGradientFrom: "#f5f5f5",
    backgroundGradientTo: "#f5f5f5",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Average by Month</Text>
      <LineChart
        data={{
          labels: dates,
          datasets: [
            {
              data: weights,
            },
          ],
        }}
        width={400}
        height={200}
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
