import React, { useState } from "react";
import "../components/Pantry.css";

interface PantryItem {
  ingredient: string;
  quantity: string;
  useByDate: string;
}

const Pantry: React.FC = () => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState<PantryItem>({
    ingredient: "",
    quantity: "",
    useByDate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const addPantryItem = () => {
    if (newItem.ingredient && newItem.quantity && newItem.useByDate) {
      setPantryItems([...pantryItems, newItem]);
      setNewItem({ ingredient: "", quantity: "", useByDate: "" });
    }
  };

  return (
    <div className="pantry-container">
      <div className="pantry-header">
        <h1>PANTRY</h1>
      </div>

      <div className="pantry-form">
        <input
          type="text"
          name="ingredient"
          placeholder="Ingredient"
          value={newItem.ingredient}
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
          name="useByDate"
          value={newItem.useByDate}
          onChange={handleInputChange}
        />
        <button onClick={addPantryItem}>ADD</button>
      </div>

      <div className="pantry-list">
        <div className="pantry-table-header">
          <div className="column-ingredient">INGREDIENT</div>
          <div className="column-quantity">QTY</div>
          <div className="column-date">USE BY</div>
        </div>

        {pantryItems.map((item, index) => (
          <div key={index} className="pantry-item">
            <div className="column-ingredient">{item.ingredient}</div>
            <div className="column-quantity">{item.quantity}</div>
            <div className="column-date">{item.useByDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pantry;
