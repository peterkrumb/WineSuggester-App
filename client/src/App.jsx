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
  const [generatedSentence, setGeneratedSentence] = useState(""); // Define the state to hold the generated sentenc
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

  const onSubmit = (event) => {
    event.preventDefault();
    const prompt = `Suggest 3 wines that are similar to ${wineVarietal}. Be as descriptive as possible and give details as to why you selected these.`;
    try {
      const response = axios.post("http://localhost:8000/generate", {
        queryDescription: prompt,
      });
      setGeneratedSentence(response.data.response);
    } catch (error) {
      console.error("Failed to generate response", error);
    }
    console.log(prompt);
    console.log(wineType);
  };

  // // Code to send API request and handle response will be added here
  // const handleFetchRecommendation = async () => {
  //   try {
  //     const generatedSentence = `Suggest a wine that is similar to ${wineType} wine ${wineVarietal}. Be as descriptive as possible end give details as to why you selected these.`;
  //     // Make a POST request to your server's API endpoint
  //     const response = await fetch("http://localhost:8000/api/recommendation", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ question: generatedSentence }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(
  //         "Error fetching recommendation: Network response was not ok"
  //       );
  //     }

  //     const data = await response.json();
  //     console.log(data); // Or update your state with the recommendation data
  //   } catch (error) {
  //     console.error("Error fetching recommendation:", error.message);
  //   }
  // };
  const generateSuggestion = () => {
    if (wineType && wineVarietal) {
      return `Suggest a wine that is similar to ${wineVarietal} ${wineType} wine.`;
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

      {/* <div
        style={{
          width: "375px",
          height: "57px",
          padding: "10px",
          margin: "0 auto",
          backgroundColor: "#9B9B9B",
          verticalAlign: "middle",
          boxSizing: "border-box",
        }}
      >
        <form method="GET" action="https://www.wine-searcher.com/find">
          <input type="hidden" name="Xfromsearch" value="Y" />
          <div
            style={{
              float: "right",
              width: "49px",
              height: "37px",
              borderRadius: "0px 2px 2px 0px",
              boxSizing: "border-box",
            }}
          >
            <button
              style={{
                display: "inline-block",
                background: "none repeat scroll 0 0 #0076D6",
                height: "37px",
                width: "100%",
                padding: "0",
                border: "medium none",
                borderRadius: "0px 2px 2px 0px",
                boxSizing: "border-box",
              }}
              name="searchbutton"
              tabindex="3"
              onClick={() => console.log("Search button clicked")}
            >
              Search
            </button>
          </div>
          <div
            style={{
              textAlign: "left",
              width: "355px",
              borderRadius: "2px 0px 0px 2px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{ float: "right", width: "75px", boxSizing: "border-box" }}
            >
              <input
                style={{
                  fontSize: "14px",
                  fontFamily: "Verdana",
                  height: "37px",
                  width: "100%",
                  background: "#fff",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  margin: "0",
                  outline: "0 none",
                  boxSizing: "border-box",
                  border: "0 none",
                }}
                type="text"
                size="4"
                maxlength="4"
                id="Xvintage"
                name="Xvintage"
                value={vintage}
                onChange={(e) => setVintage(e.target.value)}
                tabindex="2"
                title="Vintage (use 'NV' for non-vintage). Leave blank to search all vintages."
                placeholder="Vintage"
              />
            </div>
            <div
              style={{
                textAlign: "left",
                width: "231px",
                overflow: "visible",
                margin: "0",
                background: "#fff",
                borderRadius: "2px 0px 0px 2px",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              <input
                style={{
                  fontSize: "14px",
                  fontFamily: "Verdana",
                  height: "37px",
                  borderRadius: "2px 0px 0px 2px",
                  border: "0 none",
                  outline: "none",
                  paddingLeft: "45px",
                  paddingRight: "10px",
                  verticalAlign: "top",
                  width: "99%",
                  textOverflow: "ellipsis",
                  background: "#fff",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "25px 14px",
                  backgroundPosition: "10px",
                  position: "relative",
                  boxSizing: "border-box",
                }}
                type="text"
                maxlength="100"
                name="Xwinename"
                id="Xwinename"
                value={wineName}
                onChange={(e) => setWineName(e.target.value)}
                tabindex="1"
                title="Search phrase"
                placeholder="Type any wine name"
                autocomplete="off"
                spellcheck="false"
                dir="auto"
              />
              <div
                style={{
                  borderRight: "1px solid #999",
                  height: "25px",
                  width: "1px",
                  position: "absolute",
                  right: "-0.5px",
                  top: "5px",
                }}
              />
            </div>
          </div>
        </form>
      </div> */}
    </main>
  );
};

export default WineForm;
