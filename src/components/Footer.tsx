import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { connectors } from '../shared/const';
import { useChain } from '../shared/hook/useConnectChain';
import { useModal } from '../shared/hook/useModal';
import { FaLinkedin } from 'react-icons/fa';
import underConstruction from '../../src/img/images.jpg'

export const Footer = (props: any) => {

    return (
        <Container fluid className='text-white bg-darkc fixed-bottom footer ' style={{height:"60px" }}>
            <div className='d-flex h-100 justify-content-center align-items-center position-relative'>
                <a className='' href="https://www.linkedin.com/in/alex-tagliabue-villanueva/" target={"_blank"}><FaLinkedin size={26} /></a>
                <img style={{width:"60px", position:"absolute", right:"20px", bottom:"86px", borderRadius:"50%"}} src={underConstruction} alt="website under contruction" />
            </div>

        </Container>
    )
}
