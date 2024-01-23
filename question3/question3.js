const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get("/allTables", async (req, res) => {
  try {
    const jsonData = await fetchData(); // Function to fetch JSON data
    const allTables = getAllTables(jsonData);
    console.log(allTables);
    res.json(allTables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const fetchData = async () => {
  const response = await axios.get(
    "https://gist.githubusercontent.com/realchoubey/25132ad140df2fffd683db85650e0847/raw/json_source.json"
  );
  return response.data;
};

const getAllTables = (jsonData) => {
  const validTables = [];

  for (const schemaType of jsonData.__schema.types) {
    if (isValidTable(schemaType)) {
      validTables.push(schemaType.name);
    }
  }

  return validTables;
};

const isValidTable = (entityDefinition) => {
  return (
    entityDefinition.fields !== null &&
    entityDefinition.fields !== "" &&
    entityDefinition.fields !== undefined &&
    entityDefinition.fields.length > 0 &&
    !["your", "entities", "to", "exclude"].includes(
      entityDefinition.name.toLowerCase()
    ) &&
    !entityDefinition.name.startsWith("_")
  );
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/averageGasPrice", async (req, res) => {
  try {
    const data = await fetchData();
    const sumGasPrices = data.reduce((sum, entry) => sum + entry.gas_price, 0);
    const averageGasPrice = sumGasPrices / data.length;
    res.json({ averageGasPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/transformStructure", async (req, res) => {
  try {
    const transformedData = await transformData();
    res.json(transformedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const transformData = async () => {
  const data = await fetchData();
  const transformedData = data
    .slice(0, 10)
    .map(
      ({
        max_priority_fee_per_gas,
        status,
        max_fee_per_gas,
        nonce,
        gas_used,
        ...rest
      }) => rest
    );
  return transformedData;
};

app.get("/transactionsPerBlock", async (req, res) => {
  try {
    const data = await fetchData();
    const transactionsPerBlock = {};
    data.forEach((entry) => {
      transactionsPerBlock[entry.block_number] =
        transactionsPerBlock[entry.block_number] || 0;
      transactionsPerBlock[entry.block_number]++;
    });
    res.json(transactionsPerBlock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/blockDetails", async (req, res) => {
  try {
    const data = await fetchData();
    const blockDetails = getBlockDetails(data);
    res.json(blockDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getBlockDetails = (data) => {
  const blockDetails = {};

  data.forEach((entry) => {
    const blockNumber = entry.block_number;
    blockDetails[blockNumber] = blockDetails[blockNumber] || {
      timestamp: entry.timestamp,
      gasPrices: [],
      transactions: 0,
    };

    blockDetails[blockNumber].gasPrices.push(entry.gas_price);
    blockDetails[blockNumber].transactions++;
  });

  // Calculate average gas price for each block
  for (const blockNumber in blockDetails) {
    const gasPrices = blockDetails[blockNumber].gasPrices;
    const averageGasPrice =
      gasPrices.reduce((sum, price) => sum + price, 0) / gasPrices.length;
    blockDetails[blockNumber].averageGasPrice = averageGasPrice;
    delete blockDetails[blockNumber].gasPrices; // Remove individual gas prices if needed
  }

  return blockDetails;
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
