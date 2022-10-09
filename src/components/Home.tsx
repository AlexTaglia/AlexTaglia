import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { connectors } from '../shared/const';
import { useChain } from '../shared/hook/useConnectChain';
import { useModal } from '../shared/hook/useModal';

export const Home = (props: any) => {

    return (
        <Container className='text-white' style={{ marginTop: "60px", height: "calc(100vh - 60px - 59px )", zIndex: 1 }}>
            <Row className='h-100'>
                <Col xs={12} md={6} className=' d-flex flex-column justify-content-center text-start h-100'>
                    <h1><strong>Hi, I'm Alex</strong></h1>
                    <h3>Junior web developer</h3>
                    <h5>React developer / Blockchain developer</h5>
                </Col>
                <Col>
                </Col>
            </Row>
        </Container>
    )
}
