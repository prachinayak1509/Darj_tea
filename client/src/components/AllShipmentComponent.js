import React, { Component, useEffect, useState } from "react";
import { Card, CardTitle, CardBody, CardText } from "reactstrap";
import { useEth } from "../contexts/EthContext";
import "./AllMemComponent.css";

function AllItemRender({ shipment }) {
  var style1 = "bg-primary text-white";
  return (
    <Card className="card2">
      <br />
      <i className="fa fa-user fa-2x"></i>
      <CardBody>
        <CardTitle><b>Shipment Status:</b> {shipment?.shipmentStatus}</CardTitle>
        <CardText><b>Shipment TotalAmt:</b> {shipment?.totalAmt}</CardText>
        <CardText><b>Shipment Payment:</b> {shipment?.payment}</CardText>
        <CardText><b>MADDR:</b> {shipment?.maddress}</CardText>
        <CardText><b>CADDR:</b>{shipment?.caddress}</CardText>
      </CardBody>
    </Card>
  );
}

function AllShipmentComponent() {
    const { state: { contract, accounts } } = useEth();
    const [shipments, setShipments] = useState(null);
    useEffect(() => {
        console.log("Time start person get", Date.now());
        async function fetchMyAPI() 
          { var resShipmentCount = await contract?.methods
                .shipmentCount().call();
            var responseShipments = [];
            for (var i = 1; i <= resShipmentCount; i++) {
            var resShipments = await contract?.methods.Shipments(i).call();
            var resShipmentStatus = await contract?.methods.getShipmentStatus(i).call();
            resShipments.shipmentStatus = resShipmentStatus;
            responseShipments.push(resShipments);
            }
            console.log("Time end item", resShipmentCount, responseShipments);
            const AllShipments = responseShipments && responseShipments.map((x) => {
              return (
                <div key={x.shipmentId} className="card1">
                  <AllItemRender shipment={x} />
                </div>
              );
            });   
            setShipments(AllShipments); 
          }
        fetchMyAPI();
        console.log("Time end person get", shipments);

    },[contract, accounts]);

    return (
      <div>
        <br />
        <h2>All Shipments</h2>
        <br />
        <div className="row2">{shipments}</div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
}
export default AllShipmentComponent;
