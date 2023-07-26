import React, { useState } from "react";

import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

function PriceSlider() {
  const [value, setValue] = useState({ min: 20, max: 80 });

  return <Slider />;
}

export default PriceSlider;
