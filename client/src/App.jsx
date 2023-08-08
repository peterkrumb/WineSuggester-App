import styles from "./App.module.css";
import GlassWine from "./assets/Glass-Wine.jpeg";
import Select from "react-select";
import axios from "axios";
import { redVarietals, whiteVarietals, sparklingVarietals } from "./varietals";
import { useState, useEffect } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
// import { Slider, Typography } from "@material-ui/core";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

const WineForm = () => {
  const [wineType, setWineType] = useState(null);
  const [wineVarietal, setWineVarietal] = useState(null);
  const [varietals, setVarietals] = useState([]);
  const [generatedSentence, setGeneratedSentence] = useState([]); // Define the state to hold the generated sentence
  const [loadingMessage, setLoadingMessage] = useState(""); // Define the state to hold the loading message while the API call is being made
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const levels = [
    "light",
    "light-to-medium",
    "medium",
    "medium-to-full",
    "full",
  ];
  const sweetnessLevels = ["dry", "semi-sweet", "sweet", "dessert"];
  const [value, setValue] = useState(2);
  const [sweetnessValue, setSweetnessValue] = useState(2);

  useEffect(() => {
    if (loadingMessage === "") {
      return;
    }

    const timerId = setInterval(() => {
      //
      setLoadingMessage((prevMessage) => {
        if (!prevMessage)
          return "Wine Companion is thinking (This may take up to 30 seconds).";

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

  // create a handleAdvancedOptionsChange function which console logs that you selected advanced options
  const handleAdvancedOptionsChange = (e) => {
    console.log(e);
    setShowAdvancedOptions(!showAdvancedOptions);
    //if show advanced options is selected, we show the other 3 options
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let prompt = `${wineVarietal}`;
    if (showAdvancedOptions) {
      prompt += ` with a body of ${levels[value]} and a sweetness level of ${sweetnessLevels[sweetnessValue]}`;
    }
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
      setLoadingMessage(
        "Wine Assistant is Thinking (This may take up to 30 seconds)."
      );
    }
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleSweetnessChange = (e, newSweetnessValue) => {
    setSweetnessValue(newSweetnessValue);
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
      {/* here we add a checkbox for advanced options */}
      <div className={styles.checkbox}>
        <Checkbox onChange={handleAdvancedOptionsChange} />

        <label htmlFor="advancedOptions">
          <span className={styles.checkboxLabel}>Advanced Options</span>
        </label>
        {showAdvancedOptions && (
          <div className={styles.advancedOptionsContainer}>
            <div>
              <Typography>Body</Typography>
            </div>
            <Slider
              defaultValue={2}
              aria-labelledby="discrete-slider"
              size="large"
              step={1}
              marks
              min={0}
              max={4}
              value={value}
              onChange={handleChange}
              valueLabelFormat={(val) => levels[val]}
            />
            <div>{levels[value]}</div>
            <div>
              <p className="advancedLabel">Sweetness</p>
            </div>
            <Slider
              defaultValue={2}
              aria-labelledby="discrete-slider"
              size="large"
              step={1}
              marks
              min={0}
              max={3}
              value={sweetnessValue}
              onChange={handleSweetnessChange}
              valueLabelFormat={(val) => sweetnessLevels[val]}
            />
            <div>{sweetnessLevels[sweetnessValue]}</div>
          </div>
        )}
      </div>

      <button className={styles.button} type="button" onClick={onSubmit}>
        Get Wine Recommendation
      </button>
      <p>{generateSuggestion()}</p>
      <p>{loadingMessage}</p>
      {generatedSentence.map((wine, index) => (
        <Card key={index} style={{ marginBottom: "20px" }}>
          <CardContent>
            <Typography variant="h5">{wine.name}</Typography>
            <Typography color="textSecondary">
              <strong>Price:</strong> {wine.price}
            </Typography>
            <Typography>
              <strong>Description:</strong> {wine.description}
            </Typography>
            <Typography>
              <strong>Reason:</strong> {wine.reason}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </main>
  );
};

export default WineForm;
