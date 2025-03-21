import { useState } from 'react';
import './recipepage.css';

type DietaryRequirement = {
  [key: string]: boolean;
  egg: boolean;
  milk: boolean;
  soya: boolean;
  nuts: boolean;
  peanuts: boolean;
  gluten: boolean;
  lupin: boolean;
  sulphites: boolean;
  mustard: boolean;
  celery: boolean;
  sesame: boolean;
  fish: boolean;
  molluscs: boolean;
  crustaceans: boolean;
};

const RecipeDashboard = () => {
  const [selectedNav, setSelectedNav] = useState<'recipes' | 'dashboard'>('recipes');
  
  const [dietaryRequirements, setDietaryRequirements] = useState<DietaryRequirement>({
    egg: false,
    milk: false,
    soya: false,
    nuts: false,
    peanuts: false,
    gluten: false,
    lupin: false,
    sulphites: false,
    mustard: false,
    celery: false,
    sesame: false,
    fish: false,
    molluscs: false,
    crustaceans: false,
  });
  const [ingredientTags, setIngredientTags] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('medium');

  const handleDietaryChange = (requirement: string) => {
    setDietaryRequirements(prev => ({
      ...prev,
      [requirement]: !prev[requirement]
    }));
  };

  const addIngredientTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && ingredientInput.trim()) {
      setIngredientTags(prev => [...prev, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const removeIngredientTag = (index: number) => {
    setIngredientTags(prev => prev.filter((_, i) => i !== index));
  };

  const generateRecipes = () => {
    console.log('Generating recipes...');
  };

  const regenerate = () => {
    console.log('Regenerating recipes...');
  };

  return (
    <div className="main-container">
      <header className="header">
        <div className="nav-buttons">
          <button
            className={`nav-button ${selectedNav === 'recipes' ? 'selected' : ''}`}
            onClick={() => setSelectedNav('recipes')}
          >
            Recipes
          </button>
          <button
            className={`nav-button ${selectedNav === 'dashboard' ? 'selected' : ''}`}
            onClick={() => setSelectedNav('dashboard')}
          >
            Dashboard
          </button>
        </div>
        <a href="#" className="auth-button">Login / Sign up</a>
      </header>

      <div className="dashboard-wrapper">
        <section className="filters-section">
          <h3>Allergens</h3>
          <div className="options-grid">
            <div className="checkbox-group">
              {Object.keys(dietaryRequirements).slice(0, 7).map((requirement) => (
                <label key={requirement}>
                  <input
                    type="checkbox"
                    checked={dietaryRequirements[requirement]}
                    onChange={() => handleDietaryChange(requirement)}
                  />
                  {requirement.charAt(0).toUpperCase() + requirement.slice(1)}
                </label>
              ))}
            </div>
            <div className="checkbox-group">
              {Object.keys(dietaryRequirements).slice(7).map((requirement) => (
                <label key={requirement}>
                  <input
                    type="checkbox"
                    checked={dietaryRequirements[requirement]}
                    onChange={() => handleDietaryChange(requirement)}
                  />
                  {requirement.charAt(0).toUpperCase() + requirement.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="ingredients-container">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyPress={addIngredientTag}
              placeholder="Add ingredients (press Enter)"
            />
            <div className="tag-container">
              {ingredientTags.map((tag, index) => (
                <div
                  key={index}
                  className="ingredient-tag"
                  onClick={() => removeIngredientTag(index)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

                    <div className="budget-slider">
            <label>Budget:</label>
            <div className="slider-container">
              <button
                className={`slider-option ${budget === 'low' ? 'active' : ''}`}
                onClick={() => setBudget('low')}
              >
                Low
              </button>
              <button
                className={`slider-option ${budget === 'medium' ? 'active' : ''}`}
                onClick={() => setBudget('medium')}
              >
                Medium
              </button>
              <button
                className={`slider-option ${budget === 'high' ? 'active' : ''}`}
                onClick={() => setBudget('high')}
              >
                High
              </button>
            </div>
          </div>


          <button onClick={generateRecipes}>GENERATE</button>
        </section>

        <section className="recipes-section">
          <h3>RECIPES</h3>
          <div className="recipe-grid">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="recipe-card">
                Random recipe {num}
              </div>
            ))}
          </div>
          <button className="regenerate-btn" onClick={regenerate}>
            Regenerate
          </button>
        </section>
      </div>
    </div>
  );
};

export default RecipeDashboard;