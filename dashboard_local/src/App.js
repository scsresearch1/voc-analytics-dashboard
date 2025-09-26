import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import OptionsPage from './OptionsPage';
import DataFormat from './DataFormat';
import Dashboard from './Dashboard';
import Phase2Dashboard from './Phase2Dashboard';
import Phase3BioDashboard from './Phase3BioDashboard';
import BaselineDashboard from './BaselineDashboard';
import BME688Research from './BME688Research';
import SchematicDesign from './SchematicDesign';
import StabilizationProcess from './StabilizationProcess';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/data-format" element={<DataFormat />} />
        <Route path="/baseline-dashboard" element={<BaselineDashboard />} />
        <Route path="/bme688-research" element={<BME688Research />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/phase2-dashboard" element={<Phase2Dashboard />} />
        <Route path="/phase3-bio-dashboard" element={<Phase3BioDashboard />} />
        <Route path="/schematic-design" element={<SchematicDesign />} />
        <Route path="/stabilization-process" element={<StabilizationProcess />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
