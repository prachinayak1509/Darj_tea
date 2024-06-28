import React, { Component } from "react";
import "../styles.css";
import Home from "./HomeComponent";
import AllItemComponent from "./AllItemComponent";
import AllMemComponent from "./AllMemComponent";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./FooterComponent";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      balance: 0,
      contract: null,
      res: null,
      registered: 0,
      plotAddedEvents: [],
      plotSaleEvents: [],
      plotForBuyEvents: [],
      plotTransferredEvent: [],
      aadhar: localStorage.getItem("myAadhar"),
    };
    this.changeAadhar = this.changeAadhar.bind(this);
  }

  changeAadhar = async (aad) => {
    this.setState({ aadhar: aad });
    console.log(aad);
  };

  componentDidMount = async () => {
    try {
      console.log("Time end app load", Date.now());
      console.log(this.state);
    } catch (error) {}
  };

  render() {
    return (
      <div className="App">
        {/* <Header /> */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/allitem" element={<AllItemComponent />} />
          <Route exact path="/allmem" element={<AllMemComponent />} />
        </Routes>
        <Footer />
      </div>
    );
  }
}

export default Main;
