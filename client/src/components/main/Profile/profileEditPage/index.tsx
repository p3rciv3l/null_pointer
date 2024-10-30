import React from 'react';
import Form from '../../baseComponents/form';
import Input from '../../baseComponents/input';
import TextArea from '../../baseComponents/textarea';
import './index.css';

/**
 * EditProfilePage component allows users to edit their profiles a new question with a title,
 * description, tags, and username.
 */
const EditProfilePage = () => {
  // const { text, setText, tagNames, setTagNames, textErr, tagErr, updateProfile } = useEditProfile();
  const text = '';
  const setText = () => {};
  const textErr = '';
  return (
    <Form>
      <TextArea
        title={'Bio'}
        hint={'Add details about yourself'}
        id={'formTextInput'}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            // updateProfile();
          }}>
          Update Profile
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default EditProfilePage;
