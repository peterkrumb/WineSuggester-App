import styles from "./App.module.css";
import GlassWine from "./assets/Glass-Wine.jpeg";
import Select from "react-select";
import axios from "axios";

import { useState, useEffect } from "react";

import {
  redVarietals,
  whiteVarietals,
  sparklingVarietals,
} from "./varietals.js";

import {
  Chip,
  Paper,
  CardContent,
  Typography,
  Card,
  Slider,
  Checkbox,
  Switch,
} from "@mui/material";
import { styled } from "@mui/system";

const WineForm = () => {
  const [wineType, setWineType] = useState(null);
  const [wineVarietal, setWineVarietal] = useState(null);
  const [varietals, setVarietals] = useState([]);
  const [generatedSentence, setGeneratedSentence] = useState([]); // Define the state to hold the generated sentence
  const [loadingMessage, setLoadingMessage] = useState(""); // Define the state to hold the loading message while the API call is being made
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isBodyDisabled, setIsBodyDisabled] = useState(true);
  const [isSweetnessDisabled, setIsSweetnessDisabled] = useState(true);
  const [priceRange, setPriceRange] = useState([10, 250]);

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
  // Any other state, useEffect or functions related to this component

  const handleVarietalChange = (selectedOption) => {
    // Handle the varietal change
    const selectedVarietal = selectedOption ? selectedOption.value : null; // If the selected option is null, set the varietal to null
    setWineVarietal(selectedVarietal); // Set the varietal state
  };

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

  const StyledChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const handleClearAll = () => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        selected: false,
      }))
    );
  };

  const [options, setOptions] = useState([
    { label: "Blackberry", color: "#4A1931", selected: false },
    { label: "Cherry", color: "#8B0000", selected: false },
    { label: "Strawberry", color: "#FC5A8D", selected: false },
    { label: "Vanilla", color: "#F3E5AB", selected: false },
    { label: "Chocolate", color: "#3B2F2F", selected: false },
    { label: "Coffee", color: "#6F4E37", selected: false },
    { label: "Leather", color: "#8B4513", selected: false },
    { label: "Tobacco", color: "#79443B", selected: false },
    { label: "Violet", color: "#9400D3", selected: false },
    { label: "Plum", color: "#8E4585", selected: false },
    { label: "Apple", color: "#FFD700", selected: false },
    { label: "Pear", color: "#D1E231", selected: false },
    { label: "Peach", color: "#FFE5B4", selected: false },
    { label: "Honey", color: "#FFC30B", selected: false },
    { label: "Butter", color: "#F8D568", selected: false },
    { label: "Toast", color: "#D2691E", selected: false },
    { label: "Citrus", color: "#FFA500", selected: false },
    { label: "Lime", color: "#32CD32", selected: false },
    { label: "Gooseberry", color: "#85BB65", selected: false },
    { label: "Bell pepper", color: "#228B22", selected: false },
    { label: "Grass", color: "#4CAF50", selected: false },
    { label: "Melon", color: "#98DBC6", selected: false },
    { label: "Mineral", color: "#A9A9A9", selected: false },
    { label: "Cedar", color: "#556B2F", selected: false },
    { label: "Smoke", color: "#708090", selected: false },
    { label: "Mushroom", color: "#A0522D", selected: false },
    { label: "Nutmeg", color: "#F4C430", selected: false },
    { label: "Fig", color: "#621B18", selected: false },
    { label: "Rose", color: "#FF007F", selected: false },
    { label: "Apricot", color: "#FBCEB1", selected: false },
  ]);

  const handleAdvancedOptionsChange = (e) => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let prompt = `${wineVarietal}`;
    if (showAdvancedOptions) {
      prompt += ` with a body of ${levels[value]} and a sweetness level of ${sweetnessLevels[sweetnessValue]}`;
      const flavors = getSelectedOptions();
      if (flavors) {
        prompt += ` with flavors of ${flavors}`; // Append the selected flavors to your prompt
      }
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

  const toggleBody = () => {
    setIsBodyDisabled((prevState) => !prevState); // Toggle the value of isBodyDisabled
  };

  const toggleSweetness = () => {
    setIsSweetnessDisabled((prevState) => !prevState); // Toggle the value of isBodyDisabled
  };

  const getSelectedOptions = () => {
    return options
      .filter((option) => option.selected)
      .map((option) => option.label)
      .join(", "); // This will give you a string of selected options separated by commas
  };

  const handleAddOption = (optionToAdd) => {
    const updatedOptions = options.map((option) =>
      option.label === optionToAdd.label
        ? { ...option, selected: true }
        : option
    );
    setOptions(updatedOptions);
  };

  const handleRemoveOption = (optionToRemove) => {
    const updatedOptions = options.map((option) =>
      option.label === optionToRemove.label
        ? { ...option, selected: false }
        : option
    );
    setOptions(updatedOptions);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const generateSuggestion = () => {
    const level = levels[value]; // Get the body level based on the value
    const selectedFlavors = getSelectedOptions();

    if (wineType && wineVarietal) {
      let suggestion = `You selected the ${wineType} wine ${wineVarietal}`;

      if (
        (!isBodyDisabled && level) ||
        !isSweetnessDisabled ||
        selectedFlavors
      ) {
        if (!isBodyDisabled && level) {
          suggestion += ` with ${level} body`;
        }

        if (!isSweetnessDisabled) {
          suggestion += ` ${sweetnessLevels[sweetnessValue]}`;
        }

        if (selectedFlavors) {
          suggestion += ` and flavors of ${selectedFlavors}`;
        }
      } else {
        suggestion += ".";
      }

      return suggestion; // Return the formatted suggestion
    } else {
      return "Please select a wine type and varietal."; // Return an error message if wineType or wineVarietal is missing
    }
  };

  return (
    <div className="body">
      <main className={styles.main}>
        <img src={GlassWine} alt="" className={styles.icon} />
        <h3 className={styles.h3}>
          The world's most sophisticated wine assistant
        </h3>
        <div className="ripple-effect"></div>
        <form className={styles.form} onSubmit={onSubmit}>
          <div>
            <label htmlFor="wineType">Choose a wine type:</label>
            <Select
              id="wineType"
              name="wineType"
              value={wineTypeOptions.find(
                (option) => option.value === wineType
              )}
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
              onChange={handleVarietalChange}
              options={varietals.map((varietal) => ({
                value: varietal,
                label: varietal,
              }))}
            />
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={200}
              step={5}
              marks
              valueLabelFormat={(value) => `$${value}`}
              // valueLabelRender={(valueLabelProps) => (
              //   <span>{`$${valueLabelProps.value}`}</span>
              // )}
            />
          </div>
        </form>
        {/* here we add a checkbox for advanced options */}
        <div className={styles.checkbox}>
          <Checkbox onChange={handleAdvancedOptionsChange} />

          <label htmlFor="advancedOptions">
            <span className={styles.checkboxLabel}>Advanced Options</span>
          </label>
          {showAdvancedOptions && (
            <div className={styles.advancedOptionsContainer}>
              <Switch onChange={toggleBody} />
              {/* <div className="optionsContainer"> */}
              <div>
                <Typography>Body</Typography>
              </div>
              <Slider
                aria-label="Body"
                disabled={isBodyDisabled}
                sx={{
                  width: 300,
                }}
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
              <br />
              <br />
              {/* </div> */}
              <Switch onChange={toggleSweetness} />
              <p>Sweetness</p>

              <Slider
                disabled={isSweetnessDisabled}
                sx={{
                  width: 300,
                }}
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
              <div>
                <Paper
                  sx={{
                    height: "150px",
                    overflowY: "auto",
                    width: "320px",
                    position: "relative",
                  }}
                >
                  {options
                    .filter((option) => option.selected)
                    .map((option, index) => (
                      <StyledChip
                        key={index}
                        label={option.label}
                        onDelete={() => handleRemoveOption(option)}
                        color="primary"
                        style={{ backgroundColor: option.color }}
                      />
                    ))}
                  {options.length > 0 && (
                    <Chip
                      label="Clear All"
                      onClick={handleClearAll}
                      color="primary"
                      // add more styles or props as required
                    />
                  )}
                </Paper>
                <div className={styles.childContainer}>
                  <Typography variant="h5">Notes</Typography>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                      marginTop: "10px",
                    }}
                  ></div>
                </div>
              </div>
              <div className={styles.childContainer}>
                {options
                  .filter((option) => !option.selected)
                  .map((option, index) => (
                    <StyledChip
                      key={index}
                      label={option.label}
                      clickable
                      onClick={() => handleAddOption(option)}
                      style={{ backgroundColor: option.color }}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>

        <button className={styles.button} type="button" onClick={onSubmit}>
          Get Wine Recommendation
        </button>
        <p>{generateSuggestion()}</p>

        <p>{loadingMessage}</p>
        {generatedSentence.map((wine, index) => (
          <div className="cardContainer">
            <Card
              key={index}
              style={{
                marginBottom: "20px",
                width: "1000px",
                margin: "10px",
              }}
            >
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
          </div>
        ))}
      </main>
    </div>
  );
};

export default WineForm;
