import React from 'react';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';
import { FakeSOSocket } from '../../../types';

interface QuestionsProps {
  socket: FakeSOSocket | null;
}

const Questions: React.FC<QuestionsProps> = ({ socket }) => {
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();

  return (
    <>
      <QuestionHeader
        titleText={titleText}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
      />
      <div id='question_list' className='question_list'>
        {qlist.map((q, idx) => (
          <QuestionView q={q} key={idx} />
        ))}
      </div>
      {titleText === 'Search Results' && !qlist.length && (
        <div className='bold_title right_padding'>No Questions Found</div>
      )}
    </>
  );
};

export default Questions;
