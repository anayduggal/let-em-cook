import React, { useEffect, useState } from "react";
import "../components/ShoppingList.css";

import {
  getShoppingList,
  IngredientData
} from "../api/recipeService";

interface ShoppingListProps {
  style?: React.CSSProperties;
}

interface Item {
  ingredient: string;
  quantity: string;
  unit: string;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ style }) => {

  const [shoppingItems, setShoppingItems] = useState<IngredientData[]>([]);

  const defaultItems: Item[] = [
    {
      ingredient: "Lorem ipsum",
      quantity: "1",
      unit: "pack",
    },
    { ingredient: "Dolor", quantity: "2", unit: "bunches" },
    { ingredient: "Sit amet", quantity: "500", unit: "grams" },
    { ingredient: "Etcetera", quantity: "2", unit: "pieces" },
  ];

    useEffect(() => {
      const getUsersShopping = async () => {
        try {
          const shoppingData = await getShoppingList();
          console.log(shoppingData)
          setShoppingItems(shoppingData);
        } catch (error) {
          console.error("Error getting shopping:", error);
        }
      };

      getUsersShopping();
    }, []);

  return (
    <div className="shopping-list-container" style={style}>
      <div className="shopping-list-header">
        <h1>SHOPPING LIST</h1>
      </div>

      <div className="shopping-list-table-header">
        <div className="column-ingredient">INGREDIENT</div>
        <div className="column-quantity">QTY + UNIT</div>
      </div>

      <div className="shopping-list-content">
        {shoppingItems.map((item, index) => (
          <div key={index} className="shopping-list-item">
            <div className="column-ingredient">{item.ingredient_name}</div>
            <div className="column-quantity">
              {item.quantity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ShoppingList.defaultProps = {
  style: {},
};

export default ShoppingList;
