'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function StudentsPage() {
  const API_URL = 'http://127.0.0.1:8000/api/student/'

  const [students, setStudents] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    adress: '',
    department: '',
    phone: '',
  })

  const [photo, setPhoto] = useState(null)

  const [editingId, setEditingId] = useState(null)

  // =========================
  // GET ALL
  // =========================

  const fetchStudents = async () => {
    const res = await fetch(API_URL)

    const data = await res.json()

    setStudents(data)
  }

  useEffect(() => {
    const loadData = async () => {
      fetchStudents()
    }
    loadData()
  }, [])

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // =========================
  // CREATE OR UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    const sendData = new FormData()

    sendData.append('name', formData.name)
    sendData.append('adress', formData.adress)
    sendData.append('department', formData.department)
    sendData.append('phone', formData.phone)

    if (photo) {
      sendData.append('photo', photo)
    }

    // CREATE
    if (!editingId) {
      await fetch(API_URL, {
        method: 'POST',
        body: sendData,
      })
    } else {
      // UPDATE
      await fetch(`${API_URL}${editingId}/`, {
        method: 'PUT',
        body: sendData,
      })

      setEditingId(null)
    }

    setFormData({
      name: '',
      adress: '',
      department: '',
      phone: '',
    })

    setPhoto(null)

    fetchStudents()
  }

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    await fetch(`${API_URL}${id}/`, {
      method: 'DELETE',
    })

    fetchStudents()
  }

  // =========================
  // EDIT
  // =========================

  const handleEdit = (student) => {
    setEditingId(student.id)

    setFormData({
      name: student.name,
      adress: student.adress,
      department: student.department,
      phone: student.phone,
    })
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Student CRUD</h1>

      {/* FORM */}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="adress"
          placeholder="Address"
          value={formData.adress}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <br />
        <br />

        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

        <br />
        <br />

        <button className='bg-blue-500 p-4 rounded-2xl  ' type="submit">{editingId ? 'Update Student' : 'Create Student'}</button>
      </form>

      <hr />

      {/* STUDENT LIST */}

      {students.map((student) => (
        <div
          key={student.id}
          style={{
            border: '1px solid gray',
            padding: '10px',
            marginBottom: '20px',
          }}
        >
          <h3>{student.name}</h3>

          <p>{student.adress}</p>

          <p>{student.department}</p>

          <p>{student.phone}</p>

          <Image src={`https://res.cloudinary.com/ds8pqfvld/${student.photo}`} alt='hfgg' width="200" height={300}/>

          <br />
          <br />

          <button onClick={() => handleEdit(student)}>Edit</button>

          <button onClick={() => handleDelete(student.id)} style={{ marginLeft: '10px' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
