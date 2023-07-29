import headerLogo from '../images/logo.svg';
import { Link } from "react-router-dom";


function Header(props) {
    return (
        <header className="header">
            <img
                src={headerLogo}
                alt="надпись Место"
                className="header__logo" />
            <nav className="header__auth">
              <p className="header__mail">{props.mail}</p>
              <Link to={props.route} className="header__link" type="button" onClick={props.onClick}>{props.title}</Link>
            </nav>
        </header>
    )
}
export default Header;