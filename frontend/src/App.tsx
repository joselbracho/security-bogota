import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Camera, Ticket } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Cameras from './pages/Cameras';
import Tickets from './pages/Tickets';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="p-6 text-xl font-bold border-b border-slate-800">
            Security Bogotá
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/cameras" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition">
              <Camera size={20} />
              <span>Cámaras</span>
            </Link>
            <Link to="/tickets" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition">
              <Ticket size={20} />
              <span>Tickets</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4 text-gray-700 font-medium">
            Mantenimiento de Videovigilancia Urbana
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cameras" element={<Cameras />} />
              <Route path="/tickets" element={<Tickets />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
