import React, { Component } from "react";
import "../styles.css";
import Home from "./HomeComponent";
import AllItemComponent from "./AllItemComponent";
import AllMemComponent from "./AllMemComponent";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./FooterComponent";
import Header from "./HeaderComponent";
import SignUp from "./SignUpComponent";
import AllShipmentComponent from "./AllShipmentComponent";
import { EthContext } from "../contexts/EthContext";

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

  static contextType = EthContext;

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
    const { state } = this.context;
    if (!state) {
      return<></>
    }
    return (
      <div className="App">
        <Header  web3Data={state}/>
        <Routes>
        <Route
            exact
            path="/signup"
            element={(<SignUp
                web3Data={state}
                changeAadhar={this.changeAadhar}
              />
            )}
          />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/allitem" element={<AllItemComponent />} />
          <Route exact path="/allmem" element={<AllMemComponent />} />
          <Route
            exact
            path="/allship"
            element={
              <AllShipmentComponent/>
            }
          />
        </Routes>
        
        <Footer />
      </div>
    );
  }
}

export default Main;
