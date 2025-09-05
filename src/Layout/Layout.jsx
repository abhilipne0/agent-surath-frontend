import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

const Layout = () => {
  return (
    <div className="layout-wrapper">
      <Header />
      <main className="main-content with-bottom-padding bg-blue">
        <Outlet />
      </main>
      <BottomNavBar />
    </div>
  );
};

export default Layout;
