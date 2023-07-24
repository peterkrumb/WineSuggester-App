import styles from "./App.module.css";
import GlassWine from "./assets/Glass-Wine.jpeg";
import Select from "react-select";

import { useState } from "react";

const WineForm = () => {
  const [wineType, setWineType] = useState("red");
  const [wineVarietal, setWineVarietal] = useState(null);
  const [varietals, setVarietals] = useState([]);

  const handleWineTypeChange = (event) => {
    setWineType(event.target.value);
    if (event.target.value === "red") {
      setVarietals([
        "Cabernet Sauvignon",
        "Merlot",
        "Pinot Noir",
        "Syrah/Shiraz",
        "Zinfandel",
        "Malbec",
        "Sangiovese",
        "Tempranillo",
        "Grenache/Garnacha",
        "Nebbiolo",
        "Gamay",
        "Cabernet Franc",
        "Carmenere",
        "Montepulciano d'Abruzzo",
        "Barbera",
        "Barbaresco",
        "Pinotage",
        "Mourvedre/Monastrell",
        "Petit Verdot",
        "Dolcetto",
        "Primitivo",
        "Tannat",
        "Touriga Nacional",
        "Aglianico",
        "Nero d'Avola",
        "Mencia",
        "Cinsault",
        "Corvina",
        "Dornfelder",
        "Blaufränkisch",
        "Zweigelt",
        "Bobal",
        "Negroamaro",
        "Xinomavro",
        "Sagrantino",
        "Tinta de Toro",
        "Alicante Bouschet",
        "Carignan/Carignano",
        "Durif/Petite Sirah",
        "Lagrein",
        "Tinta Roriz",
        "Baga",
        "Bonarda/Charbono",
        "Graciano",
        "Trousseau",
        "Valpolicella Blend",
        "Priorat Blend",
        "Châteauneuf-du-Pape Blend",
        "Bordeaux Blend",
        "Super Tuscan Blend",
        "Rhone Blend",
        "Rioja Blend",
        "Ribera del Duero",
        "Barolo",
        "Brunello di Montalcino",
        "Amarone della Valpolicella",
        "Chianti",
        "Pomerol and Saint-Émilion",
        "Côte-Rôtie",
        "Hermitage",
        "Cornas",
        "Saint-Joseph",
        "Côte de Nuits",
        "Côte de Beaune",
        "Pauillac",
        "Margaux",
        "Saint-Julien",
        "Haut-Médoc",
        "Saint-Estèphe",
        "Pessac-Léognan",
        "Graves",
        "Sauternes",
        "Bandol",
        "Tavel",
        "Côtes du Rhône",
        "Gigondas",
        "Vacqueyras",
        "Lirac",
        "Taurasi",
        "Vino Nobile di Montepulciano",
        "Rosso di Montalcino",
        "Morellino di Scansano",
        "Montefalco Rosso",
        "Carmignano",
        "Bolgheri",
        "Amarone della Valpolicella",
        "Ripasso della Valpolicella",
        "Recioto della Valpolicella",
        "Bardolino",
        "Soave",
        "Valpolicella",
        "Chianti Classico",
        "Chianti Rufina",
        "Chianti Colli Senesi",
        "Chianti Colli Fiorentini",
        "Chianti Montespertoli",
        "Chianti Montalbano",
        "Chianti Colli Aretini",
        "Chianti Colli Pisane",
      ]);
    } else {
      setVarietals([
        "Chardonnay",
        "Sauvignon Blanc",
        "Riesling",
        "Pinot Grigio/Pinot Gris",
        "Gewürztraminer",
        "Moscato/Muscat",
        "Semillon",
        "Viognier",
        "Chenin Blanc",
        "Verdejo",
        "Albariño",
        "Torrontés",
        "Garganega",
        "Vermentino",
        "Trebbiano/Ugni Blanc",
        "Grüner Veltliner",
        "Marsanne",
        "Roussanne",
        "Melon de Bourgogne",
        "Grenache Blanc",
        "Picpoul",
        "Furmint",
        "Sylvaner",
        "Müller-Thurgau",
        "Pinot Blanc",
        "Arneis",
        "Falanghina",
        "Verdicchio",
        "Fiano",
        "Greco",
        "Cortese",
        "Godello",
        "Assyrtiko",
        "Chasselas",
        "Scheurebe",
        "Vidal Blanc",
        "Champagne Blend",
        "Burgundy White (Chardonnay)",
        "Chablis (Chardonnay)",
        "Pouilly-Fuissé (Chardonnay)",
        "Meursault (Chardonnay)",
        "Montrachet (Chardonnay)",
        "Sancerre (Sauvignon Blanc)",
        "Pouilly-Fumé (Sauvignon Blanc)",
        "Vouvray (Chenin Blanc)",
        "Savennières (Chenin Blanc)",
        "Alsace Riesling",
        "Alsace Gewürztraminer",
        "Alsace Pinot Gris",
        "Muscadet (Melon de Bourgogne)",
        "Soave (Garganega)",
        "Verdicchio dei Castelli di Jesi (Verdicchio)",
        "Vermentino di Gallura (Vermentino)",
        "Fiano di Avellino (Fiano)",
        "Greco di Tufo (Greco)",
        "Gavi (Cortese)",
        "Orvieto (Trebbiano, Grechetto)",
        "Muscadet Sèvre-et-Maine (Melon de Bourgogne)",
        "Tokaji (Furmint, Hárslevelű)",
        "Sauternes (Sémillon, Sauvignon Blanc, Muscadelle)",
        "Barsac (Sémillon, Sauvignon Blanc, Muscadelle)",
        "Monbazillac (Sémillon, Sauvignon Blanc, Muscadelle)",
        "Jurançon (Gros Manseng, Petit Manseng)",
        "Pacherenc du Vic-Bilh (Petit Courbu, Petit Manseng)",
        "Vouvray Moelleux (Chenin Blanc)",
        "Quarts de Chaume (Chenin Blanc)",
        "Bonnezeaux (Chenin Blanc)",
        "Coteaux du Layon (Chenin Blanc)",
      ]);
    }
  };

  const handleWineVarietalChange = (event) => {
    setWineVarietal(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`You selected ${wineType} wine, varietal ${wineVarietal}`);
  };

  return (
    <main className={styles.main}>
      <img src={GlassWine} alt="" className={styles.icon} />
      <h3 className={styles.h3}>
        The world's most sophisticated wine assistant
      </h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="wineType">Choose a wine type:</label>
        <select
          id="wineType"
          name="wineType"
          value={wineType}
          onChange={handleWineTypeChange}
        >
          <option value="red">Red</option>
          <option value="white">White</option>
        </select>

        <label htmlFor="wineVarietal">Choose a wine varietal:</label>
        <Select
          id="wineVarietal"
          name="wineVarietal"
          value={varietals.find((option) => option.value === wineVarietal)}
          onChange={(selectedOption) => setWineVarietal(selectedOption.value)}
          options={varietals.map((varietal) => ({
            value: varietal,
            label: varietal,
          }))}
        />
      </form>
    </main>
  );
};

export default WineForm;
