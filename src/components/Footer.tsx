import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { connectors } from '../shared/const';
import { useChain } from '../shared/hook/useConnectChain';
import { useModal } from '../shared/hook/useModal';
import { FaLinkedin } from 'react-icons/fa';

export const Footer = (props: any) => {

    return (
        <Container fluid className='text-white bg-dark fixed-bottom footer' style={{height:"60px" }}>
            <Row className='justify-content-center'>
                <Col>
                <a href="https://www.linkedin.com/in/alex-tagliabue-villanueva/" target={"_blank"}><FaLinkedin /></a>
                </Col>
            </Row>
        </Container>
    )
}
