import '../../App.css';

export function Header(props) {
  return (
    <header className="header">
      <h2>ODIC Client Example</h2>
      <nav>
        <ul className="btn-list">
          <li>
            <a
              className="btn btn-primary"
              href={props.loginLink}
              rel="noopener noreferrer"
            >
              Login
            </a>
          </li>
          <li>
            <a
              className="btn btn-exit"
              href={props.logoutLink}
              rel="noopener noreferrer"
              onClick={() => localStorage.clear('token')}
            >
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
