import React, { useState } from 'react'

type Answers = { [key: string]: string }

const questions = [
  { id: 'q1', text: 'กรุณาแนะนำตัวสั้น ๆ' },
  { id: 'q2', text: 'เหตุผลที่สนใจตำแหน่งนี้คืออะไร?' },
  { id: 'q3', text: 'ทักษะที่แข็งแกร่งที่สุดของคุณคืออะไร?' },
]

const Interview: React.FC = () => {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAnswers({ ...answers, [questions[index].id]: e.target.value })
  }

  function next() {
    if (index < questions.length - 1) setIndex(index + 1)
  }

  function prev() {
    if (index > 0) setIndex(index - 1)
  }

  function submit() {
    setSubmitted(true)
    // In a real app you might POST answers to an API here.
  }

  if (submitted) {
    return (
      <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
        <h2>สรุปคำตอบ</h2>
        <ul>
          {questions.map((q) => (
            <li key={q.id} style={{ marginBottom: 12 }}>
              <strong>{q.text}</strong>
              <div style={{ whiteSpace: 'pre-wrap' }}>{answers[q.id] || '- ยังไม่มีคำตอบ -'}</div>
            </li>
          ))}
        </ul>
        <button onClick={() => { setSubmitted(false); setIndex(0); }}>แก้ไขคำตอบ</button>
      </div>
    )
  }

  const q = questions[index]

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
      <h2>แบบสอบสัมภาษณ์แบบง่าย ๆ</h2>
      <p>คำถามที่ {index + 1} จาก {questions.length}</p>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{q.text}</label>
        <textarea
          rows={6}
          style={{ width: '100%', padding: 8, fontSize: 14 }}
          value={answers[q.id] || ''}
          onChange={handleChange}
          placeholder="พิมพ์คำตอบที่นี่..."
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={prev} disabled={index === 0}>ก่อนหน้า</button>
        {index < questions.length - 1 ? (
          <button onClick={next}>ถัดไป</button>
        ) : (
          <button onClick={submit}>ส่งคำตอบ</button>
        )}
      </div>
    </div>
  )
}

export default Interview
