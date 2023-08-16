import styles from "./App.module.css";
import GlassWine from "./assets/Glass-Wine.jpeg";
import Select from "react-select";
import axios from "axios";
import Header from "./components/Header";

import { useState, useEffect, useRef } from "react";

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
import CloseIcon from "@mui/icons-material/Close";
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
  const [isAdvancedOptionsChecked, setIsAdvancedOptionsChecked] =
    useState(false);

  const [priceRange, setPriceRange] = useState([10, 250]);
  const [selectOpen, setSelectOpen] = useState(false);

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

  const handleVarietalChange = (selectedOption) => {
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
    {
      label: "Blackberry",
      color: "#4A1931",
      selected: false,
      textColor: "#FFFFFF",
    },
    {
      label: "Cherry",
      color: "#8B0000",
      selected: false,
      textColor: "#FFFFFF",
    },
    {
      label: "Strawberry",
      color: "#FC5A8D",
      selected: false,
      textColor: "#FFFFFF",
    },
    {
      label: "Vanilla",
      color: "#F3E5AB",
      selected: false,
      textColor: "#4A1931",
    },
    {
      label: "Chocolate",
      color: "#3B2F2F",
      selected: false,
      textColor: "#F3E5AB",
    },
    {
      label: "Coffee",
      color: "#6F4E37",
      selected: false,
      textColor: "#F3E5AB",
    },
    {
      label: "Leather",
      color: "#8B4513",
      selected: false,
      textColor: "#FFFFFF",
    },
    {
      label: "Tobacco",
      color: "#79443B",
      selected: false,
      textColor: "#FFFFFF",
    },
    {
      label: "Violet",
      color: "#9400D3",
      selected: false,
      textColor: "#FFFFFF",
    },
    { label: "Peach", color: "#FFE5B4", selected: false, textColor: "#4A1931" },
    { label: "Honey", color: "#FFC30B", selected: false, textColor: "#4A1931" },
    {
      label: "Butter",
      color: "#F8D568",
      selected: false,
      textColor: "#4A1931",
    },
    { label: "Toast", color: "#D2691E", selected: false, textColor: "#FFFFFF" },
    {
      label: "Citrus",
      color: "#FFA500",
      selected: false,
      textColor: "#4A1931",
    },
    { label: "Lime", color: "#32CD32", selected: false, textColor: "#4A1931" },
    { label: "Melon", color: "#98DBC6", selected: false, textColor: "#4A1931" },
    {
      label: "Mineral",
      color: "#A9A9A9",
      selected: false,
      textColor: "#4A1931",
    },
    { label: "Cedar", color: "#556B2F", selected: false, textColor: "#FFFFFF" },
    { label: "Smoke", color: "#708090", selected: false, textColor: "#FFFFFF" },
    { label: "Pear", color: "#D1E231", selected: false, textColor: "#4A1931" },
  ]);

  const handleAdvancedOptionsChange = (e) => {
    setShowAdvancedOptions((prev) => !prev);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let prompt = `${wineVarietal}`;

    // Check body state and append if not in its default state
    if (!isBodyDisabled) {
      prompt += ` with a body of ${levels[value]}`;
    }

    // Check sweetness state and append if not in its default state
    if (!isSweetnessDisabled) {
      prompt += ` and a sweetness level of ${sweetnessLevels[sweetnessValue]}`;
    }

    // Check flavors state and append if any flavors are selected
    const flavors = getSelectedOptions();
    if (flavors) {
      prompt += ` with flavors of ${flavors}`; // Append the selected flavors to your prompt
    }

    // Check price range state and append if it's not in its default range
    if (priceRange[0] > 0 || priceRange[1] < 250) {
      prompt += ` within a price range of $${priceRange[0]} to $${priceRange[1]}`;
    }
    console.log("Prompt: ", prompt);
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
        <Header title="Wine Assistant" />
        <img src={GlassWine} alt="" className={styles.icon} />
        <h3 className={styles.h3}>
          The world's most sophisticated wine assistant
        </h3>

        <form className={styles.form} onSubmit={onSubmit}>
          <label htmlFor="wineType">Choose a wine type:</label>
          <div style={{ zIndex: 1001 }}>
            <Select
              id="wineType"
              name="wineType"
              value={wineTypeOptions.find(
                (option) => option.value === wineType
              )}
              onChange={handleWineTypeChange}
              options={wineTypeOptions}
              onOpen={() => setSelectOpen(true)}
              onClose={() => setSelectOpen(false)}
            />
          </div>
          <br />

          <label htmlFor="wineVarietal">Choose a wine varietal:</label>
          <div style={{ zIndex: 1000 }}>
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
          </div>
          <Slider
            sx={{
              margin: "20px",
            }}
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
        </form>
        {/* here we add a checkbox for advanced options */}
        <div className={styles.checkbox}>
          <Checkbox
            onChange={handleAdvancedOptionsChange}
            checked={isAdvancedOptionsChecked}
          />

          <label htmlFor="advancedOptions">
            <span className={styles.checkboxLabel}>Advanced Options</span>
          </label>
          {showAdvancedOptions && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1001,
              }}
              className="overlay"
            ></div>
          )}
          {showAdvancedOptions && (
            <div className={styles.advancedOptionsContainer}>
              <h3>Filter</h3>
              <CloseIcon
                onClick={() => {
                  handleAdvancedOptionsChange();
                }}
                sx={{
                  position: "absolute",
                  top: "20px", // Adjust this as needed
                  right: "20px", // Adjust this as needed
                  cursor: "pointer",
                }}
              />
              <Switch onChange={toggleBody} checked={!isBodyDisabled} />
              <h4 className="aocHeader">Body</h4>
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
              {!isBodyDisabled && <div>{levels[value]}</div>} <br />
              {/* </div> */}
              <Switch
                onChange={toggleSweetness}
                checked={!isSweetnessDisabled}
              />
              <h4>Sweetness</h4>
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
              {!isSweetnessDisabled && (
                <div>{sweetnessLevels[sweetnessValue]}</div>
              )}
              <br />
              <div>
                <Paper
                  sx={{
                    height: "150px",
                    overflowY: "auto",
                    width: "320px",
                    position: "relative",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    {options.length > 0 && (
                      <Chip
                        label="Clear All"
                        onClick={handleClearAll}
                        color="primary"
                      />
                    )}
                  </div>

                  <div
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                    }}
                  ></div>
                  {options
                    .filter((option) => option.selected)
                    .map((option, index) => (
                      <StyledChip
                        key={index}
                        label={option.label}
                        onDelete={() => handleRemoveOption(option)}
                        color="primary"
                        style={{ backgroundColor: option.color, margin: "4px" }}
                      />
                    ))}
                  {/* {options.length > 0 && (
                    <Chip
                      label="Clear All"
                      onClick={handleClearAll}
                      color="primary"
                      sx={{
                        position: "absolute", // Positioning it absolutely
                        top: "8px", // Some gap from the top
                        right: "8px", // Some gap from the right
                      }}
                      // add more styles or props as required
                    />
                  )} */}
                </Paper>
                <br />
                <Typography variant="h5">Notes</Typography>
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
                      style={{
                        backgroundColor: option.color,
                        color: option.textColor,
                        fontFamily: "source sans pro, sans-serif",
                      }}
                    />
                  ))}
              </div>
              <button
                className={styles.applyFilterBtn}
                onClick={handleAdvancedOptionsChange}
              >
                Apply Filter
              </button>
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
