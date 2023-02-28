import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../componets/Product'
import { Row, Col } from 'react-bootstrap'
import { listProducts } from '../actions/productActions';
import Message from '../componets/Message'
import Loader from '../componets/Loader'
import Paginate from '../componets/Paginate'
import Meta from '../componets/Meta'



const HomeScreen = () => {
    const keyword = ' '
    const pageNumber = window.location.href.split('/')[4] || 1;



    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList)
    let { loading, error, products, page, pages } = productList



    useEffect(() => {
        dispatch(listProducts(pageNumber))
    }, [dispatch, pageNumber])


    return (
        <>
            <Meta />
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <Row>
                        {products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate
                        pages={pages}
                        page={page}
                        keyword={keyword ? keyword : ''}

                    />
                </>
            )}
        </>
    )
}

export default HomeScreen
