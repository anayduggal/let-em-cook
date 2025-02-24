import React from "react";
import "../components/ShoppingList.css";

interface ShoppingListProps {
  style?: React.CSSProperties;
}

interface Item {
  ingredient: string;
  quantity: string;
  unit: string;
  price: string;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ style }) => {
  const defaultItems: Item[] = [
    {
      ingredient: "Lorem ipsum",
      quantity: "1",
      unit: "pack",
      price: "£ 2.00",
    },
    { ingredient: "Dolor", quantity: "2", unit: "bunches", price: "£ 1.20" },
    { ingredient: "Sit amet", quantity: "500", unit: "grams", price: "£ 0.90" },
    { ingredient: "Etcetera", quantity: "2", unit: "pieces", price: "£ 0.80" },
  ];

  const totalCost = "£ 4.90";

  return (
    <div className="shopping-list-container" style={style}>
      <div className="shopping-list-header">
        <h1>SHOPPING LIST</h1>
      </div>

      <div className="shopping-list-table-header">
        <div className="column-ingredient">INGREDIENT</div>
        <div className="column-quantity">QTY + UNIT</div>
        <div className="column-price">PRICE</div>
      </div>

      <div className="shopping-list-content">
        {defaultItems.map((item, index) => (
          <div key={index} className="shopping-list-item">
            <div className="column-ingredient">{item.ingredient}</div>
            <div className="column-quantity">
              {item.quantity} {item.unit}
            </div>
            <div className="column-price">{item.price}</div>
          </div>
        ))}
      </div>

      <div className="shopping-list-footer">
        <span>Total cost:</span>
        <span>{totalCost}</span>
      </div>
    </div>
  );
};

ShoppingList.defaultProps = {
  style: {},
};

export default ShoppingList;
