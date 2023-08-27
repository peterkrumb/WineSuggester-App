import styles from "./App.module.css";
import Select from "react-select";
import axios from "axios";
import { generateSuggestion } from "./components/suggestionGenerator";
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
  Snackbar,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";

const WineForm = () => {
  const [wineType, setWineType] = useState(null);
  const [wineVarietal, setWineVarietal] = useState(null);
  const [varietals, setVarietals] = useState([]);
  const [generatedSentence, setGeneratedSentence] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isBodyDisabled, setIsBodyDisabled] = useState(false);
  const [isSweetnessDisabled, setIsSweetnessDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const levels = [
    "light",
    "light-to-medium",
    "medium",
    "medium-to-full",
    "full",
  ];
  const sweetnessLevels = ["dry", "semi-sweet", "sweet", "dessert"];
  const [value, setValue] = useState(null);
  const [sweetnessValue, setSweetnessValue] = useState(null);

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
    setWineVarietal(selectedVarietal);
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

  // Clear all chips from selected flavors
  const handleClearAllChips = () => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        selected: false,
      }))
    );
  };

  const handleClearAll = () => {
    //reset all advanced options
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({
        ...option,
        selected: false,
      }))
    );
    setIsBodyDisabled(true);
    setIsSweetnessDisabled(true);
    setValue(2);
    setSweetnessValue(2);
    setPriceRange([0, 250]);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
    console.log("handleAdvancedOptionsChange called");
    setShowAdvancedOptions((prev) => !prev);
    if (sweetnessValue === null && !isSweetnessDisabled) {
      setSweetnessValue(2); // set to sweet if not set before
    }
    if (value === null && !isBodyDisabled) {
      setValue(2);
    }
    console.log(showAdvancedOptions);
  };

  const validateForm = () => {
    if (!wineVarietal) {
      setAlertMessage("Choose a wine first");
      return false;
    }
    return true;
  };

  const constructPrompt = () => {
    let prompt = `${wineVarietal}`;

    if (!isBodyDisabled) {
      prompt += ` with a body of ${levels[value]}`;
    }
    if (!isSweetnessDisabled) {
      prompt += ` and a sweetness level of ${sweetnessLevels[sweetnessValue]}`;
    }
    const flavors = getSelectedOptions();
    if (flavors) {
      prompt += ` with flavors of ${flavors}`;
    }
    if (priceRange[0] > 0 || priceRange[1] < 250) {
      prompt += ` within a price range of $${priceRange[0]} to $${priceRange[1]}`;
    }

    return prompt;
  };

  const fetchWineRecommendations = async (prompt) => {
    const url = "https://dry-sea-76064-c9baeed38795.herokuapp.com/generate";
    try {
      const response = await axios.post(url, { queryDescription: prompt });
      const responseSentences = response.data.response.split("\n");

      let wineObjects = [];
      let currentWine = {};

      for (let i = 0; i < responseSentences.length; i++) {
        // For each sentence in the response
        const sentence = responseSentences[i].trim(); // Remove any leading or trailing spaces

        if (sentence.startsWith("Wine Recommendation")) {
          if (currentWine.name) {
            wineObjects.push(currentWine);
            currentWine = {};
          }
          currentWine.name = sentence.split(": ")[1];
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
      return wineObjects;
    } catch (error) {
      console.error("Error:", error);
      return [];
    } finally {
      setLoadingMessage("");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const prompt = constructPrompt();

    console.log("Prompt: ", prompt);
    setLoadingMessage(
      "Wine Assistant is Thinking (This may take up to 30 seconds)."
    );
    const recommendations = await fetchWineRecommendations(prompt);
    setGeneratedSentence(recommendations);
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleSweetnessChange = (e, newSweetnessValue) => {
    setSweetnessValue(newSweetnessValue);
  };

  const toggleBody = () => {
    setIsBodyDisabled((prevState) => !prevState);
  };

  const toggleSweetness = () => {
    setIsSweetnessDisabled((prevState) => !prevState);
  };

  // Filter through the options array, determines if the flavor was selected or not, and returns them separated by commas for "generateSuggestion"
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

  return (
    <div className="body">
      <main className={styles.main}>
        {/* <Header title="Wine Assistant" /> */}
        {/* <img src={GlassWine} alt="" className={styles.icon} /> */}
        {/* <h3 className={styles.h3}>
          The world's most sophisticated wine assistant
        </h3> */}
        <div className={styles.mainContentContainer}>
          <form className={styles.form} onSubmit={onSubmit}>
            <label htmlFor="wineType">Choose a wine type:</label>
            <div>
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
            <div>
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
          </form>

          {/* {showAdvancedOptions && (
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
          )} */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={1750}
            onClose={handleCloseSnackbar}
            message="Filters reset"
          />
          <Button
            disableRipple
            onClick={handleAdvancedOptionsChange}
            sx={{
              margin: "10px 0px 0px 0px",
              background: "linear-gradient(135deg, #708090 0%, #000000 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #778899 0%, #191919 100%)",
              },
              transition: "transform 0.2s ease-in-out",
              "&:active": {
                transform: "scale(0.95)",
              },

              border: 0,
              borderRadius: 5,
              boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
              color: "#f5f5f5",
              padding: "10px 20px",
              textTransform: "capitalize",
              fontFamily: "Fira Sans",
              fontSize: 16,
              fontWeight: 800,
              // letterSpacing: 1.5,
            }}
          >
            Advanced Options
          </Button>
          <Button
            disableRipple
            onClick={onSubmit}
            sx={{
              margin: "10px 0px 0px 0px",
              background: "linear-gradient(135deg, #8B0000 0%, #4A1931 100%)",

              "&:hover": {
                background: "linear-gradient(135deg, #6E0808 0%, #2E0505 100%)",
              },
              transition: "transform 0.2s ease-in-out",
              "&:active": {
                transform: "scale(0.95)", // scales the button down to 95% of its original size
              },

              border: 0,
              borderRadius: 5,
              boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
              color: "#f5f5f5",
              padding: "10px 20px",
              textTransform: "capitalize",
              fontFamily: "Fira Sans",
              fontSize: 16,
              fontWeight: 800,
            }}
          >
            Get Wine Recommendation
          </Button>
          {/* <button className={styles.recommendationButton} type="button" onClick={onSubmit}>
            Get Wine Recommendation
          </button> */}
        </div>
        <p>
          {generateSuggestion(
            wineType,
            wineVarietal,
            levels,
            sweetnessLevels,
            value,
            sweetnessValue,
            isBodyDisabled,
            isSweetnessDisabled,
            getSelectedOptions
          )}
        </p>
        {/* {showAdvancedOptions && ( */}
        <div
          className={`${styles.advancedOptionsContainer} ${
            showAdvancedOptions ? styles.open : ""
          }`}
          style={{ maxHeight: showAdvancedOptions ? "70vh" : "0vh" }}
        >
          <h3>Filter</h3>
          <CloseIcon
            className={styles.closeIcon}
            onClick={() => {
              handleAdvancedOptionsChange();
            }}
            sx={{
              fontSize: "2.1em",
            }}
          />
          <h4>Price</h4>
          <Slider
            label="Price Range"
            sx={{ marginTop: "0px", marginBottom: "20px", width: "300px" }}
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={500}
            step={5}
            marks
            valueLabelFormat={(value) =>
              value === 500 ? "$500+" : `$${value}`
            }
          />
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
          />
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
          <br />
          <br />
          <Switch onChange={toggleBody} checked={!isBodyDisabled} />
          <h4>Body</h4>
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
          <Switch onChange={toggleSweetness} checked={!isSweetnessDisabled} />
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
          {!isSweetnessDisabled && <div>{sweetnessLevels[sweetnessValue]}</div>}
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
                    onClick={handleClearAllChips}
                    color="primary"
                    style={{ fontFamily: "source sans pro, sans-serif" }}
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
                    style={{
                      backgroundColor: option.color,
                      margin: "4px",
                      fontFamily: "source sans pro, sans-serif",
                    }}
                  />
                ))}
            </Paper>
            <br />
            <h3>Notes</h3>
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
                    fontFamily: "Garamond Premier Pro Display",
                    fontSize: "20px",
                  }}
                />
              ))}
          </div>
          <button className={styles.clearBtn} onClick={handleClearAll}>
            Clear All
          </button>
          <button
            className={styles.applyFilterBtn}
            onClick={handleAdvancedOptionsChange}
          >
            Apply Filter
          </button>
        </div>

        <Snackbar
          open={!!alertMessage}
          autoHideDuration={6000}
          onClose={() => setAlertMessage("")}
          message={alertMessage}
        />
        <p>{loadingMessage}</p>
        <div className={styles.cardBox}>
          {generatedSentence.map((wine, index) => (
            <div className={styles.cardContainer}>
              <Card
                key={index}
                className={styles.suggestionCard}
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                  borderRadius: 17,
                }}
              >
                <CardContent>
                  <Typography
                    style={{
                      fontFamily: "Alegreya",
                      color: "#333",
                      fontSize: "1.5em",
                    }}
                    variant="h5"
                  >
                    <span
                      style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        padding: "4px 10px 10px 10px",
                        borderRadius: "15px",
                        boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                        textShadow:
                          "0px 3px 0px #b2a98f, 0px 14px 10px rgba(0,0,0,0.15), 0px 24px 2px rgba(0,0,0,0.1),  0px 34px 30px rgba(0,0,0,0.1)",
                      }}
                    >
                      {wine.name}
                    </span>
                    <hr />
                  </Typography>
                  <Typography
                    style={{
                      fontFamily: "Alegreya",
                      color: "#333",
                      fontSize: ".9em",
                      background: "rgba(255, 255, 255, 0.6)",
                      padding: "10px",
                      // borderRadius: "5px",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                      borderTopLeftRadius: "25px",
                      borderTopRightRadius: "25px",
                    }}
                  >
                    <span>Price:</span> {wine.price}
                  </Typography>
                  <Typography
                    style={{
                      fontFamily: "Alegreya",
                      // fontWeight: 700,

                      fontSize: ".7em",
                      color: "#333",
                      background: "rgba(255, 255, 255, 0.6)",
                      padding: "10px",
                      // border: "1px solid #333",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                      textShadow: "2px 2px 5px #aaa",
                    }}
                  >
                    <span>Description:</span> {wine.description}
                  </Typography>
                  <Typography
                    style={{
                      fontFamily: "Alegreya",
                      color: "#333",
                      fontSize: ".7em",
                      // fontWeight: 700,
                      background: "rgba(255, 255, 255, 0.6)",
                      padding: "10px",
                      // borderRadius: "5px",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                      borderBottomLeftRadius: "25px",
                      borderBottomRightRadius: "25px",
                    }}
                  >
                    <span>Reason:</span> {wine.reason}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WineForm;
