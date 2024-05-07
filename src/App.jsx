import './App.css';
import Home from './components/Home';
import Customerlist from './components/Customerlist';
import TrainingList from './components/Traininglist';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Calendar from './components/Calendar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customerlist" element={<Customerlist />} />
        <Route path="/traininglist" element={<TrainingList />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </>
  );
}

export default App