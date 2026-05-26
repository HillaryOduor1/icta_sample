// src/Layout/PublicLayout.tsx
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#0d1b14] dark:text-white transition-colors duration-300">
      <main className="w-full pt-16" role="main"> {/* pt-16 accounts for fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
/*
// src/Layout/PublicLayout.tsx
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#0d1b14] dark:text-white transition-colors duration-300">
      <main className="w-full pt-16"> {/* pt-16 accounts for fixed navbar *}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;*/
