import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import swal from "sweetalert";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { contract_address, contract_abi, speedy_nodes } from "./config.js"
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
function App() {
  // const [unstaked_Ifmale, setunstaked_Ifmale] = useState([1, 2]);
  // const [show, setShow] = React.useState(false);
  // const [showClassText, setShowClassText] = React.useState("");
  // const asdasd = [1, 3];
  // function toggle_Show() {
  //   if (showClassText == "") {
  //     console.log("show");
  //     setShowClassText("show");
  //     //document.body.append('<div class="modal-backdrop fade show"></div>');
  //   } else {
  //     setShowClassText("");
  //     // document.body.append('<div class="modal-backdrop fade" onClick:{toggle_Show}></div>');
  //   }
  // }

  useEffect(() => {
    //fetch_data();
    //connect_wallet();
}, []);
const [connected, setConnected] = useState(false);
const [wladdress, setwladdress] = useState();
const [balance, setbalance] = useState(0);
const [pending, setpending] = useState(0);
const [totalrewards, settotalrewards] = useState(0);
const [mintNumber, setMintNumber] = useState(1);
const [totalsupply, settotalsupply] = useState(0);
const [price, set_price] = useState(0);
// const [total, set_total] = useState(0.2);
// set_total(mintNumber * price);
let total = mintNumber * price;

const mintButtonClickHandler = () => {
    // sale_controller();
    
};

const [walletstatus, set_walletstatus] = useState("Connect Wallet");

async function connect_wallet() {
    if (Web3.givenProvider) {
        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: "https://mainnet.infura.io/v3/3ca1583421a74069b07075f209879afb" // required
            }
          },
          coinbasewallet: {
            package: CoinbaseWalletSDK, // Required
            options: {
              appName: "FlyGuyz", // Required
              infuraId: "https://mainnet.infura.io/v3/3ca1583421a74069b07075f209879afb", // Required
              rpc: "", // Optional if `infuraId` is provided; otherwise it's required
              chainId: 1, // Optional. It defaults to 1 if not provided
              darkMode: false // Optional. Use dark theme, defaults to false
            }
          }
        };

        const web3Modal = new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: true, // optional
            providerOptions, // required
        });

        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        const addresses = await web3.eth.getAccounts();
        const address = addresses[0];

        web3.eth.net.getId().then((result) => {
            console.log("Network id: " + result);
            if (result !== 1) {
                swal("Wrong Network Selected. Select Ethereum Mainnet");
            }
        });
        set_walletstatus("Wallet Connected");
        setwladdress(address);
        console.log("Default address: "+ address)
        setConnected(true);
        fetch_data();
    } else {
        swal("Web3 Not Found");
    }
}

async function show_error_alert(error) {
    let temp_error = error.message.toString();
    console.log(temp_error);
    let error_list = [
        "HODLeR Shoes :: Not Yet Active.",
    ];

    for (let i = 0; i < error_list.length; i++) {
        if (temp_error.includes(error_list[i])) {
            // set ("Transcation Failed")
            // alert(error_list[i]);
            swal("Alert!", error_list[i], "warning");
        }
    }
}

async function fetch_data() {
  if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const contract = new web3.eth.Contract(contract_abi, contract_address);

      const addresses = await web3.eth.getAccounts();
      const address = addresses[0];
      console.log("addresses[0]: " + addresses[0]);
      // console.log("addresses[1]: "+addresses[1])
      // console.log("Default address: "+await web3.eth.defaultAccount)
      contract.methods.balanceOf(address).call((err, result) => {
        console.log("error: " + err);
        console.log(result);
        setbalance(result);
    });

    contract.methods.getVestingSchedulesCountByBeneficiary(address).call((err, result) => {
      console.log("error: " + err);
      console.log(result);
      setpending(result);
  });

  contract.methods.getVestingSchedulesTotalAmount().call((err, result) => {
    console.log("error: " + err);
    console.log(result);
    settotalrewards(result);
});
      // await contract.methods.tokenByIndex(i).call();
  }
}

async function claim_manually() {
    if (Web3.givenProvider) {
        const web3 = new Web3(Web3.givenProvider);
        await Web3.givenProvider.enable();
        const contract = new web3.eth.Contract(contract_abi, contract_address);
        const addresses = await web3.eth.getAccounts();
        const address = addresses[0];
        console.log("addresses[0]: " + addresses[0]);
        // console.log("addresses[1]: "+addresses[1])
        // console.log("Default address: "+await web3.eth.defaultAccount)
        try {
            const estemated_Gas = await contract.methods.claimFromAllVestings().send({
              from: address,
              maxPriorityFeePerGas: null,
              maxFeePerGas: null,
          });
            console.log(estemated_Gas);
            const result = await contract.methods.claimFromAllVestings().send({
                from: address,
                gas: estemated_Gas,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
            });
        } catch (error) {
            show_error_alert(error);
        }
    }
}
  return (
    <div>
      {/* Navbar Start */}
  <div className="main-root position-relative">
  <div id="particles-js"></div>
  <div className="main-body">
    {/* NavBar Start */}
    <nav className="navbar navbar-custom size-wrap position-fixed w-100">
      <div className="container w-100">
        <div className="row w-100 m-0 align-items-center">
          <div className="col-auto px-0 px-md-2">
            <a href="index.html" className="navbar-brand">
              <img src="img/logo.png" alt="FlyGuyz" className="img-fluid" />
            </a>
          </div>
          <div className="col-auto d-block d-md-none ms-auto">
            <ul className="navbar-nav flex-row ms-auto align-items-center">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://mobile.twitter.com/flyguyzofficial"
                  target="_blank"
                >
                  <img
                    alt="twitter"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjQuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIKCSBpZD0ic3ZnMiIgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC40IHI5OTM5IiBzb2RpcG9kaTpkb2NuYW1lPSJUd2l0dGVyX2JpcmRfbG9nb18yMDEyLnN2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxNzEuNSAxMzkuNCIKCSBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNzEuNSAxMzkuNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8c29kaXBvZGk6bmFtZWR2aWV3ICBib3JkZXJjb2xvcj0iIzY2NjY2NiIgYm9yZGVyb3BhY2l0eT0iMS4wIiBmaXQtbWFyZ2luLWJvdHRvbT0iMCIgZml0LW1hcmdpbi1sZWZ0PSIwIiBmaXQtbWFyZ2luLXJpZ2h0PSIwIiBmaXQtbWFyZ2luLXRvcD0iMCIgaWQ9ImJhc2UiIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgaW5rc2NhcGU6Y3g9IjEwMS4yOTQxMyIgaW5rc2NhcGU6Y3k9IjUwLjE4MTE0MiIgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9InB4IiBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIiBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIiBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI5NjIiIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTI4MCIgaW5rc2NhcGU6d2luZG93LXg9Ii04IiBpbmtzY2FwZTp3aW5kb3cteT0iLTgiIGlua3NjYXBlOnpvb209IjMuNzIwMDU3MSIgcGFnZWNvbG9yPSIjZmZmZmZmIiBzaG93Z3JpZD0iZmFsc2UiPgoJPC9zb2RpcG9kaTpuYW1lZHZpZXc+CjxnIGlkPSJsYXllcjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yODIuMzIwNTMsLTM5Ni4zMDczNCkiIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIj4KCTxwYXRoIGlkPSJwYXRoNSIgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgY2xhc3M9InN0MCIgZD0iTTQ1My44LDQxMi44Yy02LjMsMi44LTEzLjEsNC43LTIwLjIsNS41CgkJYzcuMy00LjQsMTIuOC0xMS4yLDE1LjUtMTkuNWMtNi44LDQtMTQuMyw3LTIyLjMsOC41Yy02LjQtNi44LTE1LjYtMTEuMS0yNS43LTExLjFjLTE5LjQsMC0zNS4yLDE1LjgtMzUuMiwzNS4yCgkJYzAsMi44LDAuMyw1LjQsMC45LDhjLTI5LjItMS41LTU1LjItMTUuNS03Mi41LTM2LjhjLTMsNS4yLTQuOCwxMS4yLTQuOCwxNy43YzAsMTIuMiw2LjIsMjMsMTUuNywyOS4zYy01LjgtMC4yLTExLjItMS44LTE1LjktNC40CgkJYzAsMC4xLDAsMC4zLDAsMC40YzAsMTcsMTIuMSwzMS4zLDI4LjIsMzQuNWMtMywwLjgtNi4xLDEuMi05LjMsMS4yYy0yLjMsMC00LjUtMC4yLTYuNi0wLjZjNC41LDE0LDE3LjUsMjQuMiwzMi45LDI0LjQKCQljLTEyLDkuNC0yNy4yLDE1LjEtNDMuNywxNS4xYy0yLjgsMC01LjYtMC4yLTguNC0wLjVjMTUuNiwxMCwzNC4xLDE1LjgsNTMuOSwxNS44YzY0LjcsMCwxMDAuMS01My42LDEwMC4xLTEwMC4xCgkJYzAtMS41LDAtMy0wLjEtNC42QzQ0My4xLDQyNi4xLDQ0OS4xLDQxOS45LDQ1My44LDQxMi44TDQ1My44LDQxMi44eiIvPgo8L2c+Cjwvc3ZnPgo="
                    width={25}
                    height={25}
                  />
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://t.me/flyguyz_official"
                  target="_blank"
                >
                  <img
                    src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' fill='%23fff' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 300 300' style='enable-background:new 0 0 300 300;' xml:space='preserve'%3E%3Cg id='XMLID_496_'%3E%3Cpath id='XMLID_497_' d='M5.299,144.645l69.126,25.8l26.756,86.047c1.712,5.511,8.451,7.548,12.924,3.891l38.532-31.412 c4.039-3.291,9.792-3.455,14.013-0.391l69.498,50.457c4.785,3.478,11.564,0.856,12.764-4.926L299.823,29.22 c1.31-6.316-4.896-11.585-10.91-9.259L5.218,129.402C-1.783,132.102-1.722,142.014,5.299,144.645z M96.869,156.711l135.098-83.207 c2.428-1.491,4.926,1.792,2.841,3.726L123.313,180.87c-3.919,3.648-6.447,8.53-7.163,13.829l-3.798,28.146 c-0.503,3.758-5.782,4.131-6.819,0.494l-14.607-51.325C89.253,166.16,91.691,159.907,96.869,156.711z'/%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A"
                    alt="Instagram"
                    width={25}
                    height={25}
                  />
                </a>
              </li>
            </ul>
          </div>
          <input
            className="form-check-input d-none"
            type="checkbox"
            id="flexCheckDefault"
          />
          <label
            className="form-check-label d-flex d-md-none"
            htmlFor="flexCheckDefault"
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </label>
          <div className="col-auto navbar-main ms-auto px-0 px-md-2">
            <ul className="navbar-nav flex-column flex-md-row ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="https://flyguyz.io/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://dashboard.flyguyz.io/">
                  Token Sale
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Claim
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="litepaper.html">
                  Litepaper
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://whitepaper.flyguyz.io/">
                  Whitepaper
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="index.html#roadmap">
                  Roadmap
                </a>
              </li>
              
              <li className="nav-item desktop-icons">
                <a
                  className="nav-link"
                  href="https://mobile.twitter.com/flyguyzofficial"
                  target="_blank"
                >
                  <img
                    alt="twitter"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjQuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIKCSBpZD0ic3ZnMiIgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC40IHI5OTM5IiBzb2RpcG9kaTpkb2NuYW1lPSJUd2l0dGVyX2JpcmRfbG9nb18yMDEyLnN2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxNzEuNSAxMzkuNCIKCSBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNzEuNSAxMzkuNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8c29kaXBvZGk6bmFtZWR2aWV3ICBib3JkZXJjb2xvcj0iIzY2NjY2NiIgYm9yZGVyb3BhY2l0eT0iMS4wIiBmaXQtbWFyZ2luLWJvdHRvbT0iMCIgZml0LW1hcmdpbi1sZWZ0PSIwIiBmaXQtbWFyZ2luLXJpZ2h0PSIwIiBmaXQtbWFyZ2luLXRvcD0iMCIgaWQ9ImJhc2UiIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgaW5rc2NhcGU6Y3g9IjEwMS4yOTQxMyIgaW5rc2NhcGU6Y3k9IjUwLjE4MTE0MiIgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9InB4IiBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIiBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIiBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI5NjIiIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTI4MCIgaW5rc2NhcGU6d2luZG93LXg9Ii04IiBpbmtzY2FwZTp3aW5kb3cteT0iLTgiIGlua3NjYXBlOnpvb209IjMuNzIwMDU3MSIgcGFnZWNvbG9yPSIjZmZmZmZmIiBzaG93Z3JpZD0iZmFsc2UiPgoJPC9zb2RpcG9kaTpuYW1lZHZpZXc+CjxnIGlkPSJsYXllcjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yODIuMzIwNTMsLTM5Ni4zMDczNCkiIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIj4KCTxwYXRoIGlkPSJwYXRoNSIgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgY2xhc3M9InN0MCIgZD0iTTQ1My44LDQxMi44Yy02LjMsMi44LTEzLjEsNC43LTIwLjIsNS41CgkJYzcuMy00LjQsMTIuOC0xMS4yLDE1LjUtMTkuNWMtNi44LDQtMTQuMyw3LTIyLjMsOC41Yy02LjQtNi44LTE1LjYtMTEuMS0yNS43LTExLjFjLTE5LjQsMC0zNS4yLDE1LjgtMzUuMiwzNS4yCgkJYzAsMi44LDAuMyw1LjQsMC45LDhjLTI5LjItMS41LTU1LjItMTUuNS03Mi41LTM2LjhjLTMsNS4yLTQuOCwxMS4yLTQuOCwxNy43YzAsMTIuMiw2LjIsMjMsMTUuNywyOS4zYy01LjgtMC4yLTExLjItMS44LTE1LjktNC40CgkJYzAsMC4xLDAsMC4zLDAsMC40YzAsMTcsMTIuMSwzMS4zLDI4LjIsMzQuNWMtMywwLjgtNi4xLDEuMi05LjMsMS4yYy0yLjMsMC00LjUtMC4yLTYuNi0wLjZjNC41LDE0LDE3LjUsMjQuMiwzMi45LDI0LjQKCQljLTEyLDkuNC0yNy4yLDE1LjEtNDMuNywxNS4xYy0yLjgsMC01LjYtMC4yLTguNC0wLjVjMTUuNiwxMCwzNC4xLDE1LjgsNTMuOSwxNS44YzY0LjcsMCwxMDAuMS01My42LDEwMC4xLTEwMC4xCgkJYzAtMS41LDAtMy0wLjEtNC42QzQ0My4xLDQyNi4xLDQ0OS4xLDQxOS45LDQ1My44LDQxMi44TDQ1My44LDQxMi44eiIvPgo8L2c+Cjwvc3ZnPgo="
                    width={25}
                    height={25}
                  />
                </a>
              </li>
              <li className="nav-item desktop-icons">
                <a
                  className="nav-link"
                  href="https://t.me/flyguyz_official"
                  target="_blank"
                >
                  <img
                    src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' fill='%23fff' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 300 300' style='enable-background:new 0 0 300 300;' xml:space='preserve'%3E%3Cg id='XMLID_496_'%3E%3Cpath id='XMLID_497_' d='M5.299,144.645l69.126,25.8l26.756,86.047c1.712,5.511,8.451,7.548,12.924,3.891l38.532-31.412 c4.039-3.291,9.792-3.455,14.013-0.391l69.498,50.457c4.785,3.478,11.564,0.856,12.764-4.926L299.823,29.22 c1.31-6.316-4.896-11.585-10.91-9.259L5.218,129.402C-1.783,132.102-1.722,142.014,5.299,144.645z M96.869,156.711l135.098-83.207 c2.428-1.491,4.926,1.792,2.841,3.726L123.313,180.87c-3.919,3.648-6.447,8.53-7.163,13.829l-3.798,28.146 c-0.503,3.758-5.782,4.131-6.819,0.494l-14.607-51.325C89.253,166.16,91.691,159.907,96.869,156.711z'/%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A"
                    alt="Instagram"
                    width={25}
                    height={25}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    {/* NavBar End */}
    {/* Dashboard Start */}
    <section id="dashboard">
      <div className="dashboard py-md-5">
        <div className="container-xl py-5">
          <div className="row">
            <div className="col-12">
              <div className="size-wrap">
                <div className="main-heading">
                  <h1 className="fs-50 text-uppercase text-rose text-center mb-2 mb-md-4 fw-bold">
                    Dash<span className="text-shadow">board</span>{" "}
                  </h1>
                  <p className="fs-15 text-light fw-normal text-center mb-4">
                    Enter your wallet address to view your current, total and
                    any pending rewards that are in process of being sent.
                    Connect your wallet to start a manual claim of any pending
                    rewards (transaction fee applies).
                  </p>
                </div>
                <div className="form-wrap morph-bg py-4 mb-4">
                  <form id="wallet">
                    <div className="mb-3">
                      <label htmlFor="walletAddress" className="form-label">
                        Enter your wallet address
                      </label>
                      <input
                        type="text"
                        name="Wallet Address"
                        className="form-control"
                        id="walletAddress"
                        required=""
                        placeholder="Wallet Address"
                        value={wladdress}
                      />
                    </div>
                  </form>
                </div>
                <div className="morph-bg mb-4">
                  <div className="your-wallet text-center my-2 my-md-4">
                    <h3 className="fs-25 text-uppercase text-rose text-center mb-2 mb-md-4 fw-bold">
                      Total <span className="text-shadow">Earnings</span>
                    </h3>
                    
                    <div className="info-group">
                      <div className="group d-flex flex-row align-items-center justify-content-between mb-2 mb-md-4">
                        <p className="fs-20 text-light fw-bold text-center mb-0">
                          {balance}
                        </p>
                        <img
                          src="img/icons/token.png"
                          alt="busd"
                          width={35}
                          height={35}
                          className="img-fluid"
                        />
                      </div>
                      <p className="fs-22 text-info fw-bold text-center mb-0">
                        ($0)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="morph-bg mb-4">
                  <div className="pending-rewards text-center my-2 my-md-4">
                    <h3 className="fs-25 text-uppercase text-rose text-center mb-2 mb-md-4 fw-bold">
                      YOUR PENDING <span className="text-shadow">REWARDS</span>
                    </h3>
                    <div className="info-group">
                      <div className="group d-flex flex-row align-items-center justify-content-between mb-2 mb-md-4">
                        <p className="fs-20 text-light fw-bold text-center mb-0">
                          {pending}
                        </p>
                        <img
                          src="img/icons/token.png"
                          alt="busd"
                          width={35}
                          height={35}
                          className="img-fluid"
                        />
                      </div>
                      <p className="fs-22 text-info fw-bold text-center mb-0">
                        ($0)
                      </p>
                    </div>
                  </div>
                  <div className="total-rewards mb-4">
                    <h3 className="fs-25 text-uppercase text-rose text-center mb-2 mb-md-4 fw-bold">
                      TOTAL REWARDS DISTRIBUTED{" "}
                      <span className="text-shadow">TO HOLDERS</span>
                    </h3>
                    <div className="info-group">
                      <div className="group d-flex flex-row align-items-center justify-content-between mb-2 mb-md-4">
                        <p className="fs-20 text-light fw-bold text-center mb-0">
                          {totalrewards} <br />
                          ($0)
                        </p>
                        <img
                          src="img/icons/token.png"
                          alt="busd"
                          width={35}
                          height={35}
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="connect-wallet text-center d-flex align-items-center justify-content-center">
                {connected ? (
                  <a href="#" className="btn btn-blue fs-18 rounded-pill">
                    {" "}
                    Connected{" "}
                  </a>
                  ) : (
                  <a onClick={connect_wallet} href="#" className="btn btn-blue fs-18 rounded-pill">
                    {" "}
                    Connect Wallet{" "}
                  </a>
                  )}
                  <img
                    className="mx-3"
                    width={25}
                    height={25}
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTUwMi42MjggMjc4LjYyNy0xMTMuMzc4IDExMy4zNzhjLTYuMjQ5IDYuMjQ5LTE0LjQzOCA5LjM3My0yMi42MjggOS4zNzNzLTE2LjM3OS0zLjEyNC0yMi42MjgtOS4zNzNjLTEyLjQ5Ni0xMi40OTctMTIuNDk2LTMyLjc1OCAwLTQ1LjI1NWw1OC43NTEtNTguNzVoLTM3MC43NDVjLTE3LjY3MyAwLTMyLTE0LjMyNy0zMi0zMnMxNC4zMjctMzIgMzItMzJoMzcwLjc0NWwtNTguNzUxLTU4Ljc1Yy0xMi40OTYtMTIuNDk3LTEyLjQ5Ni0zMi43NTggMC00NS4yNTUgMTIuNDk4LTEyLjQ5NyAzMi43NTgtMTIuNDk3IDQ1LjI1NiAwbDExMy4zNzggMTEzLjM3OGMxMi40OTYgMTIuNDk2IDEyLjQ5NiAzMi43NTggMCA0NS4yNTR6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIj48L3BhdGg+PC9nPjwvc3ZnPg=="
                  />
                  <a onClick={claim_manually} className="btn btn-blue fs-18 rounded-pill">
                    {" "}
                    Claim Manually{" "}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Dashboard End */}
    {/* Footer Start */}
    <footer className="py-4 py-md-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6">
            <div className="footer-text size-wrap">
              <p className="fs-14 fw-normal text-light mb-0">
                © All Rights reserved by FlyGuyz.io
              </p>
            </div>
          </div>
          <div className="col-6">
            <div className="size-wrap">
              <ul className="list-unstyled d-flex align-items-center justify-content-end flex-row m-0 p-0">
                <li className="me-3">
                  <a
                    href="https://mobile.twitter.com/flyguyzofficial"
                    target="_blank"
                  >
                    <img
                      alt="twitter"
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjQuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIKCSBpZD0ic3ZnMiIgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC40IHI5OTM5IiBzb2RpcG9kaTpkb2NuYW1lPSJUd2l0dGVyX2JpcmRfbG9nb18yMDEyLnN2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxNzEuNSAxMzkuNCIKCSBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNzEuNSAxMzkuNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8c29kaXBvZGk6bmFtZWR2aWV3ICBib3JkZXJjb2xvcj0iIzY2NjY2NiIgYm9yZGVyb3BhY2l0eT0iMS4wIiBmaXQtbWFyZ2luLWJvdHRvbT0iMCIgZml0LW1hcmdpbi1sZWZ0PSIwIiBmaXQtbWFyZ2luLXJpZ2h0PSIwIiBmaXQtbWFyZ2luLXRvcD0iMCIgaWQ9ImJhc2UiIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgaW5rc2NhcGU6Y3g9IjEwMS4yOTQxMyIgaW5rc2NhcGU6Y3k9IjUwLjE4MTE0MiIgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9InB4IiBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIiBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIiBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI5NjIiIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTI4MCIgaW5rc2NhcGU6d2luZG93LXg9Ii04IiBpbmtzY2FwZTp3aW5kb3cteT0iLTgiIGlua3NjYXBlOnpvb209IjMuNzIwMDU3MSIgcGFnZWNvbG9yPSIjZmZmZmZmIiBzaG93Z3JpZD0iZmFsc2UiPgoJPC9zb2RpcG9kaTpuYW1lZHZpZXc+CjxnIGlkPSJsYXllcjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yODIuMzIwNTMsLTM5Ni4zMDczNCkiIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIj4KCTxwYXRoIGlkPSJwYXRoNSIgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgY2xhc3M9InN0MCIgZD0iTTQ1My44LDQxMi44Yy02LjMsMi44LTEzLjEsNC43LTIwLjIsNS41CgkJYzcuMy00LjQsMTIuOC0xMS4yLDE1LjUtMTkuNWMtNi44LDQtMTQuMyw3LTIyLjMsOC41Yy02LjQtNi44LTE1LjYtMTEuMS0yNS43LTExLjFjLTE5LjQsMC0zNS4yLDE1LjgtMzUuMiwzNS4yCgkJYzAsMi44LDAuMyw1LjQsMC45LDhjLTI5LjItMS41LTU1LjItMTUuNS03Mi41LTM2LjhjLTMsNS4yLTQuOCwxMS4yLTQuOCwxNy43YzAsMTIuMiw2LjIsMjMsMTUuNywyOS4zYy01LjgtMC4yLTExLjItMS44LTE1LjktNC40CgkJYzAsMC4xLDAsMC4zLDAsMC40YzAsMTcsMTIuMSwzMS4zLDI4LjIsMzQuNWMtMywwLjgtNi4xLDEuMi05LjMsMS4yYy0yLjMsMC00LjUtMC4yLTYuNi0wLjZjNC41LDE0LDE3LjUsMjQuMiwzMi45LDI0LjQKCQljLTEyLDkuNC0yNy4yLDE1LjEtNDMuNywxNS4xYy0yLjgsMC01LjYtMC4yLTguNC0wLjVjMTUuNiwxMCwzNC4xLDE1LjgsNTMuOSwxNS44YzY0LjcsMCwxMDAuMS01My42LDEwMC4xLTEwMC4xCgkJYzAtMS41LDAtMy0wLjEtNC42QzQ0My4xLDQyNi4xLDQ0OS4xLDQxOS45LDQ1My44LDQxMi44TDQ1My44LDQxMi44eiIvPgo8L2c+Cjwvc3ZnPgo="
                      width={25}
                      height={25}
                    />
                  </a>
                </li>
                <li className="ms-3">
                  <a href="https://t.me/flyguyz_official" target="_blank">
                    <img
                      src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' fill='%23fff' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 300 300' style='enable-background:new 0 0 300 300;' xml:space='preserve'%3E%3Cg id='XMLID_496_'%3E%3Cpath id='XMLID_497_' d='M5.299,144.645l69.126,25.8l26.756,86.047c1.712,5.511,8.451,7.548,12.924,3.891l38.532-31.412 c4.039-3.291,9.792-3.455,14.013-0.391l69.498,50.457c4.785,3.478,11.564,0.856,12.764-4.926L299.823,29.22 c1.31-6.316-4.896-11.585-10.91-9.259L5.218,129.402C-1.783,132.102-1.722,142.014,5.299,144.645z M96.869,156.711l135.098-83.207 c2.428-1.491,4.926,1.792,2.841,3.726L123.313,180.87c-3.919,3.648-6.447,8.53-7.163,13.829l-3.798,28.146 c-0.503,3.758-5.782,4.131-6.819,0.494l-14.607-51.325C89.253,166.16,91.691,159.907,96.869,156.711z'/%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A"
                      alt="Instagram"
                      width={25}
                      height={25}
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
    {/* Footer End */}
</div>
</div>
      {/* IFX Stake Model End */}
      {/* jQuery JS */}
      {/* Bootstrap JS */}
</div>
  );
}

export default App;
