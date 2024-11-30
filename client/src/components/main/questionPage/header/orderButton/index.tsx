import React from 'react';
import './index.css';
import { OrderType, orderTypeDisplayName } from '../../../../../types';

/**
 * Interface representing the props for the OrderButton component.
 *
 * name - The text to be displayed on the button.
 * setQuestionOrder - A function that sets the order of questions based on the message.
 */
interface OrderButtonProps {
  orderType: OrderType;
  setQuestionOrder: (order: OrderType) => void;
  isActive: boolean; // New prop to determine active state
}

/**
 * OrderButton component renders a button that, when clicked, triggers the setQuestionOrder function
 * with the provided message.
 * It will update the order of questions based on the input message.
 *
 * @param orderType - The label for the button and the value passed to setQuestionOrder function.
 * @param setQuestionOrder - Callback function to set the order of questions based on the input message.
 * @param isActive - Boolean indicating whether the button is active.
 */
const OrderButton = ({ orderType, setQuestionOrder, isActive }: OrderButtonProps) => (
  <button
    className={`filter-button ${isActive ? 'active' : ''}`}
    onClick={() => {
      setQuestionOrder(orderType);
    }}>
    {orderTypeDisplayName[orderType]}
  </button>
);

export default OrderButton;
