import React, { useState, useEffect, useCallback } from 'react'
import './App.css';
import testData from './birthday_people.json'
import SendCard from './SendCard'
import Papa from 'papaparse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [birthdayPeople, setBirthdayPeople] = useState(testData)
  const [recipients, setRecipients] = useState([])
  const [birthdayPerson, setBirthdayPerson] = useState('')
  const [birthdayPersonFirstName, setBirthdayPersonFirstName] = useState('')
  const [birthdayPersonLastName, setBirthdayPersonLastName] = useState('')
  const [birthdayPersonEmail, setBirthdayPersonEmail] = useState('')
  const [birthdayPersonBirthday, setBirthdayPersonBirthday] = useState('')
  const [birthdayPersonFetchiversary, setBirthdayPersonFetchiversary] = useState('')
  const [occasionDate, setOccasionDate] = useState('')
  const [occasion, setOccasion] = useState('Select one')
  const [mailingList, setMailingList] = useState('')
  const [teamName, setTeamName] = useState('Select your team')

  // CSV Parsing

  const notifyUserOfFormat = () => {
    alert(`
      Your CSV should have this format:\n\n
      Row 1 -> name, email, birthday, fetchiversary\n
      Row 2 -> Test User1, test1@user.com, January 1, January 10\n
      Row 3 -> Test User2, test2@user.com, February 2, February 20\n
      Row 4 -> Test User3, test3@user.com, March 3, March 30\n
      etc.`
    )
  }

  const handleCSV = (event) => {
    if (event.target.files && event.target.files.length > 0) {
        Papa.parse(event.target.files[0], {
          header: true,
          complete: (results, file) => mapDataToComponents(results, file),
          error: function(error) {
            console.log("Parsing has failed unexpectedly:", error)
          }
        })
    }
    else {
      alert(`File selection was not successful. Please reload the page and try again.`)
    }
  }

  const mapDataToComponents = (results, file) => {
    const csvData = results.data

    let birthdayPeopleArr = csvData.map(person => {
      return {
        name: person.name,
        email: person.email,
        birthday: person.birthday,
        fetchiversary: person.fetchiversary
      }
    })

    setBirthdayPeople(birthdayPeopleArr)
  }

  // Data updates and organization

  const updateOccasionDate = useCallback(() => {
    if (document.getElementById('occasion').value === 'Birthday') {
      setOccasion('Birthday')
      setOccasionDate(birthdayPersonBirthday)
    } else if (document.getElementById('occasion').value === 'Fetchiversary') {
      setOccasion('Fetchiversary')
      setOccasionDate(birthdayPersonFetchiversary)
    } else {
      setOccasion('Select one')
      setOccasionDate('Select an occasion')
    }
  }, [birthdayPersonBirthday, birthdayPersonFetchiversary])

  const updateTeamName = () => {
    if (document.getElementById('teamName').value === 'QA') {
      setTeamName('QA')
    } else if (document.getElementById('teamName').value === 'Fraud') {
      setTeamName('Fraud')
      } else if (document.getElementById('teamName').value === 'Data Integrity') {
          setTeamName('Data Integrity')
        } else {
            setTeamName('Select your team')
          }
  }

  const updateBirthdayPerson = () => {
    // Update birthday person object
    if (birthdayPeople.find(person => person.name === document.getElementById('nameInput').value) !== undefined) {
      setBirthdayPerson(birthdayPeople.find(person => person.name === document.getElementById('nameInput').value))
    } else {
      setBirthdayPerson('')
      console.log('Birthday person could not be found')
    }
  }
  const updateBirthdayPersonData = useCallback(() => {
    if (birthdayPerson.name) {
      // Update birthday person data variables
      setBirthdayPersonFirstName(birthdayPerson ? birthdayPerson.name.split(' ')[0] : 'First name not found')
      setBirthdayPersonLastName(birthdayPerson ? birthdayPerson.name.split(' ')[1] : 'Last name not found')
      setBirthdayPersonEmail(birthdayPerson ? birthdayPerson.email : 'Email not found')
      setBirthdayPersonBirthday(birthdayPerson ? birthdayPerson.birthday : 'Birthday not found')
      setBirthdayPersonFetchiversary(birthdayPerson ? birthdayPerson.fetchiversary : 'Fetchiversary not found')
    } else {
      console.log('Birthday person data cannot be updated')
    }
  }, [birthdayPerson])

  const updateRecipients = useCallback(() => {
    if (birthdayPerson.name) {
      // Update recipients array
      const newRecipients = birthdayPeople.map(person => {
        return person.name !== birthdayPerson.name.trim() && <li key={`${person.email}`}>{person.email}</li>
      });
      setRecipients(newRecipients)
    } else {
      console.log('Recipients cannot be updated')
    }
  }, [birthdayPerson, birthdayPeople])

  const updateMailingList = useCallback(() => {
    if (birthdayPerson.name) {
      // Update mailing list
      const mailingListArr = birthdayPeople
        .map(person => { return person.name !== birthdayPerson.name.trim() && person.email })
        .filter(val => val !== false)
      setMailingList(mailingListArr.join(','))
    } else {
      console.log('Mailing list cannot be updated')
    }
  }, [birthdayPerson, birthdayPeople])

  const allNames = birthdayPeople.map(person => {
    return <li key={`${person.name}`}><strong>{person.name}</strong> ({person.email})</li>
  })

  let birthdays = birthdayPeople.map(person => {
    return { "name": person.name, "birthday": person.birthday }
  }).sort((a,b) => { return new Date(a.birthday) - new Date(b.birthday) })

  const birthdaysInOrder = birthdays.map(person => {
    if (person.birthday === '') {
      return <li key={`${person.bithday}`} style={{'color': 'red'}}><strong>{person.name}</strong></li>
    }
    else {
      return <li key={`${person.birthday}`}>{person.birthday} ({person.name})</li>
    }
  })

  let fetchiversaries = birthdayPeople.map(person => {
    return { "name": person.name, "fetchiversary": person.fetchiversary }
  }).sort((a,b) => { return new Date(a.fetchiversary) - new Date(b.fetchiversary) })

  const fetchiversariesInOrder = fetchiversaries.map(person => {
    if (person.fetchiversary === '') {
      return <li key={`${person.fetchiversary}`}style={{'color': 'red'}}><strong>{person.name}</strong></li>
    }
    else {
      return <li key={`${person.fetchiversary}`}>{person.fetchiversary} ({person.name})</li>
    }
  })

  const recipientsContent = recipients.length === 0 
    ? 
      <ol>
        <li key='manual-step1'>Enter the first and last name of the Birthday/Fetchiversary Person in the field above</li>
        <li key='manual-step2'>Click Update, and you should see the mailing list appear in this container (excluding the Birthday/Fetchiversary Person)</li>
      </ol>
    : <ul className='ul-data'>{recipients}</ul>

  const copyToClipboard = () => {
    let copyText = document.getElementById('emailText').innerHTML
    navigator.clipboard.writeText(copyText)
      .then(() => alert(`✅ Email copied\n${copyText}` ))
  }

  useEffect(() => {
    updateBirthdayPersonData();
    updateRecipients();
    updateOccasionDate();
    updateMailingList();
  }, [updateBirthdayPersonData, updateRecipients, updateOccasionDate, updateMailingList])

  return (
    <div className="App">
      <header>
        <h1><span role='img' aria-label='birthday cake emoji'>🎂</span> Birthday Helper <span role='img' aria-label='envelope emoji'>✉️</span></h1>
        <p>Automating the mental overhead of doing birthday e-cards for your team <span role='img' aria-label='party popper emoji'>🎉</span></p>
      </header>

      <section className='container-getting-started'>
        <h2>How to Use this Tool</h2>
        <p>Make a copy of this spreadsheet and fill in your team's data: <a rel='noopener noreferrer' target='_blank' href='https://docs.google.com/spreadsheets/d/1yZ-axvE-6IDCDqpLvmusmzHKMbFHzRTKi_DXhtjjkOc/edit#gid=0'>Team Data Template</a></p>
        <p>Please stick to the formatting choices on the spreadsheet to ensure your data is uploaded properly to the tool later on (date, capitalization, etc.)</p>
        <ol>
          <li key='step1'>Download your spreadsheet from Google Sheets as a CSV file</li>
          <li key='step2'>Upload the CSV file using the <strong>Choose File</strong> button</li>
          <li key='step3'>Enter the name of the team member (first and last) to whom you're sending the eCard</li>
          <li key='step4'>Click the <strong>Update</strong> button</li>
          <li key='step5'>Create the eCard on a platform of your choosing. We recommend <a rel='noopener noreferrer' target='_blank' href='https://sendwishonline.com/en/group-cards/category'>SendWishOnline</a></li>
          <li key='step6'>Copy the shareable link for the eCard you created, so you can distribute it to other team members for signing</li>
          <li key='step7'>Fill out the rest of the form, ensuring you choose the correct <strong>Team</strong> and <strong>Occasion</strong></li>
          <ul>
            <li key='step7a'>If you don't see your team name, ask Steven in QA to get you set up with a free account for sending templated emails</li>
          </ul>
          <li key='step8'>Click <strong>Send</strong> to distribute your eCard to the team for signing. Give the team enough time to sign it before it arrives in your team member's inbox!</li>
        </ol>
      </section>

      <section className='birthdayPersonInput'>
        <div className='container-file'>
          <label className='label-file' htmlFor="file" onClick={notifyUserOfFormat}>Upload your CSV of names, emails, and birthdays:</label>
          <input type="file" accept=".csv" multiple={false} onChange={handleCSV} name="file" id="file" className="input-file" />
        </div>
        <br></br>
        <label htmlFor='birthdayPerson'>Birthday/Fetchiversary Person</label>
        <input type='text' name='birthdayPerson' className='input-text editableFields' id="nameInput" />
        <button onClick={updateBirthdayPerson}>Update</button>
      </section>

      <p id="advisory">
        Schedule the eCard to be sent to 
          <strong className='recipientEmail' onClick={copyToClipboard}>
            <span id='emailText'>{birthdayPersonEmail ? birthdayPersonEmail : 'Birthday/Fetchiversary Person\'s Email'}</span>
            <span>{' '}</span>
            <FontAwesomeIcon icon={faCopy} />
          </strong> 
        on their birthday/Fetchiversary.<br /><br />Do <strong>not</strong> include their email in the <strong>List of Recipients</strong> below.
      </p>

      <SendCard
        teamName={teamName}
        updateTeamName={updateTeamName}
        firstName={birthdayPersonFirstName} 
        lastName={birthdayPersonLastName}
        occasion={occasion}
        occasionDate = {occasionDate}
        updateOccasionDate= {updateOccasionDate}
        mailingList={mailingList}
      />

      <div className='container-data'>
        <section className='column'>
          <h3>Birthdays</h3>
          <ul className='ul-data'>{birthdaysInOrder}</ul>
        </section>

        <section className='column'>
          <h3>Fetchiversaries</h3>
          <ul className='ul-data'>{fetchiversariesInOrder}</ul>
        </section>

        <section className='column'>
          <h3>Names</h3>
          <ul className='ul-data'>{allNames}</ul>
        </section>

        <section className='column'>
          <h3>Recipients</h3>
          {recipientsContent}
        </section>
      </div>
    </div>
  );
}

export default App;
