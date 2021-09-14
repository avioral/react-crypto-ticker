import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from "react-router-dom";
import axios from "axios";
import {CURRENCIES_DATA, SOCKET_URL} from "../../api";
import DataTable from "./Table";
import {Loading} from "../../components/loading";
import { CircularProgress} from "@material-ui/core";

const HomePage = () => {

    const [metadata, setMetadata] = useState({})
    const [list, setList] = useState(['BTC','ETH','XRP','DASH','XMR'])
    const [currencies, setCurrencies] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const ws = useRef(null);
    const history = useHistory();

    useEffect(() => {


        const fetchData = async () => {
            let response = await axios.get(CURRENCIES_DATA,
                {
                    params: {
                        fsyms: list.join(','),
                        tsym: 'USD'
                    }
                }
            )
                .then(response => response.data.Data);

            let data = {};

            response.forEach(function (item) {
                data[item.CoinInfo.Name] = item.CoinInfo;
            });

            setMetadata(data);

        }

        fetchData().then(createSocket);


        return function cleanup() {
            setIsLoading(true)
            if (ws.current) {
                ws.current.close();
            }
        }

    }, [list]);


    const createSocket = () => {
        ws.current = new WebSocket(SOCKET_URL(process.env.REACT_APP_API_KEY));

        ws.current.onopen = function (evt) {
            ws.current.send(
                JSON.stringify({
                    "action": "SubAdd",
                    "subs": list.map(sub => `5~CCCAGG~${sub}~USD`),
                })
            );
        }

        ws.current.onmessage = (evt) => {
            onSocketMessageReceived(JSON.parse(evt.data))
        };

        ws.current.onerror = function (evt) {
            console.error('an error occurred', evt.data);
        };
    }


    const onSocketMessageReceived = (data) => {

        if (data.TYPE === '3') {
            setIsLoading(false);
        } else if (data.TYPE === '5') {
            let currency = currencies.findIndex(x => x.FROMSYMBOL === data.FROMSYMBOL);

            //If it is a new item
            if (currency === -1) {
                data.isPinned = 0;
                currencies.push(data)
            } else {
                currencies[currency] = Object.assign(currencies[currency], data)
            }

            //Prevent system overload
            setTimeout(() => {
                setCurrencies(currencies => [...sortCurrencies(currencies)]);
            }, 300)
        }

    }


    //Sort the currencies list first by pinned and then by price
    const sortCurrencies = (list) => {
        return list.sort(function (a, b) {
            return b.isPinned - a.isPinned || b.PRICE - a.PRICE;
        });
    }

    const navigateTo = (currency) => {
        history.push({
            pathname: `/currencies/${currency.FROMSYMBOL}`,
            state: currency,
        });
    }

    //Toggle pinned item
    const pinItem = (currency) => {
        currency.isPinned = currency.isPinned === 0 ? 1 : 0;
        setCurrencies(sortCurrencies(currencies));
    }

    if (isLoading) {
        return (
            <Loading>
                <CircularProgress/>
            </Loading>
        );
    }
    return (
        <DataTable data={currencies} onPinnedItem={pinItem} onWatch={navigateTo} metadata={metadata}/>
    );
};

export default HomePage;


