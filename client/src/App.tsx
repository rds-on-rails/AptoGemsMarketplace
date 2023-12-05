import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button } from "antd";
import { Provider, Network } from "aptos";
import { useState, useEffect } from "react";

import { useWallet } from "@aptos-labs/wallet-adapter-react";


function App() {
  const provider = new Provider(Network.TESTNET);

  const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  useEffect(() => {
    fetchList();
  }, [account?.address]);

  const moduleAddress = "0xcbddf398841353776903dbab2fdaefc54f181d07e114ae818b1a67af28d1b018";
  const fetchList = async () => {
    if (!account) return [];
    // change this to be your module account address
   
    try {
      const TodoListResource = await provider.getAccountResource(
        account.address,
        `${moduleAddress}::todolist::TodoList`
      );
      setAccountHasList(true);
    } catch (e: any) {
      setAccountHasList(false);
    }
  };

  const addNewList = async () => {
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::todolist::create_list`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    }
  };

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>Our todolist</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      {!accountHasList && (
        <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
          <Col span={8} offset={8}>
            <Button onClick={addNewList} block type="primary" style={{ height: "40px", backgroundColor: "#3f67ff" }}>
              Add new list
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
}

export default App;


