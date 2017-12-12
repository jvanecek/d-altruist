import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import Web3 from 'web3';

import { Web3Service } from './web3.service';
import getWeb3 from '../util/get-web3'

import DonationCampaignContract from '../../../build/contracts/DonationCampaign.json';

declare let window: any;

@Injectable()
export class ContractsService {
  public initialized: boolean = false;

  public DonationCampaign: any;
  public DonationCampaignInstance: any;

  constructor(private web3Service: Web3Service) {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then((results: any) => {
      // Initialize contracts once web3 provided.
      this.initContracts(() => {
        this.initialized = true;
      });
    }).catch(() => {
      console.log('Error finding web3.');
    });

  }

  init(callback: any, retries: number = 0) {
    if (retries > 10) {
      return;
    }
    if (this.initialized) {
      return callback();
    }
    setTimeout(() => {
      return this.init(callback, retries++);
    }, 100);
  }

  async initContracts(callback: any) {

    console.log( "Por inicializar los contratos" );

    await this.web3Service.artifactsToContract(DonationCampaignContract)
      .then(DonationCampaignContractAbstraction => this.DonationCampaign = DonationCampaignContractAbstraction
      );
    this.DonationCampaignInstance = await this.DonationCampaign.deployed();

    console.log( "Contratos inicializados." );

    callback();
  }

}
