import headerLogo from '../images/logo.svg';


function Header() {
    return (
        <header className="header">
            <img
                src={headerLogo}
                alt="надпись Место"
                className="header__logo" />
        </header>
    )
}
export default Header;