import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import Register from './pages/Register/Register'
import Video from './pages/Register/Video'
function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/hamkor' element={<HomePage />} />
				<Route path='/hamkor/:lang' element={<Register />} />
				<Route path='/hamkor/:lang/:pinfl/:birthday' element={<Video />} />
			</Routes>
		</>
	)
}

export default App
