import Form from '../../baseComponents/form';
import Input from '../../baseComponents/input';
import TextArea from '../../baseComponents/textarea';
import useEditProfile from '../../../../hooks/useEditProfile';
import './index.css';

/**
 * EditProfilePage component allows users to edit their profiles a new question with a title,
 * description, tags, and username.
 */
const EditProfilePage = () => {
  const { bio, setBio, title, setTitle, modifyProfile, bioErr, titleErr } = useEditProfile();
  return (
    <Form>
      <Input
        title={'Title'}
        hint={'Add your title'}
        id={'formTextInput'}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <TextArea
        title={'Bio'}
        hint={'Add details about yourself'}
        id={'formTextInput'}
        val={bio}
        setState={setBio}
        err={bioErr}
      />
      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            modifyProfile();
          }}>
          Update Profile
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default EditProfilePage;
