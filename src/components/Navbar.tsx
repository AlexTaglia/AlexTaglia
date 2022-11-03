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
import { FaHome, FaWallet } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';

export const Navbarg = () => {
    const { modal, callSetModal, callSetLogoutIsOpen, callSetConnectIsOpen } = useModal()
    const { account } = useWeb3React()
    const { logout, ensToAddr, balance, ensName } = useChain()

    return (
        <Navbar fixed="top" expand="lg" variant="dark" className='bg-darkc'>
            <Container className='justify-content-between'>

                <Navbar.Brand><Link to="/"><FaHome size={22} /></Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll " />
                <Navbar.Collapse id="navbarScroll" className='justify-content-end'>
                    <Nav className=" my-2 my-lg-0 text-center">
                        <NavDropdown title="Blockchain" id="collasible-nav-dropdown">
                            <Link className='text-dark dropdown-item' to="/chat">Chat</Link>
                            <Link className='text-dark dropdown-item' to="/create">Create</Link>
                            <Link className='text-dark dropdown-item' to="/multisig">Multisig wallet</Link>

                            {/* <Accordion>
                                <Accordion.Header>NFT</Accordion.Header>
                                <Accordion.Body>
                                    <Link className='text-dark dropdown-item' to="/create">Create</Link>
                                    <Link className='text-dark dropdown-item' to="/created">Crations</Link>
                                    <Link className='text-dark dropdown-item' to="/collected">Collected</Link>
                                </Accordion.Body>
                            </Accordion> */}
                        </NavDropdown>

                    </Nav>
                    <Navbar.Brand className='m-0'>
                        {!account ?
                            <Button variant="light" onClick={() => callSetConnectIsOpen(true)}><FaWallet /></Button>
                            :
                            <Button variant="primary" onClick={() => callSetLogoutIsOpen(true)}>
                                {balance.toFixed(4)} ETH, {ensName ? ensName : displayFormat(account)}
                            </Button>
                        }

                    </Navbar.Brand>

                </Navbar.Collapse>

            </Container>
        </Navbar>
        // <>
        //     <Navbar fixed="top" bg="dark" expand="lg" className="mb-3" variant="dark">
        //         <Container fluid>
        //             <Navbar.Brand href="#">AlexTaglia</Navbar.Brand>
        //             <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
        //             <Navbar.Offcanvas
        //                 id={`offcanvasNavbar-expand-md`}
        //                 aria-labelledby={`offcanvasNavbarLabel-expand-md`}
        //                 placement="end"
        //             >
        //                 <Offcanvas.Header closeButton>
        //                     <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
        //                         AlexTaglia
        //                     </Offcanvas.Title>
        //                 </Offcanvas.Header>
        //                 <Offcanvas.Body>
        //                     <Nav className="justify-content-end flex-grow-1 pe-3">
        //                         {/* <Nav.Link href="#action1">Home</Nav.Link> */}
        //                         {/* <Nav.Link href="#action2">Link</Nav.Link> */}
        //                         <NavDropdown
        //                             title="Blockchain"
        //                             id={`offcanvasNavbarDropdown-expand-md`}
        //                         >
        //                             <Link className='text-dark dropdown-item' to="/mycollection">My NFTs</Link>
        //                             <Link className='text-dark dropdown-item' to="/mint">Create</Link>
        //                             {/* <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
        //                             <NavDropdown.Item href="#action4">
        //                                 Another action
        //                             </NavDropdown.Item>
        //                             <NavDropdown.Divider />
        //                             <NavDropdown.Item href="#action5">
        //                                 Something else here
        //                             </NavDropdown.Item> */}
        //                         </NavDropdown>
        //                     </Nav>
        //                     <Form className="d-flex">
        //                         <Form.Control
        //                             type="search"
        //                             placeholder="Search"
        //                             className="me-2"
        //                             aria-label="Search"
        //                         />
        //                         {!account ?
        //                      <Button variant="light" onClick={() => callSetConnectIsOpen(true)}>< FaWallet style={{marginLeft:"5px",marginRight:"5px" }}/></Button>
        //                      :
        //                      <Button variant="success" onClick={() => callSetLogoutIsOpen(true)}>{displayFormat(account)}</Button>
        //                  }
        //                     </Form>
        //                 </Offcanvas.Body>
        //             </Navbar.Offcanvas>
        //         </Container>
        //     </Navbar>
        // </>
    );
}