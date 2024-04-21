// NutritionList.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Ionicons } from "@expo/vector-icons";
import font from "../config/font";
const NutritionList = ({ nutris, getCategoryImage, selectedDog }) => {
  return (
    <FlatList
      data={nutris}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.record}>
          <Image
            source={getCategoryImage(item.category)}
            style={styles.categoryIcon}
          />
          <View style={styles.recordDetails}>
            {item.category !== "Medicine" ? (
              <>
                <Text style={styles.time}>{format(item.date, "Pp")}</Text>
                <Text
                  style={styles.description}
                >{`${item.foodName} - ${item.weight}`}</Text>
              </>
            ) : (
              <>
                <Text style={styles.time}>{format(item.date, "Pp")}</Text>
                <Text
                  style={styles.description}
                >{`${item.medicineName} - ${item.medicineDosage}`}</Text>
              </>
            )}
            <Text style={styles.description}>{`${item.notes}`}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={
        selectedDog ? (
          <Text style={styles.noRecords}>No records for {selectedDog.label} yet</Text>
        ) : (
          <View style={styles.centerMessage}>
            <Ionicons
              name="paw"
              size={50}
              color="grey"
              style={styles.iconStyle}
            />
            <Text style={styles.selectDogMessage}>
              Please select a dog first
            </Text>
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
    record: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        marginVertical: 8,
        alignItems: "center",
      },
      categoryIcon: {
        width: 70,
        height: 70,
        marginRight: 30,
      },
      recordDetails: {
        flex: 1,
      },
      time: {
        fontSize: font.extraSmall,
      },
      description: {
        fontSize: font.superSmall,
        color: "#666",
      },
      noRecords: {
        fontSize: font.extraSmall,
        color: "#999",
        textAlign: "center",
     
      },
      centerMessage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      selectDogMessage: {
        fontSize: font.medium,
        color: "grey",
        marginTop: 16,
      },
    });
    

export default NutritionList;
