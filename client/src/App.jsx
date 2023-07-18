import styles from "./App.module.css";
import GlassWine from "./assets/Glass-Wine.jpeg";

import { useState } from "react";

function App() {
  //  use the useState hook to define a state variable called queryDescription and a corresponding setter function called setQueryDescription. Initial value is an empty string
  const [queryDescription, setQueryDescription] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(queryDescription);
  };
  return (
    <main className={styles.main}>
      <img src={GlassWine} alt="" className={styles.icon} />
      <h3>World's most sophisticated wine assistant</h3>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="query-description"
          placeholder="describe your query"
          //when the user types something in the input field, this code captures that value and updates the queryDescription variable to store it. The updated value can then be used in the component to display or process the user's input in some way. The value of the input field is set to the current value of queryDescription, and when the user types something, the onChange event handler is triggered, which calls the setQueryDescription function to update the value of queryDescription to the new value of the input field. This is how the value of the input field is stored in the component's state.
          onChange={(e) => setQueryDescription(e.target.value)}
        />
        <input type="submit" value="generate query" />
      </form>
    </main>
  );
}

export default App;
