export const generateSuggestion = (
  wineType,
  wineVarietal,
  levels,
  sweetnessLevels,
  value,
  sweetnessValue,
  isBodyDisabled,
  isSweetnessDisabled,
  getSelectedOptions
) => {
  const level = levels[value]; // Get the body level based on the value
  const selectedSweetness = sweetnessLevels[sweetnessValue]; // Get the selected sweetness level
  const selectedFlavors = getSelectedOptions();

  if (wineType && wineVarietal) {
    let suggestion = `You selected the ${wineType} wine ${wineVarietal}`;

    let descriptors = []; // An array to hold descriptors like body and sweetness

    if (!isBodyDisabled && level) {
      descriptors.push(`a ${level} body`);
    }

    if (!isSweetnessDisabled) {
      if (selectedSweetness === "dessert") {
        descriptors.push("rich sweetness");
      } else if (selectedSweetness === "dry") {
        descriptors.push("dry character");
      } else if (selectedSweetness === "semi-sweet") {
        descriptors.push("semi-sweet character");
      } else if (selectedSweetness === "sweet") {
        descriptors.push("sweet character");
      }
    }

    if (selectedFlavors) {
      let flavors = selectedFlavors.split(", ");
      if (flavors.length > 1) {
        let lastFlavor = flavors.pop();
        descriptors.push(`flavors of ${flavors.join(", ")} and ${lastFlavor}`);
      } else {
        descriptors.push(`flavor of ${flavors[0]}`);
      }
    }

    if (descriptors.length) {
      // Add "and" before the last descriptor
      if (descriptors.length > 1) {
        const lastDescriptor = descriptors.pop();
        suggestion +=
          " with " + descriptors.join(", ") + " and " + lastDescriptor;
      } else {
        suggestion += " with " + descriptors[0];
      }
    } else {
      suggestion += ".";
    }

    return suggestion; // Return the formatted suggestion
  } else {
    return "Please select a wine type and varietal."; // Return an error message if wineType or wineVarietal is missing
  }
};
