# D-Altruist

[![Build Status](https://travis-ci.com/jvanecek/d-altruist.svg?branch=master)](https://travis-ci.com/jvanecek/d-altruist)

This repository hosts the final project for a course of Ethereum and SmartContracts. Is a DApp for ethers donations.

A [PPT](https://docs.google.com/presentation/d/1_c2FpUN39uhK3S3j8Cy7G3Zi9_ZBmv5ayXdMvChX6Ms/edit?usp=sharing) presentation in spanish is available.

## Installation

1. Install truffle and an ethereum client. For local development, try EthereumJS TestRPC.
    ```shell
    npm install -g truffle
    npm install -g ethereumjs-testrpc
    truffle version
    # Truffle v4.0.1 (core: 4.0.1)
    # Solidity v0.4.18 (solc-js)
    ```

2. Install dependencies.
    ```shell
    npm install
    ```

3. Run testrpc on a separate terminal
    ```shell
    npm run start_rpc
    ```

4. Compile the contracts and deploy.
    ```shell
    truffle migrate
    ```

5. Run the tests.
    ```shell
    truffle test
    ```

6. Run the web app.
    ```shell
    npm run start # and navigate to http://localhost:4200
    ```
