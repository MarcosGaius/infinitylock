import mqtt from "mqtt";

// Configurações MQTT
const brokerUrl = process.env.NEXT_PUBLIC_BROKER_URL!;
const options: mqtt.IClientOptions = {
  clientId: process.env.MQTT_CLIENT_ID!,
  protocol: "mqtt",
  rejectUnauthorized: false,
  username: process.env.MQTT_USERNAME!,
  password: process.env.MQTT_PASSWORD!,
};
const publisherTopic = process.env.PUBLISHER_TOPIC!;
const listenerTopic = process.env.LISTENER_TOPIC!;

// const client = mqtt.connect(brokerUrl, options);

export const createClient = () => {
  const client = mqtt.connect(brokerUrl, options);
  client.on("connect", () => {
    client.subscribe(listenerTopic);
  });
  client.on("message", (listenerTopic, message) => {
    console.log(`Mensagem recebida no tópico ${listenerTopic}: ${message.toString()}`);
  });

  client.on("close", () => {
    console.error("Conexão perdida");
  });
  return client;
};

export const publishMessage = async (message: string) => {
  const client = createClient();
  console.log("client:", client);
  await client.publishAsync(publisherTopic, message);
  await client.endAsync();
};
