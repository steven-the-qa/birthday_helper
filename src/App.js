import React, { useState, useEffect, useCallback } from 'react'
import testData from './data/test.json'
import SendCard from './SendCard'
import Papa from 'papaparse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [birthdayPeople, setBirthdayPeople] = useState(testData)
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
      console.log('File selection was not successful. Please reload the page and try again.')
      alert('File selection was not successful. Please reload the page and try again.')
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
    setTeamName(document.getElementById('teamName').value)
  }

  const updateBirthdayPerson = (e) => {
    // Update birthday person object
    if (birthdayPeople.find(person => person.name === e.target.value) !== undefined) {
      setBirthdayPerson(birthdayPeople.find(person => person.name === e.target.value))
    } else {
        alert('Please select a name from the list')
        console.log('Please select a name from the list')
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
        alert('Birthday person data cannot be updated')
        console.log('Birthday person data cannot be updated')
      }
  }, [birthdayPerson])

  const updateMailingList = useCallback(() => {
    if (birthdayPerson.name) {
      // Update mailing list
      const mailingListArr = birthdayPeople
        .map(person => { return person.name !== birthdayPerson.name.trim() && person.email })
        .filter(val => val !== false)
      setMailingList(mailingListArr.join(','))
    } else {
        alert('Mailing list cannot be updated')
        console.log('Mailing list cannot be updated')
      }
  }, [birthdayPerson, birthdayPeople])

  const allNames = birthdayPeople.map(person => {
    return <li className='my-[1em] mx-0]' key={`${person.name}`}><strong>{person.name}</strong><br />{person.email}</li>
  })

  const allNamesOptions = birthdayPeople.map(person => {
    return <option key={`${person.name}-option`} value={person.name}>{person.name}</option>
  })

  let birthdays = birthdayPeople.map(person => {
    return { "name": person.name, "birthday": person.birthday }
  }).sort((a,b) => { return new Date(a.birthday) - new Date(b.birthday) })

  const birthdaysInOrder = birthdays.map(person => {
    if (person.birthday === '') {
      return <li className='my-[1em] mx-0]' key={`${person.birthday}-${person.name}`} style={{'color': 'red'}}><strong>{person.name}</strong></li>
    } else {
        return <li className='my-[1em] mx-0]' key={`${person.birthday}-${person.name}`}><strong>{person.birthday}</strong><br />{person.name}</li>
      }
  })

  let workAnniversaries = birthdayPeople.map(person => {
    return { "name": person.name, "workAnniversary": person.workAnniversary }
  }).sort((a,b) => { return new Date(a.workAnniversary) - new Date(b.workAnniversary) })

  const workAnniversariesInOrder = workAnniversaries.map(person => {
    if (person.workAnniversary === '') {
      return <li className='my-[1em] mx-0]' key={`${person.workAnniversary}-${person.name}}`}style={{'color': 'red'}}><strong>{person.name}</strong></li>
    }
    else {
      return <li className='my-[1em] mx-0]' key={`${person.workAnniversary}-${person.name}`}><strong>{person.workAnniversary}</strong><br />{person.name}</li>
    }
  })

  const copyToClipboard = () => {
    let copyText = document.getElementById('emailText').innerHTML
    navigator.clipboard.writeText(copyText)
      .then(() => alert(`✅ Email copied\n${copyText}` ))
  }

  useEffect(() => {
    if (birthdayPerson) {
      updateBirthdayPersonData();
      updateMailingList();
    }
    updateOccasionDate();
  }, [birthdayPerson, updateBirthdayPersonData, updateOccasionDate, updateMailingList])

  // Girl Scouts green = '#28a745'
  // Girl Scouts purple = '#6f42c1'

  return (
    <div className="bg-[#28a745] text-white font-sans flex flex-col justify-evenly items-center">
      <header className="flex flex-col justify-start items-center text-center">
        <h1 className='text-3xl p-5'><span role='img' aria-label='birthday cake emoji'>🎂</span> Birthday Helper <span role='img' aria-label='envelope emoji'>✉️</span></h1>
        <p className='text-xl'>Automating the mental overhead of doing birthday e-cards for your team <span role='img' aria-label='party popper emoji'>🎉</span></p>
      </header>

      <a
        className='flex flex-col justify-evenly border-solid border-[3px] border-white bg-[#6f42c1] my-[1em] mx-[3em] rounded-lg p-[2em] text-white text-xl text-center font-bold'
        href='https://docs.google.com/document/d/1oFmriwRWDwYyQ5jGYjY_WjtTX4ITBIPFnaTGACQwtNs/edit?usp=sharing'
        target='_blank'
        rel='noopener noreferrer'
      >
          Quick Start Guide
      </a>

      <section className='flex flex-col justify-evenly border-[3px] border-solid border-white my-[1em] mx-[3em] rounded-lg p-[2em] text-white'>
        <div className='flex flex-col'>
          <label className='label-file text-white font-bold' htmlFor="file">Upload your CSV <em>(see Quick Start Guide for formatting)</em>:</label>
          <input type="file" accept=".csv" multiple={false} onChange={handleCSV} name="file" id="file" className="mt-[1em]" />
        </div>
        <br></br>
        <label  className='font-bold mb-2' htmlFor='birthdayPerson'>Birthday / Work Anniversary Person</label>
        <select name='birthdayPerson' className='py-2 pl-2 text-black' id="nameInput" onChange={updateBirthdayPerson} value={birthdayPerson.name}>
          <option key='select-a-name-option' value='Select a name'>Select a name</option>
          {allNamesOptions}
        </select>
      </section>

      {birthdayPersonEmail &&
        <section className='flex flex-col text-white border-[3px] border-solid border-white my-2 p-4 rounded-lg'>
          <p>
            Schedule the eCard to be sent to 
          </p>
          <p className='self-start font-bold bg-[#6f42c1] p-2 mx-0 my-1 border-[2px] border-solid border-black rounded-lg hover:cursor-pointer focus:cursor-pointer' onClick={copyToClipboard}>
            <FontAwesomeIcon icon={faCopy} />
            <span id='emailText'>{` ${birthdayPersonEmail}`}</span>
          </p>
          <p>
            {` on their special day!`}
          </p>
        </section>
      }


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

      <div className='flex flex-col lg:flex-row py-0 px-[1em]'>
        <section className='max-h-[400px] flex flex-col overflow-y-scroll border-[3px] border-solid border-white my-[1em] mx-[3em] rounded-lg p-[2em]'>
          <h3 className='text-xl font-bold text-white text-center tracking-[1.25px]'>Birthdays</h3>
          <ul className='ml-0 pl-0 list-none'>{birthdaysInOrder}</ul>
        </section>

        <section className='max-h-[400px] flex flex-col overflow-y-scroll border-[3px] border-solid border-white my-[1em] mx-[3em] rounded-lg p-[2em]'>
          <h3 className='text-xl font-bold text-white text-center tracking-[1.25px]'>Work Anniversaries</h3>
          <ul className='ml-0 pl-0 list-none'>{workAnniversariesInOrder}</ul>
        </section>

        <section className='max-h-[400px] flex flex-col overflow-y-scroll border-[3px] border-solid border-white my-[1em] mx-[3em] rounded-lg p-[2em]'>
          <h3 className='text-xl font-bold text-white text-center tracking-[1.25px]'>Names</h3>
          <ul className='ml-0 pl-0 list-none'>{allNames}</ul>
        </section>
      </div>
    </div>
  );
}

export default App;
