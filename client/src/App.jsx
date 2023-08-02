import styles from "./App.module.css";
import GlassWine from "./assets/Glass-Wine.jpeg";
import Select from "react-select";
import axios from "axios";
import { redVarietals, whiteVarietals } from "./varietals";

import { useState, useEffect } from "react";

const WineForm = () => {
  const [wineType, setWineType] = useState(null);
  const [wineVarietal, setWineVarietal] = useState(null);
  const [varietals, setVarietals] = useState([]);
  const [spumanteVarietals, setSpumanteVarietals] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatedSentence, setGeneratedSentence] = useState([]); // Define the state to hold the generated sentence
  const [loadingMessage, setLoadingMessage] = useState(""); // Define the state to hold the loading message while the API call is being made

  // const [wineName, setWineName] = useState("");
  // const [vintage, setVintage] = useState("");

  useEffect(() => {
    if (loadingMessage === "") {
      return;
    }

    const timerId = setInterval(() => {
      //
      setLoadingMessage((prevMessage) => {
        //
        const dotCount = (prevMessage.match(/\./g) || []).length;
        if (dotCount < 3) {
          return prevMessage + ".";
        } else {
          return "Wine Companion is thinking (This may take up to 30 seconds).";
        }
      });
    }, 250); // Update every quarter-second

    // Clean up the timer when the component is unmounted, or when loadingMessage changes
    return () => clearInterval(timerId);
  }, [loadingMessage]);

  const wineTypeOptions = [
    { value: "red", label: "Red" },
    { value: "white", label: "White" },
    { value: "spumante", label: "Spumante (Sparkling)" },
  ];

  const handleWineTypeChange = (selectedOption) => {
    setWineType(selectedOption.value);
    if (selectedOption.value === "red") {
      setVarietals(redVarietals);
    } else if (selectedOption.value === "white") {
      setVarietals(whiteVarietals);
    } else if (selectedOption.value === "spumante") {
      setVarietals(sparklingVarietals);
    }
    setWineVarietal(null); // Reset the selected varietal when wine type changes
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const prompt = `${wineVarietal}`;
    const url = "https://dry-sea-76064-c9baeed38795.herokuapp.com/generate";
    setLoadingMessage();

    try {
      const response = await axios.post(url, { queryDescription: prompt });

      console.log("Raw Response: ", response.data.response);

      const responseSentences = response.data.response.split("\n"); // Split the response into sentences based on the newline character

      let wineObjects = [];
      let currentWine = {};

      for (let i = 0; i < responseSentences.length; i++) {
        const sentence = responseSentences[i].trim(); // Remove leading and trailing whitespace

        if (sentence.startsWith("Wine Recommendation")) {
          //
          if (currentWine.name) {
            // If there is already a wine name, push the current wine object to the array and reset the current wine object to an empty object
            wineObjects.push(currentWine);
            currentWine = {};
          }
          currentWine.name = sentence.split(": ")[1]; // get rid of the colon and set the second part (the wine name) as the value for the name property of the current wine
        } else if (sentence.startsWith("Description")) {
          currentWine.description = sentence.split(": ")[1];
        } else if (sentence.startsWith("Price")) {
          currentWine.price = sentence.split(": ")[1];
        } else if (sentence.startsWith("Reason")) {
          currentWine.reason = sentence.split(": ")[1];
        }
      }

      if (currentWine.name) {
        wineObjects.push(currentWine);
      }

      console.log("Wine Recommendations: ", wineObjects);
      setGeneratedSentence(wineObjects);
      setLoadingMessage("");
    } catch (error) {
      console.error("Error:", error);
      setLoadingMessage("");
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
      <p>{loadingMessage}</p>
      {generatedSentence.map((wine, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h3>{wine.name}</h3>

          <p>
            <strong>Price:</strong> {wine.price}
          </p>
          <p>
            <strong>Description:</strong> {wine.description}
          </p>
          <p>
            <strong>Reason:</strong> {wine.reason}
          </p>
        </div>
      ))}
    </main>
  );
};

export default WineForm;
