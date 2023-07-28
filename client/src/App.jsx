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
    try {
      const response = await axios.post(
        "https://lively-rugelach-3e0149.netlify.app/generate",
        {
          queryDescription: prompt,
        }
      );

      console.log("Raw Response: ", response.data.response); // Let's log raw response
      const responseSentences = response.data.response.split("\n");
      console.log("Response Sentences: ", responseSentences); // Let's log the split response

      let wineRecommendations = [];
      for (let i = 0; i < responseSentences.length; i++) {
        const sentence = responseSentences[i];

        if (
          sentence.startsWith("1.") ||
          sentence.startsWith("2.") ||
          sentence.startsWith("3.")
        ) {
          wineRecommendations.push(sentence);
        }
      }

      const extractWines = (text) => {
        // Split the text into lines
        const lines = text.split("\n");

        // Initialize an empty array to hold our wines
        const wines = [];

        // Initialize an empty string to hold the current wine
        let currentWine = "";

        // For each line in our lines
        for (let line of lines) {
          // If the line is blank, this signifies the end of a wine
          if (line.trim() === "") {
            // If we have a current wine, push it to the array
            if (currentWine !== "") {
              wines.push(currentWine);
              currentWine = "";
            }
          } else {
            // If the line isn't blank, it's part of a wine
            // If we have a current wine, add a space and then the line
            // If we don't have a current wine, start a new one
            currentWine = currentWine === "" ? line : `${currentWine} ${line}`;
          }
        }

        // If we have a current wine at the end, push it to the array
        if (currentWine !== "") {
          wines.push(currentWine);
        }

        return wines;
      };

      console.log("Wine Recommendations: ", wineRecommendations); // Let's log the filtered recommendations
      setGeneratedSentence(wineRecommendations);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        console.log("Request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
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
      {generatedSentence.map((sentence, index) => (
        <h3 key={index}>{sentence}</h3>
      ))}
    </main>
  );
};

export default WineForm;
