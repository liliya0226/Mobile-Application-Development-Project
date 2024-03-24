import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WeightItem from "../components/WeightItem";
import {
  getWeightFromDB,
  writeWeightToDB,
  deleteWeightFromDB,
} from "../firebase-files/firestoreHelper";

export default function Weight({ navigation }) {
  const [weight, setWeights] = useState([]);

  function receiveInput(data, date) {
    const newGoal = { text: data, date: date };
    writeWeightToDB(newGoal, "weights");
  }

  function goalPressHandler(weightItem) {
    navigation.navigate("WeightDetails", { data: weightItem });
  }
  function goalDeleteHandler(deletedId) {
    console.log("deleted", deletedId);
    deleteWeightFromDB(deletedId);
  }
  return (
    <View>
      <View style={styles.bottomView}>
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          data={weight}
          renderItem={({ item }) => {
            return (
              <WeightItem
                weightObj={item}
                deleteFunction={goalDeleteHandler}
                detailFunction={goalPressHandler}
              />
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
