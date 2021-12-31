import React, { useRef } from 'react';
import emailjs from 'emailjs-com';

const SendCard = (props) => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    if (props.teamName === 'Select your team') {
      alert('Please choose your team\'s name from the list.\n\nIf your team is not on the list, contact Steven in QA about getting your team set up to use this tool. Thank you!')
    } else if (props.occasion === 'Select one') {
      alert('Please select either Birthday or Fetchiversary for the Occasion field.')
      } else {
          if (window.confirm('Are you sure you want to send this eCard to your team for signing?')) {
            if (props.teamName === 'QA') {
              emailjs.sendForm('service_m8joa5x', 'qa_bday_fetchiversary', form.current, 'user_xVl1ngq3WZGS7s1PEVLcD')
              .then((result) => {
                  console.log(result.text);
                  alert('Yay! Your eCard has been sent out to the QA team for signing.')
              }, (error) => {
                  console.log(error.text);
                  alert(`Oh no! We were not able to successfuly send your eCard. Please reach out to Steven in QA for troubleshooting.\nBe sure to bring a copy of this error message: ${error.text}`)
              });
            } else if (props.teamName === 'Fraud') {
                emailjs.sendForm('service_nwdrjd8', 'template_fpj7t9h', form.current, 'user_MprloyfAX6KHYk5heeHq8')
                .then((result) => {
                    console.log(result.text);
                    alert('Yay! Your eCard has been sent out to the Fraud team for signing.')
                }, (error) => {
                    console.log(error.text);
                    alert(`Oh no! We were not able to successfuly send your eCard. Please reach out to Steven in QA for troubleshooting.\nBe sure to bring a copy of this error message: ${error.text}`)
                });
              } else if (props.teamName === 'Data Integrity') {
                  emailjs.sendForm('service_nsizf8t', 'template_iepf23n', form.current, 'user_sS2mN5EUqz6iKBjdnGSBi')
                  .then((result) => {
                      console.log(result.text);
                      alert('Yay! Your eCard has been sent out to the Data Integrity team for signing.')
                  }, (error) => {
                      console.log(error.text);
                      alert(`Oh no! We were not able to successfuly send your eCard. Please reach out to Steven in QA for troubleshooting.\nBe sure to bring a copy of this error message: ${error.text}`)
                  });
                } else if (props.teamName === 'Support') {
                    emailjs.sendForm('service_mda3oke', 'template_hlckzb8', form.current, 'user_oqkBjOxwvA4tNkKYqrvia')
                    .then((result) => {
                        console.log(result.text);
                        alert('Yay! Your eCard has been sent out to the Support team for signing.')
                    }, (error) => {
                        console.log(error.text);
                        alert(`Oh no! We were not able to successfuly send your eCard. Please reach out to Steven in QA for troubleshooting.\nBe sure to bring a copy of this error message: ${error.text}`)
                    });
                  }
          } else {
              alert('Your eCard has not been sent. Please ensure you have filled out the form completely with valid data.')
            }
        }
  };

  return (
    <form ref={form} onSubmit={sendEmail} id='email-form'>
      <div className='inputContainer'>
        <label>Team</label>
        <select type="text" name="teamName" id='teamName' onChange={props.updateTeamName} className='input-text editableFields'>
          <option>Select your team</option>
          <option>QA</option>
          <option>Fraud</option>
          <option>Data Integrity</option>
          <option>Support</option>
        </select>
      </div>
      <div className='inputContainer'>
        <label>First Name</label>
        <input type="text" name="first_name" value={props.firstName} className='input-text' required readOnly />
      </div>
      <div className='inputContainer'>
        <label>Last Name</label>
        <input type="text" name="last_name" value={props.lastName} className='input-text' required readOnly />
      </div>
      <div className='inputContainer'>
        <label>Occasion</label>
        <select type="text" name="occasion" id='occasion' onChange={props.updateOccasionDate} className='input-text editableFields'>
          <option>Select one</option>
          <option>Birthday</option>
          <option>Fetchiversary</option>
        </select>
      </div>
      <div className="inputContainer">
        <label>Occasion Date</label>
        <input type="text" name="occasion_date" value={props.occasionDate} className='input-text' required readOnly />
      </div>
      <div className="inputContainer">
        <label>List of Recipients</label>
        <input type="text" name="mailing_list" value={props.mailingList} className='input-text' required readOnly />
      </div>
      <div className="inputContainer">
        <label>eCard URL</label>
        <input type="text" name="ecard_url" id='ecardUrl' className='input-text editableFields' required />
      </div>
      <input type="submit" value="Send" id="submit-btn" />
    </form>
  );
};

export default SendCard