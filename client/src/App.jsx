import styles from "./App.module.css";
import GlassWine from "./assets/Glass-Wine.jpeg";
import Select from "react-select";
import axios from "axios";
import { redVarietals, whiteVarietals } from "./varietals";

import { useState } from "react";

const WineForm = () => {
  const [wineType, setWineType] = useState(null);
  const [wineVarietal, setWineVarietal] = useState(null);
  const [varietals, setVarietals] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatedSentence, setGeneratedSentence] = useState([]); // Define the state to hold the generated sentence
  // const [wineName, setWineName] = useState("");
  // const [vintage, setVintage] = useState("");

  const wineTypeOptions = [
    { value: "red", label: "Red" },
    { value: "white", label: "White" },
  ];

  const handleWineTypeChange = (selectedOption) => {
    setWineType(selectedOption.value);
    if (selectedOption.value === "red") {
      setVarietals(redVarietals);
    } else {
      setVarietals(whiteVarietals);
    }
    setWineVarietal(null); // Reset the selected varietal when wine type changes
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const prompt = `${wineVarietal}`;
    const url = "https://dry-sea-76064-c9baeed38795.herokuapp.com/generate";
    const headers = {
      "Content-Type": "application/json", // Specify the content type as JSON
      // Add any other custom headers here, if needed
    };
    try {
      const response = await axios.post(url, { queryDescription: prompt });

      console.log("Raw Response: ", response.data.response); // Let's log raw response

      const responseSentences = response.data.response.split("\n");

      let wineObjects = [];
      let currentWine = {};

      for (let i = 0; i < responseSentences.length; i++) {
        const sentence = responseSentences[i].trim();
        if (sentence.startsWith("Wine Name:")) {
          if (currentWine.name) {
            wineObjects.push(currentWine);
            currentWine = {};
          }
          currentWine.name = sentence.split(": ")[1];
        } else if (sentence.startsWith("Region:")) {
          currentWine.region = sentence.split(": ")[1];
        } else if (sentence.startsWith("Price:")) {
          currentWine.price = sentence.split(": ")[1];
        } else if (sentence.startsWith("Description:")) {
          currentWine.description = sentence.split(": ")[1];
        }
      }

      if (currentWine.name) {
        wineObjects.push(currentWine);
      }

      console.log("Wine Recommendations: ", wineObjects); // Let's log the wine objects
      setGeneratedSentence(wineObjects);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
      } else if (error.request) {
        console.log("Request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
    }
  };

  const generateSuggestion = () => {
    if (wineType && wineVarietal) {
      return `You selected the ${wineType} wine: ${wineVarietal}.`;
    } else {
      return "Please select a wine type and varietal.";
    }
  };

  return (
    <main className={styles.main}>
      <img src={GlassWine} alt="" className={styles.icon} />
      <h3 className={styles.h3}>
        The world's most sophisticated wine assistant
      </h3>
      <form className={styles.form} onSubmit={onSubmit}>
        <label htmlFor="wineType">Choose a wine type:</label>
        <Select
          id="wineType"
          name="wineType"
          value={wineTypeOptions.find((option) => option.value === wineType)}
          onChange={handleWineTypeChange}
          options={wineTypeOptions}
        />

        <label htmlFor="wineVarietal">Choose a wine varietal:</label>
        <Select
          id="wineVarietal"
          name="wineVarietal"
          value={
            wineVarietal
              ? varietals.find((option) => option.value === wineVarietal)
              : null
          }
          onChange={(selectedOption) =>
            setWineVarietal(selectedOption ? selectedOption.value : null)
          }
          options={varietals.map((varietal) => ({
            value: varietal,
            label: varietal,
          }))}
        />
      </form>
      <button className={styles.button} type="button" onClick={onSubmit}>
        Get Wine Recommendation
      </button>
      <p>{generateSuggestion()}</p>
      {generatedSentence.map((wine, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h3>{wine.name}</h3>
          <p>
            <strong>Region:</strong> {wine.region}
          </p>
          <p>
            <strong>Price:</strong> {wine.price}
          </p>
          <p>
            <strong>Description:</strong> {wine.description}
          </p>
        </div>
      ))}
    </main>
  );
};

export default WineForm;
