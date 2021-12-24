import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";
const net = require("react-native-tcp-socket");
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

export default function App() {
	const [ip, setIP] = useState("192.168.1.43");
	const [port, setPort] = useState("9020");
	const [payload, setPayload] = useState(null);
	const [payloadName, setPayloadName] = useState(null);
	return (
		<View style={styles.container}>
			<Input
				label="PS4 IP Address"
				placeholder="192.168.1.43"
				onSubmitEditing={(event) => setIP(event.nativeEvent.text)}
			/>
			<Input
				label="Port"
				placeholder="9020"
				onSubmitEditing={(event) => setPort(event.nativeEvent.text)}
			/>

			<Text>PS4 IP Address: {ip}</Text>
			<Text>Port selected: {port}</Text>
			<Text>Payload selected: {payloadName}</Text>

			<View style={styles.buttonContainer}>
				<View style={styles.buttonStyle}>
					<Button
						title="Select file..."
						buttonStyle={styles.button}
						onPress={async () => {
							try {
								let result = await DocumentPicker.getDocumentAsync({});

								if (result.type == "cancel") {
									alert("No file selected!");
								} else {
									setPayloadName(result.name);
									const file = await FileSystem.readAsStringAsync(result.uri, {
										encoding: "base64",
									});

									setPayload(file);
								}
							} catch (error) {
								alert(`There was an error! DEBUG: ${error}`);
							}
						}}
					/>
				</View>
				<View style={styles.buttonStyle}>
					<Button
						title="Send payload"
						buttonStyle={styles.button}
						onPress={() => {
							const options = {
								port: port,
								host: ip,
							};

							const client = net.createConnection(options, () => {
								client.write(payload);
								alert(`${payloadName} sent!`);
								client.destroy();
							});
							client.on("error", function (error) {
								alert(error);
							});
						}}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		marginVertical: 20,
	},
	buttonStyle: {
		width: 150,
	},
	button: {
		borderRadius: 20,
		backgroundColor: "black",
	},
});
