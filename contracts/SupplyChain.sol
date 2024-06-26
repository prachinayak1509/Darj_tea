// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract SupplyChain {

    enum Status {Notpaid, inSc, received}
    uint public userCount = 0;
    uint public itemCount = 0;
    uint public shipmentCount = 0;
    uint256 public adminCount = 0;
    
    event processChange(uint indexed shipId,string shState,uint times);
    event processPay(uint indexed shipId,Status indexed pay,uint times);

    struct Admin {
        uint256 adminId;
        string adminName;
        uint256 adminAadharNo;
        address adminAddr;
        string role;
    }

    mapping(address => Admin) public Admins;
    mapping(uint256 => address) public AdminIds;
    mapping(uint256 => Admin) public AdminAadhars;

    struct User {
        uint userId;
        string userName;
        uint aadharNo;
        address payable addr;
        uint pincode;
        string role; 
    }

    mapping(address  => User) public Users;
    mapping(uint => User) public User_Ids;
    mapping(uint => User) public User_Aadhars;   

    struct Item {
        uint itemId;
        uint shipmentId;
        address maddress;
        address caddress;
        string description;
        uint price;
    }

    mapping(uint => Item) public Items;

    struct Shipment{
        uint shipmentId;
        string[] shipmentStatus;
        uint totalAmt;
        Status payment;
        address caddress;
        address maddress;
    }

    mapping(uint => Shipment) public Shipments;

    function addAdmin(string memory _name, uint256 _adminAadharno, string memory _role)
        public
        returns (uint256)
    {
        uint256 x = Admins[msg.sender].adminId;
        if (x == 0) {
            adminCount++;
            Admin memory aux;
            aux.adminId = adminCount;
            aux.adminName = _name;
            aux.adminAadharNo = _adminAadharno;
            aux.adminAddr = msg.sender;
            aux.role = _role;
            Admins[msg.sender] = aux;
            AdminIds[adminCount] = msg.sender;
            AdminAadhars[_adminAadharno] = aux;
        } else {
            Admin memory aux = Admins[msg.sender];
            aux.adminAadharNo = _adminAadharno;
            aux.role = _role;
            Admins[msg.sender] = aux;
        }
        return adminCount;
    }

    function addUser(string memory _name, uint _aadharNo, uint _pincode, string memory _role) public returns(uint){
        address x = Users[msg.sender].addr;
        if (x == address(0x0)) {
            User memory aux;
            userCount++;
            aux.userId = userCount;
            aux.userName = _name;
            aux.addr = payable(msg.sender);
            aux.pincode = _pincode;
            aux.role = _role;
            aux.aadharNo = _aadharNo;
            Users[msg.sender] = aux;
            User_Ids[userCount] = aux;
            User_Aadhars[_aadharNo] = aux;
            return userCount;
        } else {
            User memory aux = Users[msg.sender];
            aux.userName = _name;
            aux.pincode = _pincode;
            aux.role = _role;
            Users[msg.sender] = aux;
            User_Ids[userCount] = aux;
            User_Aadhars[_aadharNo] = aux;
            return userCount;
        }
    }

    function createItems(string memory _description,uint _price) public returns(uint) {
        itemCount++;
        Item memory aux;
        aux.itemId = itemCount;
        aux.description = _description;
        aux.price = _price;
        aux.maddress = msg.sender;
        Items[itemCount] = aux;
        return itemCount;
    }

    function updateItem(uint _itemId, uint _shipId, address _caddress) public {
        Item memory aux = Items[_itemId];
        aux.shipmentId = _shipId;
        aux.caddress = _caddress;
        Items[_itemId] = aux;
    }

    function createShipment(uint _itemId,string memory _shipstatus,uint _totalAmt,Status _payment)public{
        shipmentCount++;
        Shipment memory aux;
        aux.maddress = Items[_itemId].maddress;
        aux.shipmentId = shipmentCount;
        aux.payment =  _payment;
        aux.totalAmt =  _totalAmt;
        aux.caddress = msg.sender;
        Shipments[shipmentCount] = aux;
        Shipments[shipmentCount].shipmentStatus.push(_shipstatus);
        updateItem(_itemId, shipmentCount, msg.sender);
        emit processChange(shipmentCount,_shipstatus,block.timestamp);
        emit processPay(shipmentCount,_payment,block.timestamp);
    }

    function updateShstate(uint _shipId,string memory _shipStatus)public{
       
       if(compareStrings(_shipStatus,"Cancelled")){
           Shipments[_shipId].shipmentStatus.push(_shipStatus);
           emit processChange(_shipId,_shipStatus,block.timestamp);
       }
       uint len = Shipments[_shipId].shipmentStatus.length;
       if(!(compareStrings(Shipments[_shipId].shipmentStatus[(len-1)], "Cancelled"))){
        Shipments[_shipId].shipmentStatus.push(_shipStatus);
        emit processChange(_shipId,_shipStatus,block.timestamp);
       }
    }
    
    function updateShstatus(uint _shipId,Status _payment)public{
        Shipments[shipmentCount].payment=  _payment;
        emit processPay(_shipId,_payment,block.timestamp);
    }

    function payitem(uint _totAmt,uint _shipmentId,string memory _shipStatus)public payable {
        require(msg.value >= _totAmt,"less money");
        Shipments[_shipmentId].payment = Status.inSc;
        emit processPay(_shipmentId,Status.inSc,block.timestamp);
        Shipments[_shipmentId].shipmentStatus.push(_shipStatus);
        emit processChange(_shipmentId,_shipStatus,block.timestamp);
    }

    function withdrawMoney(uint _shipmentId,uint z)public payable{
        Shipment memory _shipment = Shipments[_shipmentId];
        // Item memory x = Items[y.itemcat];
        string memory _shipStatus;
        if(z == 2){
            address payable customer = payable(_shipment.caddress);
            customer.transfer(_shipment.totalAmt);
            _shipStatus = "Cancelled"; 
        }
        else if(z == 1){
        address payable manufacturer = payable(_shipment.maddress);
        manufacturer.transfer(_shipment.totalAmt);
        _shipStatus = "Delivered";
        }    
        Shipments[_shipmentId].shipmentStatus.push(_shipStatus);
        emit processChange(_shipmentId,_shipStatus,block.timestamp);
        Shipments[_shipmentId].payment = Status.received;
        emit processPay(_shipmentId,Status.received,block.timestamp);
            
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    
    function getbal(address addr)public view returns(uint){
        return (addr).balance;
    }
    function getShipmentStatus(uint _shipid)public view returns (string[] memory){
        return Shipments[_shipid].shipmentStatus;
    }
    function getPaymentStatus(uint _shipid)public view returns (Status){
        return Shipments[_shipid].payment;
    }
}
