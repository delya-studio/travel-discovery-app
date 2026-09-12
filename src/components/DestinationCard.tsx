import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Destination } from "../types/destination";
import { destinations } from "../data/destinations";

interface DestinationCardProps {
  destination: Destination;
  onPress: () => void;
}

export default function DestinationCard({
  destination,
  onPress,
}: DestinationCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: destination.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{destination.name}</Text>
        <Text style={styles.location}>{destination.country}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 287,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#d9d9d9",
  },
  image: {
    width: "100%",
    height: 354,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    marginTop: 4,
    fontSize: 14,
  },
});
