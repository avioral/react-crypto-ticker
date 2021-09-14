import React from 'react';
import axios from "axios";
import {HISTORICAL_DATA} from "../../api";
import {Line} from "react-chartjs-2";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

class Chart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            chartData: [],
            cachedData: {},
            period: 7,
        };
    }

    componentDidMount() {
        this.renderChart(this.state.period);
    }

    componentWillUnmount() {
        this.setState({chartData : []})
    }

    /**
     * Keep cached version to prevent same api calls
     * @param period
     */
    renderChart(period) {

        if (this.state.cachedData.hasOwnProperty(period)) {
            this.setState({chartData: this.state.cachedData[period]});
            return;
        }

        this.fetchData(period)
            .then((data) => {
                this.setState({chartData: data});

                this.setState(prevState => {
                    let cachedData = Object.assign({}, prevState.cachedData);  // creating copy of state variable jasper
                    cachedData[this.state.period] = data;
                    return {cachedData};
                });
            });
    }

    async fetchData(period) {
        return await axios.get(HISTORICAL_DATA,
            {
                params: {
                    fsym: this.props.currency.Name,
                    tsym: 'USD',
                    limit: period
                }
            }
        )
            .then(response => this.formatData(response.data.Data.Data))
    }

    formatData(data) {

        let formattedData = {
            labels: [],
            datasets: [
                {
                    label: "",
                    data: [],
                    backgroundColor: "rgb(255, 99, 132, 0.8)",
                    borderColor: "rgba(255, 99, 132, 0.2)",
                    fill: false
                }
            ]
        };


        formattedData.labels = data.map((val) => {
            const ts = val.time;
            let date = new Date(ts * 1000);
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            return `${month}-${day}-${year}`;
        });

        formattedData.datasets[0].data = data.map(val => val.close);

        return formattedData;
    }

    get chartOptions() {
        return  {
            scales: {
                y: {

                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            plugins:   {
                legend : {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return '$' + tooltipItem.parsed.y;
                        }
                    }
                },
                title: {
                    display: true,
                    text: `${this.props.currency.FullName} price in the past ${this.state.period} days (USD)`
                }
            }
        }
    }

    render() {
        return (
            <>
                <div className="flex align-x-end">
                    <ToggleButtonGroup className="m-t-m"
                                       value={this.state.period.toString()}
                                       exclusive
                                       onChange={(ev,value) => {
                                           let period = parseInt(value);
                                           this.renderChart(period);
                                           this.setState({period: period});
                                       }}
                                       aria-label="Period"
                    >
                        <ToggleButton size="small" value="7" aria-label="One week">7D</ToggleButton>
                        <ToggleButton size="small" value="30" aria-label="One month">1M</ToggleButton>
                    </ToggleButtonGroup>
                </div>

                <Line data={this.state.chartData} options={this.chartOptions}/>
            </>
        )
    }
}

export default Chart;
