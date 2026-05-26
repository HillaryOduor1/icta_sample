import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import ContentManager from "./components/ContentManager";
import ActivityLog from "./components/ActivityLog";
import Settings from "./components/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactMessages from "./components/ContactMessage";
import MasterDashboard from './components/MasterDashboard';
import useAdminSettings from './hooks/useAdminSettings';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const { loading } = useAdminSettings();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <AuthProvider>
      <Router basename="/">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/master/tenants" element={
            <ProtectedRoute roles={['superadmin']}>
              <MasterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/contact-messages" element={
            <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
              <ContactMessages />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/content" element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <ContentManager />
            </ProtectedRoute>
          } />
          <Route path="/activity" element={
            <ProtectedRoute roles={['admin']}>
              <ActivityLog />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
/*last stable
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import ContentManager from "./components/ContentManager";
import ActivityLog from "./components/ActivityLog";
import Settings from "./components/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactMessages from "./components/ContactMessage";
import MasterDashboard from './components/MasterDashboard';
import useAdminSettings from './hooks/useAdminSettings';

export default function App() {
  const { loading } = useAdminSettings();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <Router basename="/">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/master/tenants" element={
          <ProtectedRoute roles={['superadmin']}>
            <MasterDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/contact-messages" element={
          <ProtectedRoute roles={['admin', 'editor']}>
            <ContactMessages />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute roles={['admin']}>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/content" element={
          <ProtectedRoute roles={['admin', 'editor']}>
            <ContentManager />
          </ProtectedRoute>
        } />
        <Route path="/activity" element={
          <ProtectedRoute roles={['admin']}>
            <ActivityLog />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute roles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}*/

/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import ContentManager from "./components/ContentManager";
import ActivityLog from "./components/ActivityLog";
import Settings from "./components/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactMessages from "./components/ContactMessage";
import MasterDashboard from './components/MasterDashboard';
import useAdminSettings from './hooks/useAdminSettings';

export default function App() {
  const { loading } = useAdminSettings(); // loads and applies on mount

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
              <span className="loader" style={{ color: 'var(--accent)' }}></span>
            </div>;

  return (
    <Router basename="/">
      <Routes>
        {/* Public route /}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected routes /}
        <Route
          path="/master/tenants"
          element={
            <ProtectedRoute roles={['superadmin']}>
              <MasterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact-messages"
          element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <ContactMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
              <Dashboard initialTab="analytics" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content"
          element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <ContentManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute roles={['admin']}>
              <ActivityLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={['admin']}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect to login /}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}*/


/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import ContentManager from "./components/ContentManager";
import ActivityLog from "./components/ActivityLog";
import Settings from "./components/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactMessages from "./components/ContactMessage";
import MasterDashboard from './components/MasterDashboard';
import useAdminSettings from './hooks/useAdminSettings';

export default function App() {
   const { loading } = useAdminSettings(); // loads and applies on mount

  if (loading) return <div>Loading admin interface...</div>;
  return (
    <Router basename="/">   {/* ✅ changed from "/admin" to "/" /}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/master/tenants"
          element={
            <ProtectedRoute roles={['superadmin']}>
              <MasterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['admin','editor','viewer']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/contact-messages" element={
          <ProtectedRoute roles={['admin','editor']}>
            <ContactMessages />
          </ProtectedRoute>
        } />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute roles={['admin','editor','viewer']}>
              <Dashboard initialTab="analytics" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content"
          element={
            <ProtectedRoute roles={['admin','editor']}>
              <ContentManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute roles={['admin']}>
              <ActivityLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={['admin']}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}*/

/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import ContentManager from "./components/ContentManager";
import ActivityLog from "./components/ActivityLog";      // import if you have it
import Settings from "./components/Settings";            // import if you have it
import ProtectedRoute from "./components/ProtectedRoute";
import ContactMessages from "./components/ContactMessage";

export default function App() {
  return (
    <Router basename="/admin">   {/* ← critical /}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['admin','editor','viewer']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/contact-messages" element={
          <ProtectedRoute roles={['admin','editor']}>
            <ContactMessages />
          </ProtectedRoute>
        } />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content"
          element={
            <ProtectedRoute roles={['admin','editor']}>
              <ContentManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute roles={['admin']}>
              <ActivityLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={['admin']}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}*/

/*import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import ContentManager from "./components/ContentManager";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC /}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD (ALL USERS) /}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['admin','editor','viewer']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ONLY /}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* ADMIN + EDITOR /}
        <Route
          path="/admin/content"
          element={
            <ProtectedRoute roles={['admin','editor']}>
              <ContentManager />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT /}
        <Route path="*" element={<Login />} />

      </Routes>
    </Router>
  );
}*/
