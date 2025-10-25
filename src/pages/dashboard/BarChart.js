import React, { useEffect, useRef } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';


Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = () => {
    const chartRef = useRef(null); 
    const chartInstanceRef = useRef(null); 

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Sales',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Sales Chart',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy(); 
        }
        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar', 
            data: data,
            options: options,
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div>
            <canvas ref={chartRef} /> 
        </div>
    );
};

export default BarChart;
