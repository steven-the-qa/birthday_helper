import React, { useState, useEffect, useCallback } from 'react'
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
  const [birthdayPersonWorkAnniversary, setBirthdayPersonWorkAnniversary] = useState('')
  const [occasionDate, setOccasionDate] = useState('')
  const [occasion, setOccasion] = useState('Select one')
  const [mailingList, setMailingList] = useState('')
  const [teamName, setTeamName] = useState('Select your team')

  // CSV Parsing

  const notifyUserOfFormat = () => {
    alert(`
      Your CSV should have this format:\n\n
      Row 1 -> name, email, birthday, work anniversary\n
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
        workAnniversary: person.workAnniversary
      }
    })

    setBirthdayPeople(birthdayPeopleArr)
  }

  // Data updates and organization

  const updateOccasionDate = useCallback(() => {
    if (document.getElementById('occasion').value === 'Birthday') {
      setOccasion('Birthday')
      setOccasionDate(birthdayPersonBirthday)
    } else if (document.getElementById('occasion').value === 'Work Anniversary') {
      setOccasion('Work Anniversary')
      setOccasionDate(birthdayPersonWorkAnniversary)
    } else {
      setOccasion('Select one')
      setOccasionDate('Select an occasion')
    }
  }, [birthdayPersonBirthday, birthdayPersonWorkAnniversary])

  const updateTeamName = () => {
    if (document.getElementById('teamName').value === 'Your Team Name') {
      setTeamName('Your Team Name')
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
      setBirthdayPersonWorkAnniversary(birthdayPerson ? birthdayPerson.workAnniversary : 'Work Anniversary not found')
    } else {
      console.log('Birthday person data cannot be updated')
    }
  }, [birthdayPerson])

  const updateRecipients = useCallback(() => {
    if (birthdayPerson.name) {
      // Update recipients array
      const newRecipients = birthdayPeople.map(person => {
        return person.name !== birthdayPerson.name.trim() && <li className='my-[1em] mx-0]' key={`${person.email}`}>{person.email}</li>
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
    return <li className='my-[1em] mx-0]' key={`${person.name}`}><strong>{person.name}</strong> ({person.email})</li>
  })

  let birthdays = birthdayPeople.map(person => {
    return { "name": person.name, "birthday": person.birthday }
  }).sort((a,b) => { return new Date(a.birthday) - new Date(b.birthday) })

  const birthdaysInOrder = birthdays.map(person => {
    if (person.birthday === '') {
      return <li className='my-[1em] mx-0]' key={`${person.bithday}`} style={{'color': 'red'}}><strong>{person.name}</strong></li>
    }
    else {
      return <li className='my-[1em] mx-0]' key={`${person.birthday}`}>{person.birthday} ({person.name})</li>
    }
  })

  let workAnniversaries = birthdayPeople.map(person => {
    return { "name": person.name, "workAnniversary": person.workAnniversary }
  }).sort((a,b) => { return new Date(a.workAnniversary) - new Date(b.workAnniversary) })

  const workAnniversariesInOrder = workAnniversaries.map(person => {
    if (person.workAnniversary === '') {
      return <li className='my-[1em] mx-0]' key={`${person.workAnniversary}`}style={{'color': 'red'}}><strong>{person.name}</strong></li>
    }
    else {
      return <li className='my-[1em] mx-0]' key={`${person.workAnniversary}`}>{person.workAnniversary} ({person.name})</li>
    }
  })

  const recipientsContent = recipients.length === 0 
    ? 
      <ol>
        <li className='my-[1em] mx-0]' key='manual-step1'>Enter the first and last name of the Birthday/Work Anniversary Person in the field above</li>
        <li className='my-[1em] mx-0]' key='manual-step2'>Click Update, and you should see the mailing list appear in this container (excluding the Birthday/Work Anniversary Person)</li>
      </ol>
    : <ul className='ml-0 pl-0 list-none'>{recipients}</ul>

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
    <div className="bg-[#28a745] font-sans flex flex-col justify-evenly items-center min-w-[1800px]">
      <header className="flex flex-col justify-start items-center min-w-[500px] text-center">
        <h1 className='text-[#6f42c1]'><span role='img' aria-label='birthday cake emoji'>🎂</span> Birthday Helper <span role='img' aria-label='envelope emoji'>✉️</span></h1>
        <p>Automating the mental overhead of doing birthday e-cards for your team <span role='img' aria-label='party popper emoji'>🎉</span></p>
      </header>

      <section className='flex flex-col justify-evenly text-left text-[.9em] border border-solid border-[3px] border-[#6f42c1] bg-[rgb(32,67,102)] text-white my-[1em] mx-[3em] rounded-lg p-[2em]'>
        <h2 className='text-[#6f42c1]'>How to Use this Tool</h2>
        <p>Make a copy of this spreadsheet and fill in your team's data: <a className="no-underline text-[#6f42c1] font-bold hover:text-[1.2em] hover:underline focus:text-[1.2em] focus:underline"rel='noopener noreferrer' target='_blank' href='https://docs.google.com/spreadsheets/d/1yZ-axvE-6IDCDqpLvmusmzHKMbFHzRTKi_DXhtjjkOc/edit#gid=0'>Team Data Template</a></p>
        <p>Please stick to the formatting choices on the spreadsheet to ensure your data is uploaded properly to the tool later on (date, capitalization, etc.)</p>
        <ol>
          <li className='my-[1em] mx-0]' key='step1'>Download your spreadsheet from Google Sheets as a CSV file</li>
          <li className='my-[1em] mx-0]' key='step2'>Upload the CSV file using the <strong>Choose File</strong> button</li>
          <li className='my-[1em] mx-0]' key='step3'>Enter the name of the team member (first and last) to whom you're sending the eCard</li>
          <li className='my-[1em] mx-0]' key='step4'>Click the <strong>Update</strong> button</li>
          <li className='my-[1em] mx-0]' key='step5'>Create the eCard on a platform of your choosing. We recommend <a className="no-underline text-[#6f42c1] font-bold hover:text-[1.2em] hover:underline focus:text-[1.2em] focus:underline"rel='noopener noreferrer' target='_blank' href='https://sendwishonline.com/en/group-cards/category'>SendWishOnline</a></li>
          <li className='my-[1em] mx-0]' key='step6'>Copy the shareable link for the eCard you created, so you can distribute it to other team members for signing</li>
          <li className='my-[1em] mx-0]' key='step7'>Fill out the rest of the form, ensuring you choose the correct <strong>Team</strong> and <strong>Occasion</strong></li>
          <li className='my-[1em] mx-0]' key='step8'>Click <strong>Send</strong> to distribute your eCard to the team for signing. Give the team enough time to sign it before it arrives in your team member's inbox!</li>
        </ol>
      </section>

      <section className='flex flex-col justify-evenly h-[200px] border border-[3px] border-solid border-white my-[1em] mx-[3em] rounded-lg p-[2em]'>
        <div className='flex flex-col'>
          <label className='label-file text-[#6f42c1] font-bold' htmlFor="file" onClick={notifyUserOfFormat}>Upload your CSV of names, emails, birthdays, and work anniversaries:</label>
          <input type="file" accept=".csv" multiple={false} onChange={handleCSV} name="file" id="file" className="mt-[1em]" />
        </div>
        <br></br>
        <label  className='text-[#6f42c1] font-bold' htmlFor='birthdayPerson'>Birthday/Work Anniversary Person</label>
        <input type='text' name='birthdayPerson' className='py-[.5em] px-0 hover:scale-[1.1] focus:sclae-[1.1]' id="nameInput" />
        <button className='font-bold p-[.5em] bg-[#28a745] focus:scale-[1.1] hover:scale-[1.1] focus:bg-white hover:bg-white focus:cursor-pointer hover:cursor-pointer' onClick={updateBirthdayPerson}>Update</button>
      </section>

      <p id="advisory" className='text-black bg-white p-[1em] rounded-lg'>
        Schedule the eCard to be sent to 
          <strong className='text-black bg-[#28a745] p-[.5em] border border-[2px] border-solid border-black rounded-lg my-0 mx-[1em] hover:scale-[3] focus:scale-[3] hover:cursor-pointer focus:cursor-pointer hover:bg-white focus:bg-white' onClick={copyToClipboard}>
            <span id='emailText'>{birthdayPersonEmail ? birthdayPersonEmail : 'Birthday/Work Anniversary Person\'s Email'}</span>
            <span>{' '}</span>
            <FontAwesomeIcon icon={faCopy} />
          </strong> 
        on their birthday/work anniversary.<br /><br />Do <strong>not</strong> include their email in the <strong>List of Recipients</strong> below.
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

      <div className='flex py-0 px-[1em]'>
        <section className='h-[500px] m-w-[250px] overflow-y-scroll border border-[3px] border-solid border-white my-[1em] mx-[3em] rounded-lg p-[2em]'>
          <h3 className='text-white text-center tracking-[1.25px]'>Birthdays</h3>
          <ul className='ml-0 pl-0 list-none'>{birthdaysInOrder}</ul>
        </section>

        <section className='h-[500px] m-w-[250px] overflow-y-scroll border border-[3px] border-solid border-white my-[1em] mx-[3em] rounded-lg p-[2em]'>
          <h3 className='text-white text-center tracking-[1.25px]'>Work Anniversaries</h3>
          <ul className='ml-0 pl-0 list-none'>{workAnniversariesInOrder}</ul>
        </section>

        <section className='h-[500px] m-w-[250px] overflow-y-scroll border border-[3px] border-solid border-white my-[1em] mx-[3em] rounded-lg p-[2em]'>
          <h3 className='text-white text-center tracking-[1.25px]'>Names</h3>
          <ul className='ml-0 pl-0 list-none'>{allNames}</ul>
        </section>

        <section className='h-[500px] m-w-[250px] overflow-y-scroll border border-[3px] border-solid border-white my-[1em] mx-[3em] rounded-lg p-[2em]'>
          <h3 className='text-white text-center tracking-[1.25px]'>Recipients</h3>
          {recipientsContent}
        </section>
      </div>
    </div>
  );
}

export default App;
