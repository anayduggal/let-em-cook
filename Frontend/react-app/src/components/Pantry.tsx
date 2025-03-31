import React, { useEffect, useState } from "react";
import "../components/Pantry.css";

import {
  getPantry,
  IngredientData
} from "../api/recipeService";

const Pantry: React.FC = () => {
  const [pantryItems, setPantryItems] = useState<IngredientData[]>([]);

  const [newItem, setNewItem] = useState<IngredientData>({
    ingredient_name: "",
    quantity: "",
    use_by: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const addPantryItem = () => {
    if (newItem.ingredient_name && newItem.quantity && newItem.use_by) {
      setPantryItems([...pantryItems, newItem]);
      setNewItem({ ingredient_name: "", quantity: "", use_by: "" });
    }
  };

    useEffect(() => {
      const getUsersPantry = async () => {
        try {
          const pantryData = await getPantry();
          console.log(pantryData)
          setPantryItems(pantryData);
        } catch (error) {
          console.error("Error getting pantry:", error);
        }
      };

      getUsersPantry();
    }, []);

  return (
    <div className="pantry-container">
      <div className="pantry-header">
        <h1>PANTRY</h1>
      </div>

      <div className="pantry-list">
        <div className="pantry-table-header">
          <div className="column-ingredient">INGREDIENT</div>
          <div className="column-quantity">QTY</div>
          <div className="column-date">USE BY</div>
        </div>

        {pantryItems.map((item, index) => (
          <div key={index} className="pantry-item">
            <div className="column-ingredient">{item.ingredient_name}</div>
            <div className="column-quantity">{item.quantity}</div>
            <div className="column-date">{item.use_by}</div>
          </div>
        ))}

        <div className="pantry-form">
         <input
          type="text"
          name="ingredient_name"
          placeholder="Ingredient"
          value={newItem.ingredient_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="use_by"
          value={newItem.use_by}
          onChange={handleInputChange}
        />
        <button onClick={addPantryItem}>ADD</button>
      </div>  
      </div>
    </div>
  );
};

export default Pantry;
