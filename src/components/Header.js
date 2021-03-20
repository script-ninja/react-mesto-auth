import logo from '../images/header__logo.svg';

export default function Header() {
  return (
    <header className="header page__header">
      <a className="header__logo-link" href="https://script-ninja.github.io/mesto">
        <img className="header__logo" src={logo} alt="Логотип Mesto" />
      </a>
    </header>
  );
}
