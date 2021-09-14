import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";

import axios from "axios";

import {CURRENCY_DATA, CURRENCY_PRICE} from "../../api";
import {Button, CircularProgress} from "@material-ui/core";
import {Loading} from "../../components/loading";
import Chart from "./Chart";

const Currency = () => {


    const history = useHistory();
    let {currency} = useParams();
    const [price, setPrice] = useState(0)
    const [metadata, setMetadata] = useState({})
    const [isLoading, setIsLoading] = useState(true)


    //Handle static metadata
    useEffect(() => {

        const fetchData = async () => {
            let response = await axios.get(CURRENCY_DATA,
                {
                    params: {
                        fsym: currency,
                        tsyms: 'USD'
                    }
                }
            )
                .then(response => response.data.Data)
                .catch(() => {
                    history.push('/');
                });

            if( ! response || !Object.keys(response).length) {
                history.push('/');
                return;
            }

            setMetadata(response.CoinInfo);
            setIsLoading(false);
        }

        fetchData()

        return function cleanup() {
            setIsLoading(true)
        }

    }, []);

    useEffect(() => {

        const fetchData = async () => {
            let price = await axios.get(CURRENCY_PRICE,
                    {
                        params: {
                            fsym: currency,
                            tsyms: 'USD'
                        }
                    }
                )
                    .then(response => response.data.USD);

            setPrice(price);
        }

        fetchData()
    }, [])


    if (isLoading) {
        return (
            <Loading>
                <CircularProgress/>
            </Loading>
        );
    }

    return (

        <div className="currency">

            <Button variant="outlined" onClick={() => {history.push('/')}}>Back to list</Button>

            <div className="flex align-y-center align-x-center">
                <img width="32px" src={"https://cryptocompare.com" + metadata.ImageUrl} alt=""/>
                <div className="currency__symbol">{metadata.FullName}</div>
            </div>


            <div className="flex m-t-s align-x-center align-y-center direction-column">
                <div className="currency__data">Current price: ${price}</div>
                <div className="currency__data">Block height: {metadata.BlockNumber}</div>
                <div className="currency__data">Launch date: {metadata.AssetLaunchDate.split('-').reverse().join('-')}</div>
            </div>

            <Chart currency={metadata}/>
        </div>
    );


};

export default Currency;


