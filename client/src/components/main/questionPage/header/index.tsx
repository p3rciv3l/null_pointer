import React, { useState } from 'react';
import './index.css';
import OrderButton from './orderButton';
import { OrderType, orderTypeDisplayName } from '../../../../types';
/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({ titleText, qcnt, setQuestionOrder }: QuestionHeaderProps) => {
  const [activeFilter, setActiveFilter] = useState<OrderType>('newest');
  const handleOrderChange = (order: OrderType) => {
    setActiveFilter(order);
    setQuestionOrder(order);
  };

  return (
    <div className='question-header'>
      {/* Header Section */}
      <div className='header-section'>
        <h1 className='header-title'>
          {titleText} <span className='header-subtitle'>({qcnt})</span>
        </h1>
      </div>

      {/* Filter Buttons */}
      <div className='filter-buttons'>
        {Object.keys(orderTypeDisplayName).map((order, idx) => (
          <OrderButton
            key={idx}
            orderType={order as OrderType}
            setQuestionOrder={handleOrderChange}
            isActive={activeFilter === order} // Pass `isActive` dynamically
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionHeader;