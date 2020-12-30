import React, { Component, Fragment, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import './LineGraph.css';
import api from "../../services/api";
import { getMonthAbr } from './utils.js';
import { getToken } from '../../services/auth';

const LineGraph = ( { hostDevice } ) => {

    const [chartData, setCharData] = useState({});
    const options = {
        responsive: true,
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
        }
    }
    
    const getChartData = async (hostPhone) => {
        api.get('/messagesLastYear', {
            params : {hostNumber : hostPhone},
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }).then(response => {
            const resultResponse = response.data.result;
            let labels = [];
            let data = [];
            resultResponse.forEach(element => {
                let aux = `${getMonthAbr(element.month)}/${String(element.year).substring(2,4)}`;
                labels.push(aux);
                data.push(element.total);
            });
            setCharData({
                labels:labels,
                datasets: [
                    {
                        label: "Total",
                        data: data,
                        fill: false,
                        borderColor: [
                            "rgba(107, 160, 152, 1)",
                            "rgba(150, 160, 152, 1)",
                            "rgba(150, 160, 152, 1)"
                        ],
                    }
                ]
            });
        });
      }
      
      useEffect(() => {
        var hostPhone;
        try{
            hostPhone = hostDevice.wid;
            getChartData(hostPhone);
        }catch(err){
            console.log("");
        }
      }, [hostDevice])

      return (
          <div className="App">
        {Object.keys(chartData).length &&
            (
                <div id="totalByYear-chart" className="card">
                    <h2>Total de Clientes</h2>
                    <Line height={80} data={chartData} options={options} />
                </div>
            )
        }
        </div>
    );
}

export default LineGraph;





