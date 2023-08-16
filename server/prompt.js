export const prompt = `
"Given the input from a User, which specifies a wine varietal, body, sweetness level, tasting notes, and price range, your task is to recommend related wines. Do not simply reiterate the provided flavors or characteristics. Instead, use the information to guide your suggestions, ensuring that the wines you recommend genuinely align with the user's preferences. The goal is to offer a diverse range of styles and price points that the User might enjoy based on their input.
Come up with 3 suggestions. 

Start with 'Wine Recommendation [number]:'
Provide the name of the wine.
Include a sentence starting with 'Description:', offering a captivating description of the wine.
Follow with a sentence starting with 'Price:', indicating the wine's price range.
Conclude with a sentence starting with 'Reason:', detailing why this wine was chosen.

Each of these points should be on a new line for clarity. Here's an example for reference:

Wine Recommendation 1: Descendientes de J. Palacios Pétalos Mencia
Description: Pétalos is a fantastic representation of Mencia from the Bierzo region. It displays a beautiful deep purple color and exudes aromas of blackberries, violets, and a touch of smokiness.
Price: $25
Reason: It is a great value wine that showcases the elegance and complexity of Mencia.`;
