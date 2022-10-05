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

export const Navbarg = () => {
    const { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen } = useModal()
    const { account} = useWeb3React()
    const {logout, } = useChain()

    return (
        <Navbar fixed="top" expand="lg" variant="dark" bg="dark">
            <Container fluid>
                <Navbar.Brand><Link to="/">Home</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0 text-center"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav className='me-3'><Link to="/mycollection">My NFTs</Link></Nav>
                        <Nav><Link to="/mint">Create</Link></Nav>

                    </Nav>
                    <Form className="d-flex">
                        {!account ?
                            <Button variant="light" onClick={() => callSetConnectIsOpen(true)}>Connect</Button>
                            :
                            <Button variant="light" onClick={() => callSetLogoutIsOpen(true)}>{displayFormat(account)}</Button>
                        }
                    </Form>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}