import React, { Component, useEffect, useState } from "react";
import { Card, CardTitle, CardBody, CardText } from "reactstrap";
import { useEth } from "../contexts/EthContext";

function AllUserRender({ user }) {
  var style1 = "bg-success text-white";
  return (
    <Card className={style1}>
      <br />
      <i className="fa fa-user fa-2x"></i>
      <CardBody>
        <CardTitle>User Name: {user?.userName}</CardTitle>
        <CardText>Addr: {user?.addr}</CardText>
        <CardText>Pincode: {user?.pincode}</CardText>
        <CardText>Role: {user?.role}</CardText>
      </CardBody>
    </Card>
  );
}

function AllMemComponent() {
    const { state: { contract, accounts } } = useEth();
    const [users, setUsers] = useState(null);
    useEffect(() => {
        console.log("Time start person get", Date.now());
        async function fetchMyAPI() 
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
        fetchMyAPI();
        console.log("Time end person get", users);

    },[contract, accounts]);

    return (
      <div>
        <br />
        <h2>All Members</h2>
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
