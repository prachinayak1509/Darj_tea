import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import Web3 from "web3";
import '../styles.css'
import './HeaderComponent.css'

class Header extends Component{
    constructor(props){
        super(props);
        this.state = { 
            isNavOpen : false,
            account: null,
            balance: null,
            web3Data: null,
        }
        this.toggleNav = this.toggleNav.bind(this);
        this.getBalance = this.getBalance.bind(this);
        this.getAccount = this.getAccount.bind(this);
    }

    toggleNav(){
        this.setState({isNavOpen : !this.state.isNavOpen});
    }

    getBalance = async(account) => {
        if (this.props.web3Data.web3){
            let bal = await this.props.web3Data.web3.eth.getBalance(account[0])
            let ethBal = Web3.utils.fromWei(bal, 'ether');
            console.log("bal", (ethBal*10000).toFixed(0));
            return (ethBal*10000).toFixed(0);
        }
    }
    getAccount = async() => {
        if (this.props && this.props.web3Data && this.props.web3Data.accounts) {
            let account = await this.props?.web3Data?.accounts;
            console.log("acc", account[0]);
            return account;
        }
    }
    componentDidUpdate = async () => {
        if (!this.state.web3Data || !this.props.web3Data) {
            let acc = await this.getAccount()
            let newBal = await this.getBalance(acc);
            console.log('Comp didmount', acc, newBal);
            this.setState({
                    balance: newBal,
                    account: acc,
                    web3Data: this.props.web3Data,

                })      
            }
        }
    
    render() {
        const { loading} = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }
        return(
            <React.Fragment>
                <Navbar dark expand="md header">
                    <div className="container justify-center">
                        <NavbarToggler onClick={this.toggleNav}/>
                        <NavbarBrand className="mr-auto title" >Coco Fresh Taste
                        </NavbarBrand>
                        <Collapse isOpen = {this.state.isNavOpen} navbar>
                            <Nav navbar className="m-auto"> 
                                <NavItem>
                                    <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/allitem">Items</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/allship">Shipments</NavLink>
                                </NavItem> 
                                <NavItem>
                                    <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/allmem">Members</NavLink>
                                </NavItem> 
                                <NavItem>
                                    <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/signup">Signup</NavLink>
                                </NavItem> 
                            </Nav>    
                        </Collapse>
                    </div>
                    <h6 style={{ color: "white"}}><small>{this.state.account}</small>
                    <br/><small>Balance : {this.state.balance}</small></h6>
                </Navbar>
            </React.Fragment>
        )
    }
}

export default Header;