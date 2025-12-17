import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
	return (
		<div style={{ padding: 20 }}>
			<h1>ยินดีต้อนรับสู่ Deeshop Frontend</h1>
			<p>นี่เป็นหน้าแรกของตัวอย่าง โปรเจกต์</p>
			<p>
				<Link to="/interview">ไปที่แบบสัมภาษณ์แบบง่าย ๆ</Link>
			</p>
		</div>
	)
}

export default HomePage
