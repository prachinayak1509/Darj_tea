import React, { useEffect, useState } from "react";
import { Card, CardTitle, CardBody, CardText } from "reactstrap";
import { useEth } from "../contexts/EthContext";
import "./AllMemComponent.css";

function AllUserRender({ user }) {
  var style1 = "bg-success text-white";
  return (
    <Card className="card3">
      <br />
      <i className="fa fa-user fa-2x"></i>
      <CardBody>
        <CardTitle><b>User Name:</b> {user?.userName}</CardTitle>
        <CardText>Addr: {user?.addr}</CardText>
        <CardText>Pincode: {user?.pincode}</CardText>
        <CardText>Role: {user?.role}</CardText>
      </CardBody>
    </Card>
  );
}
function AllAdminRender({ admin }) {
  var style1 = "bg-primary text-white";
  return (
    <Card className="card2">
      <br />
      <i className="fa fa-user fa-2x"></i>
      <CardBody>
        <CardTitle>Admin Name: {admin?.adminName}</CardTitle>
        <CardText>Admin Addr: {admin?.adminAddr}</CardText>
        <CardText>Admin Aadhar: {admin?.adminAadharNo}</CardText>
        <CardText>Admin Role: {admin?.role}</CardText>
      </CardBody>
    </Card>
  );
}

function AllMemComponent() {
    const { state: { contract, accounts } } = useEth();
    const [users, setUsers] = useState(null);
    const [admins, setAdmins] = useState(null);
    useEffect(() => {
        console.log("Time start person get", Date.now());
        async function fetchUsers() 
          { var resUserCount = await contract?.methods
                .userCount().call();
            var responseUsers = [];
            for (var i = 1; i <= resUserCount; i++) {
            var resUsers = await contract?.methods.User_Ids(i).call();
            responseUsers.push(resUsers);
            }
            console.log("Time end ", resUserCount, responseUsers);
            const AllUsers = responseUsers && responseUsers.map((x) => {
              return (
                <div key={x.personId} className="card1">
                  <AllUserRender user={x} />
                </div>
              );
            });   
            setUsers(AllUsers); 
          }
        async function fetchAdmins() 
          { var resAdminCount = await contract?.methods.adminCount().call();
            var responseAdminsAddrs = [];
            for (var i = 1; i <= resAdminCount; i++) {
              var resAdmin = await contract?.methods.AdminIds(i).call();
              responseAdminsAddrs.push(resAdmin);
            }
            let allAdmins = [];
            for (var j = 0; j < responseAdminsAddrs.length; j++) {
              var admin = await contract.methods
                .Admins(responseAdminsAddrs[j])
                .call();
              allAdmins.push(admin);
            }
            console.log(">>>>Admin ", resAdminCount, allAdmins);
            const AllAdmins = responseAdminsAddrs && allAdmins.map((x) => {
              return (
                <div key={x.adminId} className="card1">
                  <AllAdminRender admin={x} />
                </div>
              );
            });   
            setAdmins(AllAdmins); 
          }
        fetchUsers();
        fetchAdmins();
        console.log("Time end person get", users);

    },[contract, accounts]);

    return (
      <div>
      <br />
      <h2>All Members</h2>
      <br />
      <h4>Admins</h4>
      <br />
      <div className="row1">{admins}</div>
      <br />
      <h4 style={{ clear: "both" }}>Users</h4>
      <br />
      <div className="row2">{users}</div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
    );
}
export default AllMemComponent;
