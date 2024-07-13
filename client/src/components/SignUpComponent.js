import React, { Component } from "react";
import { Button, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles.css";
import "./SignUpComponent.css";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: "",
      aadhar: 0,
      role: "",
      pincode: 0,
      adminWallets: [],
      userAddrs: [],
      userRole: "",
      web3Data: null,
      validate: <div></div>,
    };
    this.handleSubmitUser = this.handleSubmitUser.bind(this);
    this.handleSubmitAdmin = this.handleSubmitAdmin.bind(this);
    this.handleSubmitGovt = this.handleSubmitGovt.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addingAdmin = this.addingAdmin.bind(this);
    this.addingUser = this.addingUser.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.getWeb3Data = this.getWeb3Data.bind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  async handleSubmitAdmin(event) {
    event.preventDefault();
    if(1) {
        this.addingAdmin();
    }
    if (this.handleValidateAdmin(this.props.accounts)) {
      this.addingAdmin();
    } else {
      let validate = (
        <div key={1}>
          <Alert color="warning" toggle={this.onDismiss} fade={false}>
            Do a login with same wallet. Account already exists
          </Alert>
        </div>
      );
      this.setState({
        validate: validate,
      });
    }
  }

  async handleSubmitUser(event) {
    event.preventDefault();
    if(1) {
        this.addingUser();
    }
    if (this.handleValidateUser(this.state.aadhar)) {
      this.addingUser();
    } else {
      let validate = (
        <div key={1}>
          <Alert color="warning" toggle={this.onDismiss} fade={false}>
            Account with this Aadhar No. already exists. Please Login.
          </Alert>
        </div>
      );
      this.setState({
        validate: validate,
      });
    }
  }
  async handleSubmitGovt(event) {
    event.preventDefault();
    if (this.props.accounts === "0xC0EC435ad729B545d645bA3A83C74872D585e282") {
    }
  }

  // calling contract to add a new Admin
  addingAdmin = async () => {
    console.log("Web3Data", this.state.web3Data)
    console.log("Time started AdminAdd", Date.now());
    console.log(this.state.fullname, this.state.aadhar, this.state.role);
    const res = await this.state.web3Data.contract.methods
      .addAdmin(this.state.fullname, this.state.aadhar, this.state.role)
      .send({ from: this.state.web3Data.accounts[0], gas: 1000000 });
    console.log("Time ended AdminAdd", Date.now(), res);
  };

  // calling contract to add a new Person
  addingUser = async () => {
    console.log("Time started User", Date.now());
    console.log(this.state.aadhar);
    const res = await this.state.web3Data.contract.methods
      .addUser(this.state.fullname, this.state.aadhar, this.state.pincode,this.state.userRole)
      .send({ from: this.state.web3Data.accounts[0], gas: 1000000 });
    console.log("Time ended User", Date.now(), res);
  };

  // set local storage to given aadhar no.
  handleLogIn = async (event) => {
    event.preventDefault();
    if (
      !this.handleValidateUser(this.state.aadhar) ||
      this.handleValidateAdmin(this.state.aadhar)
    ) {
      localStorage.setItem("myAadhar", this.state.aadhar);
      this.props.changeAadhar(localStorage.getItem("myAadhar"));
    } else {
      let validate = (
        <div key={1}>
          <Alert color="warning" toggle={this.onDismiss} fade={false}>
            Account with this Aadhar No. does not exist. Please Signup.
          </Alert>
        </div>
      );
      this.setState({
        validate: validate,
      });
    }
  };

  // remove local storage of given aadhar no. to 0
  handleLogOut = async (event) => {
    event.preventDefault();
    localStorage.setItem("myAadhar", 0);
    this.props.changeAadhar(localStorage.getItem("myAadhar"));
  };

  //   false - when current wallet address in admin
  handleValidateAdmin = (wallet) => {
    if (this.state.adminWallets.includes(wallet)) {
      return false;
    } else {
      return true;
    }
  };

  // false - user with aadhar exists
  // true - user with aadhar do not exists
  handleValidateUser = (aadhar) => {
    if (this.state.userAddrs.includes(aadhar.toString())) {
      return false;
    } else {
      return true;
    }
  };

  onDismiss = () => this.setState({ validate: <div></div> });

  // 1. bring admin count from contract
  // 2. store all admin addresses
  // adminWallets
  // --
  // 3. bring person count from contract
  // 4. bring person object from contract
  // 5. store all the persons aadhar numbers
  // userAddrs

  getWeb3Data = async() => {
    if (this.props && this.props.web3Data && this.props.web3Data.accounts) {
      console.log("acc", this.props.web3Data);
      return this.props.web3Data
    }
  }
  componentDidUpdate = async () => {
    if (!this.state.web3Data || !this.props.web3Data) {
        let web3Data = await this.getWeb3Data()
        this.setState({
                web3Data: web3Data,
            }) 
        console.log('>>>>>>', web3Data)     
        }
    }
  // async componentDidMount() {
  //   // console.log("Time started AdminFetch", Date.now());
  //   // var resAdminCount = await this.props.contract?.methods.adminCount().call();
  //   // var responseAdminsWallets = [];
  //   // for (var i = 1; i <= resAdminCount; i++) {
  //   //   var resAdmin = await this.props.contract?.methods.AdminIds(i).call();
  //   //   responseAdminsWallets.push(resAdmin);
  //   // }
  //   // console.log("Time ended AdminFetch", Date.now());
  //   // console.log("Time started PersonFetch", Date.now());
  //   // var resUserCount = await this.props.contract?.methods
  //   //   .userCount()
  //   //   .call();
  //   // var responseUsers = [];
  //   // for (var i = 1; i <= resUserCount; i++) {
  //   //   var resUser = await this.props.contract?.methods.User_Ids(i).call();
  //   //   responseUsers.push(resUser);
  //   // }
  //   // let personAddrs = responseUsers.map((ele) => {
  //   //   return ele.perAadharno;
  //   // });
  //   // console.log("Time ended PersonFetch", Date.now());
  //   // this.setState({
  //   //   adminWallets: responseAdminsWallets,
  //   //   userAddrs: personAddrs,
  //   // });
  //   // console.log(this.state.adminWallets, this.state.userAddrs);
  // }

  render() {
    return (
      <React.Fragment>
        <h1 className="head">SignUp Page</h1>
        <div className="row">{this.state.validate}</div>
        <div className="fullbox">
          <div className="box1">
            <h6 className="heading-style">Admin</h6>
            <div className="sub-box1">
              <i
                className="fa fa-user-circle-o fa-4x"
                aria-hidden="true"
                style={{ paddingBottom: "5%" }}
              ></i>
              <br />

              <div className="p-2">
                <label className="label1"> Name: </label>
                <br />
                <input
                  className="input1"
                  type="text"
                  name="fullname"
                  placeholder="Enter name"
                  onChange={this.handleInputChange}
                  required
                />
              </div>

              <div className="p-2">
                <label className="label1"> Aadhar Number: </label>
                <br />
                <input
                  className="input1"
                  type="number"
                  name="aadhar"
                  placeholder="Enter Aadhar Number"
                  onChange={this.handleInputChange}
                  required
                />
              </div>

              <div className="p-2">
                <label className="label1"> Role: </label>
                <br />
                <input
                  className="input1"
                  type="text"
                  name="role"
                  placeholder="Enter Role"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <button
                className="signup-btn btn btn-block btn-sm btn-primary text-uppercase pl-3 pr-3"
                type="submit"
                onClick={this.handleSubmitAdmin}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Sign Up
                </Link>
              </button>
              <Button
                className="allbtn btn1"
                type="submit"
                onClick={this.handleLogIn}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log In
                </Link>
              </Button>
              <Button
                className="allbtn"
                type="submit"
                onClick={this.handleLogOut}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log Out
                </Link>
              </Button>
            </div>
          </div>
          <div className="box2">
            <h6 className="heading-style">User</h6>
            <div className="sub-box2">
              <i
                className="fa fa-users fa-4x"
                aria-hidden="true"
                style={{ paddingBottom: "5%" }}
              ></i>
              <br />
              <div className="p-2">
                <label className="label1"> Name: </label>
                <br />
                <input
                  className="input1"
                  type="text"
                  name="fullname"
                  placeholder="Enter name"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="p-2">
                <label className="label1"> Aadhar Number: </label>
                <br />
                <input
                  className="input1"
                  type="number"
                  name="aadhar"
                  placeholder="Enter Aadhar Number"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="p-2">
                <label className="label1"> Pincode: </label>
                <br />
                <input
                  className="input1"
                  type="number"
                  name="pincode"
                  placeholder="Enter Pincode"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="p-2">
                <label className="label1"> Role: </label>
                <br />
                <input
                  className="input1"
                  type="text"
                  name="userRole"
                  placeholder="Enter Role"
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <button
                className="signup-btn btn btn-block btn-sm btn-primary text-uppercase pl-3 pr-3"
                type="submit"
                onClick={this.handleSubmitUser}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Sign Up
                </Link>
              </button>
              <Button
                className="allbtn btn1"
                type="submit"
                onClick={this.handleLogIn}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log In
                </Link>
              </Button>
              <Button
                className="allbtn"
                type="submit"
                onClick={this.handleLogOut}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Log Out
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignUp;
