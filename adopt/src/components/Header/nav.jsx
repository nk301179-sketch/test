import './nav.css';

const Nav = ({ activePage }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <ul className="nav-list">
          <li className="nav-item">
            <a href="#home" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/findDog" className={`nav-link ${activePage === 'adopt' ? 'active' : ''}`}>
              Adopt Dogs
            </a>
          </li>
          <li className="nav-item">
            <a href="/report" className={`nav-link ${activePage === 'report' ? 'active' : ''}`}>
              Report
            </a>
          </li>
          <li className="nav-item">
            <a href="#surrender" className={`nav-link ${activePage === 'surrender' ? 'active' : ''}`}>
              Surrender
            </a>
          </li>
          <li className="nav-item">
            <a href="#contact" className={`nav-link ${activePage === 'contact' ? 'active' : ''}`}>
              Contact
            </a>
          </li>
          <li className="nav-item">
            <a href="/admin/dogs" className={`nav-link ${activePage === 'admin' ? 'active' : ''}`}>
              Admin
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;