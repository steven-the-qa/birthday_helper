import React, { useRef } from 'react';
import emailjs from 'emailjs-com';

const SendCard = (props) => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    if (props.teamName === 'Select your team') {
      alert('Please choose your team\'s name from the list.')
    } else if (props.occasion === 'Select one') {
      alert('Please select either Birthday or Work Anniversary for the Occasion field.')
      } else {
          if (window.confirm('Are you sure you want to send this eCard to your team for signing?')) {
            if (props.teamName === 'Your Team Name') {
              emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', form.current, 'USER_ID')
              .then((result) => {
                  console.log(result.text);
                  alert('Yay! Your eCard has been sent out to the QA team for signing.')
              }, (error) => {
                  console.log(error.text);
                  alert(`Oh no! We were not able to successfuly send your eCard. Please refer to this error message:\n\n⚠️${error.text}`)
              });
            }
          } else {
              alert('Your eCard has not been sent. Please ensure you have filled out the form completely with valid data.\n\nIf this is your first time using this tool, you will need to download the project and add your EmailJS service, template, and user ids before the form will send anything.')
            }
        }
  };

  return (
    <form className='flex flex-col justify-start' ref={form} onSubmit={sendEmail} id='email-form'>
      <div className='flex flex-col my-1 mx-0 py-0 px-2'>
        <label>Team</label>
        <select type="text" name="teamName" id='teamName' onChange={props.updateTeamName} className='py-2 pl-2 text-black hover:cursor-pointer focus:cursor-pointer'>
          <option>Select your team</option>
          <option>Your Team Name</option>
        </select>
      </div>
      <div className='flex flex-col my-1 mx-0 py-0 px-2'>
        <label>First Name</label>
        <input type="text" name="first_name" value={props.firstName} className='py-2 pl-2 text-black' required readOnly />
      </div>
      <div className='flex flex-col my-1 mx-0 py-0 px-2'>
        <label>Last Name</label>
        <input type="text" name="last_name" value={props.lastName} className='py-2 pl-2 text-black' required readOnly />
      </div>
      <div className='flex flex-col my-1 mx-0 py-0 px-2'>
        <label>Occasion</label>
        <select type="text" name="occasion" id='occasion' onChange={props.updateOccasionDate} className='py-2 pl-2 text-black hover:cursor-pointer focus:cursor-pointer'>
          <option>Select one</option>
          <option>Birthday</option>
          <option>Work Anniversary</option>
        </select>
      </div>
      <div className="flex flex-col my-1 mx-0 py-0 px-2">
        <label>Occasion Date</label>
        <input type="text" name="occasion_date" value={props.occasionDate} className='py-2 pl-2 text-black' required readOnly />
      </div>
      <div className="flex flex-col my-1 mx-0 py-0 px-2">
        <label>List of Recipients</label>
        <input type="text" name="mailing_list" value={props.mailingList} className='py-2 pl-2 text-black' required readOnly />
      </div>
      <div className="flex flex-col my-1 mx-0 py-0 px-2">
        <label>eCard URL</label>
        <input type="text" name="ecard_url" id='ecardUrl' className='py-2 pl-2 text-black hover:cursor-pointer focus:cursor-pointer' required />
      </div>
      <input className='font-bold py-2 my-2 bg-[#6f42c1] focus:cursor-pointer hover:cursor-pointer' type="submit" value="Send" id="submit-btn" />
    </form>
  );
};

export default SendCard