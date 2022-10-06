import { useWeb3React } from '@web3-react/core';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { useChain } from '../shared/hook/useConnectChain';
import { useModal } from '../shared/hook/useModal';
import { displayFormat } from '../shared/utils/Formatters';
import { FaWallet } from 'react-icons/fa';

export const Navbarg = () => {
    const { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen } = useModal()
    const { account } = useWeb3React()
    const { logout, } = useChain()

    return (
        <Navbar fixed="top" expand="lg" variant="dark" bg="dark">
            <Container>
                <Navbar.Brand><Link to="/">Home</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll" className='justify-content-end'>
                    <Nav
                        className=" my-2 my-lg-0 text-center"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <NavDropdown title="Blockchain" id="collasible-nav-dropdown">
                            <Link className='text-dark dropdown-item' to="/mycollection">My NFTs</Link>
                            <Link className='text-dark dropdown-item' to="/mint">Create</Link>
                        </NavDropdown>

                    </Nav>
                    <Form className="d-flex ms-4">
                        {!account ?
                            <Button variant="light" onClick={() => callSetConnectIsOpen(true)}><FaWallet/></Button>
                            :
                            <Button variant="success" onClick={() => callSetLogoutIsOpen(true)}>{displayFormat(account)}</Button>
                        }
                    </Form>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}