import React, { useEffect, useState } from "react";
import { Card, CardTitle, CardBody, CardText } from "reactstrap";
import { useEth } from "../contexts/EthContext";
import "./AllMemComponent.css";


function AllItemRender({ item }) {
  var style1 = "bg-primary text-white";
  return (
    <Card className="card2">
      <br />
      <i className="fa fa-user fa-2x"></i>
      <CardBody>
        <CardTitle><b>Item Name:</b> {item?.description}</CardTitle>
        <CardText><b>Item Description:</b> {item?.description}</CardText>
        <CardText><b>Item price:</b> {item?.price}</CardText>
        <CardText><b>MADDR:</b> {item?.maddress}</CardText>
        <CardText><b>CADDR:</b> {item?.caddress}</CardText>
      </CardBody>
    </Card>
  );
}

function AllItemComponent() {
    const { state: { contract, accounts } } = useEth();
    const [items, setItems] = useState(null);
    useEffect(() => {
        console.log("Time start person get", Date.now());
        async function fetchMyAPI() 
          { var resItemCount = await contract?.methods
                .itemCount().call();
            var responseItems = [];
            for (var i = 1; i <= resItemCount; i++) {
            var resItems = await contract?.methods.Items(i).call();
            responseItems.push(resItems);
            }
            console.log("Time end item", resItemCount, responseItems);
            const AllItems = responseItems && responseItems.map((x) => {
              return (
                <div key={x.itemId} className="card1">
                  <AllItemRender item={x} />
                </div>
              );
            });   
            setItems(AllItems); 
          }
        fetchMyAPI();
        console.log("Time end person get", items);

    },[contract, accounts]);

    return (
      <div>
        <br />
        <h2 className="title1">All Items</h2>
        <br />
        <div className="row2">{items}</div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
}
export default AllItemComponent;
