import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Button} from "@material-ui/core";


const DataTable = ({data, onPinnedItem, onWatch, metadata}) => {

    const getDailyChange = (data) => {
        if (data.OPEN24HOUR && data.PRICE) {
            return data.PRICE - data.OPEN24HOUR;
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Price</TableCell>
                        <TableCell align="left">Daily change</TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.FROMSYMBOL}>
                            <TableCell component="th" scope="row">
                                <img width="35px" src={'https://cryptocompare.com' + metadata[row.FROMSYMBOL].ImageUrl}
                                     alt={row.FROMSYMBOL}/>
                            </TableCell>
                            <TableCell align="left">{metadata[row.FROMSYMBOL].FullName}</TableCell>
                            <TableCell align="left">${row.PRICE}</TableCell>
                            <TableCell align="left" className={getDailyChange(row) > 0 ? 'green' : 'red'}>${getDailyChange(row).toFixed(2)}</TableCell>
                            <TableCell align="left">
                                <Button style={{marginRight: "15px"}} onClick={onPinnedItem.bind(this, row)} color="primary" variant="outlined">{row.isPinned ? 'UNPIN' : 'PIN'}</Button>
                                <Button onClick={onWatch.bind(this, row)} color="primary" variant="outlined">Watch</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DataTable;
