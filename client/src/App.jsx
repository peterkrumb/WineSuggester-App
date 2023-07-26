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
      const response = await axios.post("http://localhost:8000/generate", {
        queryDescription: prompt,
      });
      console.log("Raw Response: ", response.data.response); // Let's log raw response
      const responseSentences = response.data.response.split("\n");
      console.log("Response Sentences: ", responseSentences); // Let's log the split response
      const wineRecommendations = responseSentences
        .filter((sentence) => sentence.match(/^\d/))
        .map((sentence) => sentence.trim() + ".");
      console.log("Wine Recommendations: ", wineRecommendations); // Let's log the filtered recommendations
      setGeneratedSentence(wineRecommendations);
    } catch (error) {
      console.error("Failed to generate response", error);
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
