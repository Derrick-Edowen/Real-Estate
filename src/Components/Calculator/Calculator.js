import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Indexcalc.css'

function Calculator() {
    return (
      <div className="containerCalc">
        <div className="header">
          <h1 style={{ color: "#6258A8" }}>Loan Calculator</h1>
          <button>
            <i className="bi bi-list"></i>
          </button>
        </div>
        <div className="sub-container">
          <div className="view">
            <div className="details">
              <div>
                <div className="detail">
                  <p style={{ color: "#9088D2" }}>Amount</p>
                  <p id="loan-amt-text" style={{ color: "#6258A8" }}></p>
                </div>
                <input
                  type="range"
                  id="loan-amount"
                  min="0"
                  max="10000000"
                  step="50000"
                
                />
              </div>
              <div>
                <div className="detail">
                  <p style={{ color: "#9088D2" }}>Length</p>
                  <p id="loan-period-text" style={{ color: "#6258A8" }}></p>
                </div>
                <input
                  type="range"
                  id="loan-period"
                  min="1"
                  max="30"
                  step="1"
                
                />
              </div>
              <div>
                <div className="detail">
                  <p style={{ color: "#9088D2" }}>% Interest</p>
                  <p id="interest-rate-text" style={{ color: "#6258A8" }}></p>
                </div>
                <input
                  type="range"
                  id="interest-rate"
                  min="1"
                  max="15"
                  step="0.5"
                
                />
              </div>
            </div>
            <div className="footer">
              <p id="price-container">
                <span id="price">0</span>/mo
              </p>
            </div>
          </div>
          <div className="breakup">
            <canvas id="pieChart"></canvas>
          </div>
        </div>
        <div>
          <div className="loan-details">
            <div className="chart-details">
              <p style={{ color: "#9088D2" }}>Principal</p>
              <p id="cp" style={{ color: "#130F31", fontSize: "17px" }}></p>
            </div>
            <div className="chart-details">
              <p style={{ color: "#9088D2" }}>Interest</p>
              <p id="ci" style={{ color: "#130F31", fontSize: "17px" }}></p>
            </div>
            <div className="chart-details">
              <p style={{ color: "#9088D2" }}>Total Payable</p>
              <p id="ct" style={{ color: "#130F31", fontSize: "17px" }}></p>
            </div>
          </div>
        </div>
      </div>
    );
  
};


export default Calculator;

