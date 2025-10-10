import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import Tools from '../pages/Tools'
import Navbar from '../components/layout/Navbar'
function AppRoutes() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tools" element={<Tools />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes