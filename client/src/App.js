import './App.css';
import { Route, Routes } from 'react-router-dom';
import Auth from './pages/auth';
import Home from './pages/home';
import VideoCall from './components/videoCall';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
        {/* <Route path="/VideoChat" element={<VideoCall />} /> */}
      </Routes>
    </div>
  );
}

export default App;
